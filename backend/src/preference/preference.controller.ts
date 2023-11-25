import { Controller, Post, Body } from '@nestjs/common';
import { PreferenceService } from './preference.service';
import { PreferenceEntity } from './preference.entity';
import { CreatePreferenceDto } from './createPreference.dto';

@Controller('preferences')
export class PreferenceController {
  constructor(private readonly preferenceService: PreferenceService) {}

  @Post()
  async getOrCreatePreference(@Body() createPreferenceDto: CreatePreferenceDto): Promise<PreferenceEntity> {
    return this.preferenceService.getOrCreatePreference(createPreferenceDto);
  }
}
