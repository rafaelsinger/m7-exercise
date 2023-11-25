import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleService } from './schedule.service';
import { ScheduleController } from './schedule.controller';
import { ScheduleEntity } from './schedule.entity';
import { ShiftModule } from '../shift/shift.module';
import { NurseModule } from '../nurse/nurse.module';
import { NurseShiftPreferenceModule } from '../nurseShiftPreference/nurseShiftPreference.module';
import { PreferenceModule } from '../preference/preference.module';

@Module({
  imports: [NurseShiftPreferenceModule, PreferenceModule, ShiftModule, NurseModule, TypeOrmModule.forFeature([ScheduleEntity])],
  exports: [TypeOrmModule],
  providers: [ScheduleService],
  controllers: [ScheduleController],
})
export class ScheduleModule {}
