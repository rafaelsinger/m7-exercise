import { Injectable } from '@nestjs/common';
import { NurseShiftPreferenceEntity } from './nurseShiftPreference.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PreferenceService } from '../preference/preference.service';
import { CreateNurseShiftPreferenceDto } from './createNurseShiftPreference.dto';

@Injectable()
export class NurseShiftPreferenceService {
    constructor(
        @InjectRepository(NurseShiftPreferenceEntity)
        private nurseShiftPreferenceRepository: Repository<NurseShiftPreferenceEntity>,
        private preferenceService: PreferenceService
    ) {}

    async createNurseShiftPreference(createNurseShiftPreferenceDto: CreateNurseShiftPreferenceDto): Promise<NurseShiftPreferenceEntity> {
        const nurseId = createNurseShiftPreferenceDto.nurseId;
        const preference = await this.preferenceService.getOrCreatePreference(createNurseShiftPreferenceDto);
        const nurseShiftPreference = this.nurseShiftPreferenceRepository.create({
            nurse: { id: nurseId },
            preference: { id: preference.id }
        });

        return this.nurseShiftPreferenceRepository.save(nurseShiftPreference);
    }
}
