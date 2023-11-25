import { IsInt, Min, Max, IsDate } from 'class-validator';
import { ShiftType } from '../schedule/schedule.entity';

export class CreateShiftDto {
  @IsDate()
  date: Date;

  @IsInt()
  type: ShiftType; 
}
