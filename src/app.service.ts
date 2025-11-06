import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { DTO } from './app.controller';

@Injectable()
export class AppService {
  private readonly filePath = path.join(__dirname, '..', 'foglalasok.csv');

  async saveFormData(data: DTO, viewers: number) {
    const line = `${data.name};${data.email};${data.date};${viewers}\n`;
    fs.appendFileSync(this.filePath, line, 'utf8');
  }
}
