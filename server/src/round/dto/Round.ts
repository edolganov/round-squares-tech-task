import { ApiProperty } from '@nestjs/swagger';

export class Round {
  @ApiProperty() id!: string;
  @ApiProperty() visibleAt!: string;
  @ApiProperty() startAt!: string;
  @ApiProperty() endAt!: string;
  @ApiProperty({ required: false }) winner?: string;
  @ApiProperty({ required: false }) winnerScore?: number;
}
