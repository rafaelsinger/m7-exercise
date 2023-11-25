import { Injectable } from '@nestjs/common';
import { NurseEntity } from './nurse.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PreferenceEntity } from '../preference/preference.entity';
import { NurseShiftPreferenceEntity } from '../nurseShiftPreference/nurseShiftPreference.entity';
import { ShiftEntity } from '../shift/shift.entity';

@Injectable()
export class NurseService {
  constructor(
    @InjectRepository(NurseEntity)
    private nurseRepository: Repository<NurseEntity>,
    @InjectRepository(NurseShiftPreferenceEntity)
    private nurseShiftPreferenceRepository: Repository<NurseShiftPreferenceEntity>,
    @InjectRepository(ShiftEntity)
    private shiftRepository: Repository<ShiftEntity>
  ) {}

  async getNurses(): Promise<NurseEntity[]> {
    return this.nurseRepository.find();
  }

  async getPreferencesByNurseId(id: number): Promise<PreferenceEntity[]> {
    const nurseShiftPreferences = await this.nurseShiftPreferenceRepository
      .createQueryBuilder('nurseShiftPreference')
      .leftJoinAndSelect('nurseShiftPreference.preference', 'preference')
      .where('nurseShiftPreference.nurseId = :nurseId', { nurseId: id })
      .getMany();
    return nurseShiftPreferences.map(nsp => nsp.preference);
  }

  async findNursesByDayPreference(dayOfWeek: string, shiftType: string): Promise<NurseEntity[]> {
    return this.nurseRepository.createQueryBuilder('nurse')
      .innerJoinAndSelect('nurse.preferences', 'nurseShiftPreference')
      .innerJoinAndSelect('nurseShiftPreference.preference', 'preference')
      .where('preference.dayOfWeek = :dayOfWeek', {dayOfWeek})
      .andWhere('preference.type = :shiftType', {shiftType})
      .orderBy('preference.preferenceStrength', 'DESC')
      .getMany();
  }

  async getNurseByShift(shiftId: number): Promise<NurseEntity | null> {
    const shift = await this.shiftRepository.findOne({
        where: { id: shiftId },
        relations: ['nurse']
    });

    return shift ? shift.nurse : null;
  }

  // async setPreferences(id: number, preferences: any): Promise<NurseEntity> {
  //   const nurse = await this.nurseRepository.findOneByOrFail({id});
  //   if (!nurse) {
  //     throw new Error(`Nurse with ID ${id} not found`);
  //   }
  //   nurse.preferences = preferences;
  //   return this.nurseRepository.save(nurse);
  // }
}
