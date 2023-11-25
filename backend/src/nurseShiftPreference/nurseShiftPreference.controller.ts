import { Controller, Post, Body } from '@nestjs/common';
import { NurseShiftPreferenceService } from './nurseShiftPreference.service';
import { NurseShiftPreferenceEntity } from './nurseShiftPreference.entity';
import { CreateNurseShiftPreferenceDto } from './createNurseShiftPreference.dto';

@Controller('nurse-shift-preferences')
export class NurseShiftPreferenceController {
    constructor(private readonly nurseShiftPreference: NurseShiftPreferenceService) {}

    @Post()
    async createNurseShiftPreference(@Body() createNurseShiftPreferenceDto: CreateNurseShiftPreferenceDto): Promise<NurseShiftPreferenceEntity> {
        return this.nurseShiftPreference.createNurseShiftPreference(createNurseShiftPreferenceDto);
    }
}
