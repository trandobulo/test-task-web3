import { Controller, Get, HttpException, HttpStatus, Param, Post, Headers, Body } from '@nestjs/common';
import { AppService } from './app.service';
import { ITransferData } from './types';

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

  @Post()
  async transfer(
    @Headers('Authorization') authorization: string,
    @Body() transferData: ITransferData
  ) {

    try {
      const secretKey = authorization.replace('Bearer ', '');
      return await this.appService.transfer(transferData, secretKey);
    } catch (e) {
      return new HttpException(e, HttpStatus.BAD_REQUEST);
    }
  }
}