import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PreferenceService } from './preference.service';
import { PreferenceController } from './preference.controller';
import { PreferenceEntity } from './preference.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PreferenceEntity])],
  exports: [TypeOrmModule, PreferenceService],
  providers: [PreferenceService],
  controllers: [PreferenceController],
})
export class PreferenceModule {}
