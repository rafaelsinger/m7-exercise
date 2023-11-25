import {
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { ShiftEntity } from '../shift/shift.entity';

export type ShiftType = 'day' | 'night';
export type ScheduleRequirements = {
  shift: ShiftType;
  nursesRequired: number;
  dayOfWeek: string;
  date: Date
};

@Entity('schedules')
export class ScheduleEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => ShiftEntity, (shift) => shift.schedule, {
      eager: true,
      // cascade: true
  })
  shifts: ShiftEntity[];

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;
}
