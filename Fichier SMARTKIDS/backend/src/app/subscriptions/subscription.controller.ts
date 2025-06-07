import {
  Controller,
  Param,
  Delete,
  Req,
  Body,
  Get,
  Put,
  Query,
} from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { Request } from 'express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { MongoIdDto } from 'src/core/dtos/mongoId.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { PaginateSubscriptionsDto } from './dto/paginate-subscriptions.dto';
import { CountSubscriptionsDto } from './dto/count-subscriptions.dto';
import { PaySubscriptionDto } from './dto/pay-subscription.dto';
import { OnlyRoles } from '../auth/decorators/only-roles.decorator';
import { UserRoleEnum } from '../users/schemas/users.schema';
import { SuccessResponse, SuccessResponseEnum } from 'src/core/httpResponse/SuccessReponse';

@ApiTags('Subscriptions')
@ApiBearerAuth()
@Controller('')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Put('subscriptions/setup')
  async installSubscription(
    @Req() request: Request,
    @Body() paySubscriptionDto: PaySubscriptionDto,
  ) {
    console.log('setup')
    const res = await this.subscriptionService.setupUserSubscription(
      paySubscriptionDto,
      request.user.sub,
    );

    return {
      message: 'Votre abonnement a été créé avec succès.',
      data: res,
    };
  }

  @Put('subscriptions/:id/change-plan')
  async changeSubscriptionPlan(
    @Param() { id }: MongoIdDto,
    @Body() updatePlanDto: UpdateSubscriptionDto,
    @Req() request: Request,
  ) {
    console.log('change')
    const res = await this.subscriptionService.changeSubscriptionPlan(
      request.user.sub,
      id,
      updatePlanDto,
    );

    return {
      message: 'Votre plan a été changé avec succès.',
      data: res,
    };
  }

  @Delete('subscriptions/:id')
  async cancel(@Param() { id }: MongoIdDto, @Req() request: Request) {
    const res = await this.subscriptionService.cancel(request.user.sub, id);

    return res;
  }

  @Delete('subscriptions/:id/cancelation')
  async cancelCancelation(
    @Param() { id }: MongoIdDto,
    @Req() request: Request,
  ) {
    const res = await this.subscriptionService.cancelCancelation(
      request.user.sub,
      id,
    );

    return res;
  }

  @Get('/users/me/subscription')
  async getCurrent(@Req() request: Request) {
    const currentSubscription =  await this.subscriptionService.getUserSubScription(request.user.sub);
    return new SuccessResponse(SuccessResponseEnum.OK, undefined, currentSubscription);
  }

  @Get('subscriptions/user/:userId')
  async getUserSubscriptions(@Param('userId') userId: string) {
    const subscriptions = await this.subscriptionService.findByUserId(userId);
    return new SuccessResponse(SuccessResponseEnum.OK, undefined, subscriptions);
  }


  @Put('paypal-subscriptions/:id/approve')
  async approvePaypalSubscription(@Param('id') id: string) {
    await this.subscriptionService.approvePaypalSubscription(id);

    return {
      message: 'Abonnement approuvé avec succès',
    };
  }

  @OnlyRoles(UserRoleEnum.ADMIN)
  @Get('subscriptions')
  async paginate(
    @Req() request: Request,
    @Query() paginateSubscriptionDto: PaginateSubscriptionsDto,
  ) {
    const userId = request.user.sub;
    return this.subscriptionService.paginate(paginateSubscriptionDto, userId);
  }

  @OnlyRoles(UserRoleEnum.ADMIN)
  @Get('subscription-counts')
  async countByStatus(
    @Req() request: Request,
    @Query() countDto: CountSubscriptionsDto,
  ) {
    const userId = request.user.sub;
    const res = await this.subscriptionService.count(countDto, userId);

    return {
      data: res,
    };
  }
}
