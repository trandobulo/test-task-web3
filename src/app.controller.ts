import { Controller, Get, HttpException, HttpStatus, Param } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get('balance/:token_addr/:user_addr')
  async getBalance(
    @Param('token_addr') token_addr: string,
    @Param('user_addr') user_addr: string,
  ) {
    try {
      return await this.appService.getBalance({ token_addr, user_addr });
    } catch (e) {
      return new HttpException(e, HttpStatus.BAD_REQUEST);
    }
  }
}