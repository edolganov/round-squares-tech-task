import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

interface Props {
  isOptional?: boolean;
  isString?: boolean;
  isNumber?: boolean;
  isNumberString?: boolean;
  isDateString?: boolean;
  isUUID?: boolean;
}

export function ReqParam({
  isOptional,
  isString,
  isNumber,
  isNumberString,
  isDateString,
  isUUID,
}: Props) {
  return applyDecorators(
    ...[ApiProperty({ required: !isOptional })],
    ...(!isOptional ? [IsNotEmpty()] : []),
    ...(isOptional ? [IsOptional()] : []),
    ...(isString ? [IsString()] : []),
    ...(isNumber ? [IsNumber()] : []),
    ...(isNumberString ? [IsNumberString()] : []),
    ...(isDateString ? [IsDateString()] : []),
    ...(isUUID ? [IsUUID()] : []),
  );
}
