import { Body, Controller, Get, Param, Post, Query, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { PaymentService } from './payment.service';
//import { PaginateRidesDto } from '../rides/dto/paginate-rides.dto';
import { Request } from 'express';
import { CountPaymentDto } from './dtos/count-payments.dto';
import { CreatePaymentDto } from './dtos/create-payment.dto';
import { PaginatePaymentsDto } from './dtos/paginate-payments.dto';
import { SuccessResponse, SuccessResponseEnum } from 'src/core/httpResponse/SuccessReponse';
import { UserPaymentDto } from './dtos/user-payments.dto';

@ApiTags('Payments')
@ApiBearerAuth()
@Controller('/api/v1/payments')
export class PaymentsController {
  constructor(private readonly paymentService: PaymentService) { }

  @Get('/')
  async paginate(
    @Req() request: Request,
    @Query() paginateRideDto: PaginatePaymentsDto,
  ) {
    const userId = request.user.sub;
    return this.paymentService.paginate(paginateRideDto, userId);
  }

  @Get('/user')
  async findBoostagesByUser(
    @Req() request: Request,
    @Query() userPaymentDto: UserPaymentDto
  ) {
    const userId = request.user.sub;

    const payments = await this.paymentService.findBoostagesByUser(userId, userPaymentDto);

    return new SuccessResponse(SuccessResponseEnum.OK, undefined, payments);
  }

  @Get('payment-counts')
  async countByStatus(
    @Req() request: Request,
    @Query() countDto: CountPaymentDto,
  ) {
    const userId = request.user.sub;
    const res = await this.paymentService.count(countDto, userId);

    return {
      data: res,
    };
  }
}
