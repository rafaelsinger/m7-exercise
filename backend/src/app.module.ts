import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NurseModule } from './nurse/nurse.module';
import { ShiftModule } from './shift/shift.module';
import { PreferenceModule } from './preference/preference.module';
import { ScheduleModule } from './schedule/schedule.module';
import { NurseController } from './nurse/nurse.controller';
import { ScheduleController } from './schedule/schedule.controller';
import { PreferenceController } from './preference/preference.controller';
import { ShiftController } from './shift/shift.controller';
import { NurseService } from './nurse/nurse.service';
import { ScheduleService } from './schedule/schedule.service';
import { ShiftService } from './shift/shift.service';
import { PreferenceService } from './preference/preference.service';
import { typeOrmMySQLConfig } from './ormconfig';
import { NurseShiftPreferenceController } from './nurseShiftPreference/nurseShiftPreference.controller';
import { NurseShiftPreferenceModule } from './nurseShiftPreference/nurseShiftPreference.module';
import { NurseShiftPreferenceService } from './nurseShiftPreference/nurseShiftPreference.service';

const controllers = [
  NurseController,
  ScheduleController,
  ShiftController,
  PreferenceController,
  NurseShiftPreferenceController
];

const modules = [
  NurseModule,
  ScheduleModule,
  ShiftModule,
  PreferenceModule,
  NurseShiftPreferenceModule
];

const services = [
  NurseService,
  ScheduleService,
  ShiftService,
  PreferenceService,
  NurseShiftPreferenceService
];

@Module({
  imports: [
    TypeOrmModule.forRoot({... typeOrmMySQLConfig, autoLoadEntities: true}),
    ... modules
  ],
  controllers: [AppController, ... controllers],
  providers: [AppService, ... services],
})
export class AppModule {}
