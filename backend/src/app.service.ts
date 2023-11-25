import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class AppService {
  constructor(private readonly dataSource: DataSource){}
  getHello(): string {
    return 'Hello World!';
  }

  //deletes all tables except for nurse table
  async resetDatabase(): Promise<void> {
    await this.dataSource.query('SET FOREIGN_KEY_CHECKS=0;');
    await this.dataSource.query('TRUNCATE TABLE shifts;');
    await this.dataSource.query('TRUNCATE TABLE nurseShiftPreference;');
    await this.dataSource.query('TRUNCATE TABLE schedules;');
    await this.dataSource.query('TRUNCATE TABLE preference;');
    await this.dataSource.query('SET FOREIGN_KEY_CHECKS=1;');
  }
}
