import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Put,
  Query,
  Req,
  UnauthorizedException,
  UploadedFile,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { SwitchRoleDto } from './dto/switch-role.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { Types } from 'mongoose';
import {
  SuccessResponse,
  SuccessResponseEnum,
} from 'src/core/httpResponse/SuccessReponse';
import authStrings from '../auth/contants/auth.strings';
import AuthResponseCode from '../auth/contants/auth-response-code';
import { ApiImageFile } from '../medias/decorators/api-file.decorator';
import { ParseImageFile } from '../medias/decorators/parse-file.pipe';
import { TokenService } from '../tokens/token.service';
import { AddFCMTokenDto } from './dto/add-fcm-token.dto';
import { UpdateLanguagesDto } from './dto/update-languages.dto';
import { AddressTypeDto, UpdateAddressDto } from './dto/update-address.dto';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('/api/v1/users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
  ) {}

  @Get('/me')
  async getProfile(@Req() request: Request) {
    const userId = request.user.sub;
    const user = await this.userService.findById(new Types.ObjectId(userId));
    if (!user) {
      throw new NotFoundException('Profile introuvable.');
    }

    return new SuccessResponse(SuccessResponseEnum.OK, undefined, user);
  }

  @Put('/me')
  async updateProfile(
    @Req() request: Request,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    const userId = request.user.sub;
    const user_ = await this.userService.findById(userId);
    if (!user_) {
      throw new UnauthorizedException(
        authStrings.E_PASSWORD_INCORRECT,
        AuthResponseCode.E_INVALID_CREDENTIALS,
      );
    }
    const user = await this.userService.update(new Types.ObjectId(userId), {
      // email: updateProfileDto.email,
      name: updateProfileDto.name,
      phone: updateProfileDto.phone,
    });

    return new SuccessResponse(
      SuccessResponseEnum.OK,
      'Profil mis jour avec succès.',
      user,
    );
  }

  @Get('/me/can-delete')
  async canDeleteAccount(@Req() request: Request) {
    const res = await this.userService.canDeleteUserAccount(
      new Types.ObjectId(request.user.sub),
    );

    if (res.status !== 'OK') {
      throw new UnauthorizedException(res.code);
    }

    return new SuccessResponse(SuccessResponseEnum.OK, undefined);
  }

  @ApiImageFile('avatar', true)
  @Put('/me/avatar')
  updateProfilePicture(
    @Req() request: Request,
    @UploadedFile(ParseImageFile(1024 * 1000 * 10, true))
    avatar: Express.Multer.File,
  ) {
    const user = request.user!;
    return this.userService.updateProfilePicture(user.sub, avatar);
  }

  @Put('/me/password')
  async updatePassword(
    @Req() request: Request,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    return this.userService.updatePassword(request.user.sub, updatePasswordDto);
  }

  @Put('/me/addresses')
  async updateAddress(
    @Req() request: Request,
    @Body() { address }: UpdateAddressDto,
    @Query() { type }: AddressTypeDto,
  ) {
    return this.userService.updateAddress(request.user.sub, { type, address });
  }

  @Get('/me/addresses')
  async getAddress(@Req() request: Request, @Query() { type }: AddressTypeDto) {
    return this.userService.getAddress(request.user.sub, { type });
  }

  @Put('/me/languages')
  async updateLanguages(
    @Req() request: Request,
    @Body() updateLanguagesDto: UpdateLanguagesDto,
  ) {
    const result = await this.userService.updateLanguages(
      request.user.sub,
      updateLanguagesDto,
    );
    return new SuccessResponse(
      SuccessResponseEnum.OK,
      'Vos languages ont été mis à jour avec succès.',
      result,
    );
  }

  @Put('/me/role')
  switchRole(@Req() request: Request, @Body() swicthRoleDto: SwitchRoleDto) {
    const userId = request.user.sub;

    return this.userService.switchRole(userId, swicthRoleDto.role);
  }

  @Put('/me/fcm-tokens')
  async addFCMToken(
    @Req() request: Request,
    @Body() addFCMTokenDto: AddFCMTokenDto,
  ) {
    const userId = request.user.sub;

    const token = await this.userService.addFCMToken(
      userId,
      addFCMTokenDto.token,
    );
    return new SuccessResponse(SuccessResponseEnum.OK, undefined, token);
  }

  @Delete('/me')
  deleteMe(@Req() request: Request) {
    const userId = request.user.sub;
    return this.userService.deleteUserAccount(userId);
  }
}
