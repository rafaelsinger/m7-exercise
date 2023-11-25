import { Injectable, NotImplementedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { ScheduleEntity, ScheduleRequirements } from './schedule.entity';
import { ShiftService } from '../shift/shift.service';
import * as fs from 'fs';
import * as path from 'path';
import { NurseService } from '../nurse/nurse.service';
import { NurseEntity } from '../nurse/nurse.entity';
import { ShiftEntity } from '../shift/shift.entity';
import { NurseShiftPreferenceEntity } from '../nurseShiftPreference/nurseShiftPreference.entity';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectRepository(ScheduleEntity)
    private readonly scheduleRepository: Repository<ScheduleEntity>,
	@InjectRepository(ShiftEntity)
	private readonly shiftRepository: Repository<ShiftEntity>,
	@InjectRepository(NurseEntity)
	private readonly nurseRepository: Repository<NurseEntity>,

    private nurseService: NurseService,
    private shiftService: ShiftService,
  ) {}
							
	async assignShift(req: ScheduleRequirements, nurse: NurseEntity, schedule: ScheduleEntity): Promise<ShiftEntity> {
		//create new shift for given date/time and assign to nurse
		const shift = await this.shiftService.createShift(req.date, req.shift);
		shift.nurse = nurse;
		await this.shiftRepository.save(shift);
	
		//update schedule with new shift 
		schedule.shifts = [...schedule.shifts, shift];
		await this.scheduleRepository.save(schedule);
	
		//return new shift
		return shift;
	}
	
	async getRemainingNurses(): Promise<NurseEntity[]> {
		//sorts nurses first by number of assigned shifts in ascending order then number of preferences
		return this.nurseRepository.createQueryBuilder("nurse")
			.leftJoinAndSelect("nurse.preferences", "preferences")
			.leftJoinAndSelect("nurse.shifts", "shifts")
			.leftJoin(subQuery => {
				return subQuery.from(NurseShiftPreferenceEntity, "preference")
					.select("preference.nurseId", "nurseId")
					.addSelect("COUNT(*)", "preferenceCount")
					.groupBy("preference.nurseId")
			}, "preferenceCount", "preferenceCount.nurseId = nurse.id")
			.leftJoin(subQuery => {
				return subQuery.from(ShiftEntity, "shift")
					.select("shift.nurseId", "nurseId")
					.addSelect("COUNT(*)", "shiftCount")
					.groupBy("shift.nurseId")
			}, "shiftCount", "shiftCount.nurseId = nurse.id")
			.orderBy("preferenceCount.preferenceCount", "ASC")
			.addOrderBy("shiftCount.shiftCount", "ASC")
			.getMany();
	}

	//compares two nurses based on total strength of preferences
	comparePreferences(nurseA: NurseEntity, nurseB: NurseEntity): number {
		// calculate the total preference strength for each nurse by summing up each nurse's preferenceStrength
		const totalPreferenceStrengthA = nurseA.preferences.reduce((total, nurseShiftPref) => total + (nurseShiftPref.preference?.preferenceStrength || 0), 0);
		const totalPreferenceStrengthB = nurseB.preferences.reduce((total, nurseShiftPref) => total + (nurseShiftPref.preference?.preferenceStrength || 0), 0);
		
		if (totalPreferenceStrengthA > totalPreferenceStrengthB) {
			return -1; //nurse A has higher preference strength, so it comes first
		} else if (totalPreferenceStrengthA < totalPreferenceStrengthB) {
			return 1; //nurse B has higher preference strength, so it comes first
		} else {
			return 0; //equal preference strength
		}
	}

	calculateAverageShifts(nurseShiftCounts: Map<number, number>): number {
		let totalShifts = 0;
		let nurseCount = 0;

		nurseShiftCounts.forEach(shiftCount => {
			totalShifts += shiftCount;
			nurseCount++;
		})

		//to prevent division by zero
		return nurseCount > 0 ? totalShifts / nurseCount : 0;
	}

	//3 main constraints: 1) filling all shifts 2) all nurses have relatively even number of shifts 3) fulfill as many preferences as possible
	async generateSchedule(startDate: Date, endDate: Date): Promise<ScheduleEntity> {
		//initialize map to keep track of the number of shifts assigned to each nurse, maps id to number of shifts assigned
		const nurseShiftCounts = new Map<number, number>();
	
		//initialize new schedule
		const schedule = new ScheduleEntity();
		schedule.shifts = [];
		await this.scheduleRepository.save(schedule);
	
		//fetch schedule requirements and filter them by input date range
		const scheduleRequirements = await this.getScheduleRequirements();
		const currentScheduleRequirements = scheduleRequirements.filter(req => req.date >= startDate && req.date <= endDate);
	
		// go through all requirements within date range
		for (const req of currentScheduleRequirements) {
			//set tracks nurses assigned to a shift on this particular day/time to avoid double scheduling
			const assignedNurseIds = new Set<number>();

			//find nurses with preferences for this day/time, assigning them first
			let nursesWithPreference = await this.nurseService.findNursesByDayPreference(req.dayOfWeek, req.shift);

			//sort nurses with preferences by number of shifts assigned in ascending order
			nursesWithPreference = nursesWithPreference.sort((a, b) => (nurseShiftCounts.get(a.id) || 0) - (nurseShiftCounts.get(b.id) || 0));
			let shiftsAssigned = 0;
	
			for (const nurse of nursesWithPreference) {
				//calculate average shifts to act as threshold to prevent nurses with lots of preferences being assigned more than others 
				const averageShifts = this.calculateAverageShifts(nurseShiftCounts);
				//if we still need to assign nurses for this day/time and the nurse with a preference for this day/time hasn't already been assigned to this day/time
				if (shiftsAssigned < req.nursesRequired && !assignedNurseIds.has(nurse.id)) {
					//if the number of shifts this nurse has been assigned is below or at the threshold
					if ((nurseShiftCounts.get(nurse.id) || 0 ) <= averageShifts) {
						await this.assignShift(req, nurse, schedule);
						shiftsAssigned++;
						assignedNurseIds.add(nurse.id);
						nurseShiftCounts.set(nurse.id, (nurseShiftCounts.get(nurse.id) || 0) + 1);
					}
				}
			}
	
			while (shiftsAssigned < req.nursesRequired) {
				//assign remaining nurses if we haven't met the number of required shifs yet
				const remainingNurses = await this.getRemainingNurses();

				//sort based off lower shift count (for this schedule), if same, choose the one with lower preference strength 
				const sortedRemainingNurses = remainingNurses.sort((a, b) =>
					(nurseShiftCounts.get(a.id) || 0) - (nurseShiftCounts.get(b.id) || 0) || this.comparePreferences(a, b) 
				);
				
				//first nurse in sorted array will be the best candidate to assign
				const selectedNurse = sortedRemainingNurses[0];
				await this.assignShift(req, selectedNurse, schedule);
				shiftsAssigned++;
				nurseShiftCounts.set(selectedNurse?.id, (nurseShiftCounts.get(selectedNurse?.id) || 0) + 1);
			}
		}
	
		return schedule;
	}
	
	async getSchedules(): Promise<any> {
		return this.scheduleRepository.find();
	}
	
	async getScheduleById(id: number): Promise<any> {
    return this.scheduleRepository.findOneByOrFail({id});
  }

  async getScheduleRequirements(): Promise<ScheduleRequirements[]> {
    const filePath = path.join(process.cwd(), './src/schedule/scheduleRequirements.json');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const scheduleRequirements: ScheduleRequirements[] = (JSON.parse(fileContents)["scheduleRequirements"]); 
    return scheduleRequirements;
  }
}
