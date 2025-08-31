import { ApiProperty } from '@nestjs/swagger';

export class RoundInfo {
  @ApiProperty() roundId!: string;
  @ApiProperty() userScore!: number;
  @ApiProperty({ required: false }) winner?: string;
  @ApiProperty({ required: false }) winnerScore?: number;
  @ApiProperty({ required: false }) totalScore?: number;
}
