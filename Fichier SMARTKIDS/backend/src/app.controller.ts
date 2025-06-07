import { Controller, Get, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { PublicAccess } from './app/auth/decorators/public-access.decorator';
import { createReadStream } from 'fs';
import { APP_DIR } from './core/constants/dir.constants';
import { join } from 'path';
import { Response } from 'express';

@PublicAccess()
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('contract-vtc.pdf')
  async downloadContractVtc(@Res() res: Response) {
    const r_Stream = createReadStream(
      join(APP_DIR, 'uploads/contract-chauffeur.pdf'),
    );

    res.set({
      'Content-Type': 'application/pdf',
    });

    r_Stream.pipe(res, {
      end: true,
    });
  }
}
