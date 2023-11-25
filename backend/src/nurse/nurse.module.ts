import { Module } from '@nestjs/common';  
import { TypeOrmModule } from '@nestjs/typeorm';  
import { NurseEntity } from './nurse.entity';  
import { NurseController } from './nurse.controller';  
import { NurseService } from './nurse.service';  
import { NurseShiftPreferenceModule } from '../nurseShiftPreference/nurseShiftPreference.module';
import { PreferenceModule } from '../preference/preference.module';
import { ShiftModule } from '../shift/shift.module';

@Module({  
  imports: [PreferenceModule, NurseShiftPreferenceModule, ShiftModule, TypeOrmModule.forFeature([NurseEntity])],  
  exports: [TypeOrmModule, NurseService],
  providers: [NurseService],  
  controllers: [NurseController]  
})  
export class NurseModule {}
