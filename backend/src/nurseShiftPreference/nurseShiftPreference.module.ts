import { Module } from '@nestjs/common';  
import { TypeOrmModule } from '@nestjs/typeorm';  
import { NurseShiftPreferenceEntity } from './nurseShiftPreference.entity';  
import { NurseShiftPreferenceController } from './nurseShiftPreference.controller';  
import { NurseShiftPreferenceService } from './nurseShiftPreference.service'; 
import { PreferenceModule } from '../preference/preference.module';

@Module({  
  imports: [PreferenceModule, TypeOrmModule.forFeature([NurseShiftPreferenceEntity])],  
  exports: [TypeOrmModule, NurseShiftPreferenceService],
  providers: [NurseShiftPreferenceService],  
  controllers: [NurseShiftPreferenceController]  
})  
export class NurseShiftPreferenceModule {}
