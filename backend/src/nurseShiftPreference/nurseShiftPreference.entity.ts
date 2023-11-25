import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    ManyToOne,
    JoinColumn,
  } from 'typeorm';

  import { PreferenceEntity } from '../preference/preference.entity';
  import { NurseEntity } from '../nurse/nurse.entity';

  @Entity('nurseShiftPreference')
  export class NurseShiftPreferenceEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => NurseEntity, nurse => nurse.preferences)
    @JoinColumn({name: 'nurseId'})
    nurse: NurseEntity
    
    @ManyToOne(() => PreferenceEntity, preference => preference.nurses)
    @JoinColumn({name: 'preferenceId'})
    preference: PreferenceEntity    
  }
