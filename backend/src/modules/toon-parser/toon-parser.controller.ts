import {
  Controller,
  Post,
  Get,
  Body,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { ToonParserService } from './toon-parser.service';

@ApiTags('toon')
@Controller('toon')
export class ToonParserController {
  constructor(private readonly toonParserService: ToonParserService) {}

  @Post('validate')
  @ApiOperation({ summary: 'Validate a .toon format file' })
  @ApiBody({ description: '.toon format JSON data' })
  validateToon(@Body() data: any) {
    return this.toonParserService.validateToonFormat(data);
  }

  @Post('import')
  @ApiOperation({ summary: 'Import products from .toon format file' })
  @ApiConsumes('multipart/form-data', 'application/json')
  @UseInterceptors(FileInterceptor('file'))
  async importToon(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { vendorId?: string; data?: any },
  ) {
    let toonData;

    if (file) {
      try {
        toonData = JSON.parse(file.buffer.toString());
      } catch (error) {
        throw new BadRequestException('Invalid JSON file');
      }
    } else if (body.data) {
      toonData = body.data;
    } else {
      throw new BadRequestException('No file or data provided');
    }

    // For demo purposes, use a default vendor ID
    // In production, this would come from authenticated user
    const vendorId = body.vendorId || 'default-vendor-id';

    const result = await this.toonParserService.importToonFile(
      toonData,
      vendorId,
    );

    return {
      message: 'Import completed',
      ...result,
    };
  }

  @Get('export')
  @ApiOperation({ summary: 'Export products to .toon format' })
  async exportToon(@Query('vendorId') vendorId?: string) {
    return this.toonParserService.exportToToonFormat(vendorId);
  }
}
