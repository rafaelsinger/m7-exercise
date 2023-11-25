import { IsInt } from 'class-validator';
import { CreatePreferenceDto } from '../preference/createPreference.dto';

export class CreateNurseShiftPreferenceDto extends CreatePreferenceDto{
  @IsInt()
  nurseId: number;
}
