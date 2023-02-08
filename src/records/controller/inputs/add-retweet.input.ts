import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';

import { IsBoolean, isNumber, IsNumber, IsString } from 'class-validator';
import { IRecord } from 'src/records/entity/record.model';

export class AddRetweetInput {
  @ApiProperty({ type: Boolean, nullable: false })
  @Transform(({ value }) => {
    return Boolean(value === 'true');
  })
  @IsBoolean()
  access: boolean;

  @ApiProperty({ type: String, nullable: false })
  @IsString()
  fileName: string;

  @ApiProperty({ type: 'string', format: 'binary', required: true })
  record: Express.Multer.File;

  @ApiProperty({ type: Number, nullable: false })
  @IsNumber()
  @Type(() => Number)
  recordId: number;
  
}