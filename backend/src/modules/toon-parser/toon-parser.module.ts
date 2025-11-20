import { Module } from '@nestjs/common';
import { ToonParserService } from './toon-parser.service';
import { ToonParserController } from './toon-parser.controller';

@Module({
  controllers: [ToonParserController],
  providers: [ToonParserService],
  exports: [ToonParserService],
})
export class ToonParserModule {}
