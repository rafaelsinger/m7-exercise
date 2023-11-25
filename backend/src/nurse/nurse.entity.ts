import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm';

import { ShiftEntity } from '../shift/shift.entity';
import { NurseShiftPreferenceEntity } from '../nurseShiftPreference/nurseShiftPreference.entity';


@Entity('nurses')
export class NurseEntity {
  // would probably switch to "uuid" instead of simple number
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 500 })
  name: string;

  @OneToMany(() => NurseShiftPreferenceEntity, nurseShiftPreference => nurseShiftPreference.nurse, {
    eager: true
  })
  preferences: NurseShiftPreferenceEntity[];

  @OneToMany(() => ShiftEntity, shift => shift.nurse)
  shifts: ShiftEntity[];
}
