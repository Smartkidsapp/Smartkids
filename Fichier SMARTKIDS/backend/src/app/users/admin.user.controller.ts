import {
  Controller,
  Delete,
  Get,
  Param,
  Query,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Types } from 'mongoose';
import {
  SuccessResponse,
  SuccessResponseEnum,
} from 'src/core/httpResponse/SuccessReponse';
import { OnlyRoles } from '../auth/decorators/only-roles.decorator';
import { UserRoleEnum } from './schemas/users.schema';
import { MongoIdDto } from 'src/core/dtos/mongoId.dto';
import { PaginateUsersDto } from './dto/paginate-users.dto';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('/api/v1/admin/users')
@OnlyRoles(UserRoleEnum.ADMIN)
export class AdminUserController {
  constructor(private readonly userService: UserService) {}

  @Get('/dashboard')
  async getCounts() {
    const count = await this.userService.getCounts();

    return new SuccessResponse(SuccessResponseEnum.OK, undefined, count);
  }

  @Get('/')
  async paginateUsers(@Query() paginateUsersDto: PaginateUsersDto) {
    const users = await this.userService.paginateUsers(paginateUsersDto);

    return new SuccessResponse(SuccessResponseEnum.OK, undefined, users);
  }
 
  @Get('/:id')
  async getUser(@Param() { id: userId }: MongoIdDto) {
    const user = await this.userService.getUser(userId);

    return new SuccessResponse(SuccessResponseEnum.OK, undefined, user);
  }

  @Get('/:id/can-delete')
  async canDeleteAccount(@Param() { id: userId }: MongoIdDto) {
    const res = await this.userService.canDeleteUserAccount(
      new Types.ObjectId(userId),
    );

    if (res.status !== 'OK') {
      throw new UnauthorizedException(res.code);
    }

    return new SuccessResponse(SuccessResponseEnum.OK, undefined);
  }

  @Delete('/:id')
  deleteUser(@Param() { id: userId }: MongoIdDto) {
    return this.userService.deleteUserAccount(userId, false);
  }
}
