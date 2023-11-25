import { Injectable } from '@nestjs/common';
import { PreferenceEntity } from './preference.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePreferenceDto } from './createPreference.dto';

@Injectable()
export class PreferenceService {
    constructor(
        @InjectRepository(PreferenceEntity)
        private preferenceRepository: Repository<PreferenceEntity>,
    ) {}

    public async getOrCreatePreference(createPreferenceDto: CreatePreferenceDto): Promise<PreferenceEntity> {
        const { dayOfWeek, type, preferenceStrength } = createPreferenceDto
        let preference = await this.preferenceRepository.findOneBy({ dayOfWeek, type, preferenceStrength });

        if (!preference) {
            preference = new PreferenceEntity();
            preference.dayOfWeek = dayOfWeek;
            preference.type = type;
            preference.preferenceStrength = preferenceStrength;
            await this.preferenceRepository.save(preference);
        }

        return preference;
    }

    // to do: add update and delete functions, maybe add 'active' property to preference to disable without deleting

}
