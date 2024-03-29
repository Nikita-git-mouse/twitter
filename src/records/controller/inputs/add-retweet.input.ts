import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';

import { IsBoolean, isNumber, IsNumber, IsString } from 'class-validator';
import { IRecord } from 'src/records/entity/record.model';

export class AddRetweetInput {
  @ApiProperty({ type: Number, nullable: false })
  @IsNumber()
  @Type(() => Number)
  recordId: number;
  
}