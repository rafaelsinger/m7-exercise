import { Controller, Get, Post, Body, Param } from '@nestjs/common';  
import { NurseService } from './nurse.service';  
import { NurseEntity } from './nurse.entity';  
import { PreferenceEntity } from '../preference/preference.entity';

@Controller('nurses')  
export class NurseController {  
  constructor(private readonly nurseService: NurseService) {}  

  @Get()
  async getNurses(): Promise<NurseEntity[]> {
    return this.nurseService.getNurses();
  }

  @Get('preferences/:id')
  async getPreferencesByNurseId(@Param('id') id: number): Promise<PreferenceEntity[]> {
    return this.nurseService.getPreferencesByNurseId(id);
  }

  @Get('shifts/:shiftId')
  async getNurseByShift(@Param('shiftId') shiftId: number): Promise<NurseEntity | null> {
    return this.nurseService.getNurseByShift(shiftId);
  }

  //handling preferences through separate table and API routes, don't need 
  // @Post('preferences')  
  // async setPreferences(@Body('id') id: number, @Body('preferences') preferences: string): Promise<any> {
  //   const parsedPreferences = JSON.parse(preferences);
  //   return this.nurseService.setPreferences(id, parsedPreferences);
  // }
}
