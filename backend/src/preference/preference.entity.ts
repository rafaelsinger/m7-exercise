import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
  } from 'typeorm';

  import { IsInt, Max, Min } from 'class-validator';
  import { NurseShiftPreferenceEntity } from '../nurseShiftPreference/nurseShiftPreference.entity';
  import { ShiftType } from 'src/shift/shift.entity';

  @Entity('preference')
  export class PreferenceEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 15})
    dayOfWeek: string;
  
    @Column({ type: 'varchar', length: 10 })
    type: ShiftType;

    @Column()
    @IsInt()
    @Min(1)
    @Max(5)
    preferenceStrength: number;
  
    @OneToMany(() => NurseShiftPreferenceEntity, nurseShiftPreference => nurseShiftPreference.preference)
    nurses: NurseShiftPreferenceEntity;  
  }

