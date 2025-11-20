import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHealth() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'E-Commerce Marketplace API',
      version: '1.0.0',
    };
  }
}
