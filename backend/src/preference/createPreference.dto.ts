import { IsInt, Min, Max, IsDate } from 'class-validator';
import { ShiftType } from 'src/shift/shift.entity';

export class CreatePreferenceDto {
  dayOfWeek: string;

  @IsInt()
  type: ShiftType; 

  @IsInt()
  @Min(1)
  @Max(5)
  preferenceStrength: number;
}
