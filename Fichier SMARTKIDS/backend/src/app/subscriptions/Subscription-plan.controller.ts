import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SubscriptionPlanService } from './Subscription-plan.service';
import { CreateSubscriptionPlansDto } from './dto/create-subscription-plan.dto';
import { OnlyRoles } from '../auth/decorators/only-roles.decorator';
import { UserRoleEnum } from '../users/schemas/users.schema';
import { SuccessResponse, SuccessResponseEnum } from 'src/core/httpResponse/SuccessReponse';
import { PublicAccess } from '../auth/decorators/public-access.decorator';

@ApiTags('Subscriptions-Plans')
@Controller('')
export class SubscriptionPlanController {
  constructor(
    private readonly subscriptionPlanService: SubscriptionPlanService,
  ) { }

  @PublicAccess()
  @Get('/subscription-plans')
  async listSubscriptionPlans() {
    const plans =  await this.subscriptionPlanService.list();
    return new SuccessResponse(SuccessResponseEnum.OK, undefined, plans);
  }

  @ApiBearerAuth()
  @OnlyRoles(UserRoleEnum.ADMIN)
  @Post('/subscription-plans')
  async createSubscriptionPlan(@Body() createDto: CreateSubscriptionPlansDto) {
    return await this.subscriptionPlanService.create(createDto);
  }

  @ApiBearerAuth()
  @OnlyRoles(UserRoleEnum.ADMIN)
  @Put('/subscription-plans/:id')
  async updateSubscriptionPlan(
    @Param('id') id: string,
    @Body() createDto: CreateSubscriptionPlansDto,
  ) {
    return await this.subscriptionPlanService.update(id, createDto);
  }

  @ApiBearerAuth()
  @OnlyRoles(UserRoleEnum.ADMIN)
  @Delete('/subscription-plans/:id')
  async deleteSubscriptionPlan(@Param('id') id: string) {
    await this.subscriptionPlanService.delete(id);

    return {
      message: "Plan d'abonnement supprimé avec succès.",
    };
  }
}
