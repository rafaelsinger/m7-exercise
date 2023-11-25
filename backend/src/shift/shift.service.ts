import * as fs from 'fs';
import * as path from 'path';
import { Injectable, NotFoundException, NotImplementedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ShiftEntity, ShiftRequirements, ShiftType } from './shift.entity';
import { CreateShiftDto } from './createShift.dto';

@Injectable()
export class ShiftService {
  constructor(
    @InjectRepository(ShiftEntity)
    private readonly shiftRepository: Repository<ShiftEntity>,
  ) {}

  async getAllShifts() {
    return this.shiftRepository.find();
  }

  async getShiftByDateAndType(date: Date, type: ShiftType): Promise<ShiftEntity> {
    return this.shiftRepository.findOneByOrFail({ date, type })
  }

  async getShiftsByNurse(nurseId: string) {
    try {
      return this.shiftRepository
        .createQueryBuilder('shifts')
        .innerJoinAndSelect('shifts.nurse', 'nurse')
        .where('nurse.id = :nurseId', { nurseId })
        .getMany();
    } catch (error) {
      throw new NotFoundException(`Nurse with ID ${nurseId} not found`);
    }
  }

  async getShiftsBySchedule(scheduleId: string) {
    try {
      return this.shiftRepository
        .createQueryBuilder('shifts')
        .innerJoinAndSelect('shifts.schedule', 'schedule')
        .where('schedule.id = :scheduleId', { scheduleId })
        .getMany();
    } catch (error) {
      throw new NotFoundException(`Schedule with ID ${scheduleId} not found`);
    }
  }

  async getShiftRequirements(): Promise<ShiftRequirements[]> {
    const filePath = path.join(process.cwd(), './src/shift/shiftRequirements.json');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const shiftRequirements: ShiftRequirements[] = (JSON.parse(fileContents)["shiftRequirements"]); 
    return shiftRequirements;
  }

  async getShiftByDetails(date: Date, type: ShiftType): Promise<ShiftEntity | null> {
    return await this.shiftRepository.findOneBy({ date, type });
  }

  async createShift(date: Date, type: ShiftType): Promise<ShiftEntity> {
    const shift = new ShiftEntity();
    shift.date = date;
    shift.type = type;
    return await this.shiftRepository.save(shift)
  }
}
