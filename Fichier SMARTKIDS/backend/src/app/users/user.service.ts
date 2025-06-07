import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types } from 'mongoose';
import {
  BASE_POPULATE,
  USER_ROLES_LABELS,
  User,
  UserDocument,
  UserRoleEnum,
  UserStatusEnum,
} from './schemas/users.schema';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  USER_CREATED_EVENT_NAME,
  UserCreatedEvent,
} from './events/user-created.event';
import { TokenService } from '../tokens/token.service';
import userStrings from './user.strings';
import { UpdatePasswordDto } from './dto/update-password.dto';
import authStrings from '../auth/contants/auth.strings';
import {
  SuccessResponse,
  SuccessResponseEnum,
} from 'src/core/httpResponse/SuccessReponse';
import { MediaService } from '../medias/media.service';
import { MediaTypeEnum } from '../medias/schemas/media.schema';
import { v4 as uuidv4 } from 'uuid';
import {
  USER_DELETED_EVENT_NAME,
  UserDeletedEvent,
} from './events/user-deleted.event';
import { FCMToken } from './schemas/Fcm-token.schemas';
import { UpdateLanguagesDto } from './dto/update-languages.dto';
import { UserAddress } from './schemas/user-address.schemas';
import { AddressTypeDto, UpdateAddressDto } from './dto/update-address.dto';
import { PaginateUsersDto } from './dto/paginate-users.dto';
import { Etablissement } from '../etablissement/schemas/etablissement.schema';
import { Category } from '../category/schemas/category.schema';
import { Option } from '../option/schemas/option.schema';
import { SubscriptionPlan } from '../subscriptions/schemas/subscription-plan.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(FCMToken.name) private fcmTokenModel: Model<FCMToken>,
    @InjectModel(Etablissement.name) private etablissementModel: Model<Etablissement>,
    @InjectModel(Category.name) private categoryModel: Model<Category>,
    @InjectModel(Option.name) private optionModel: Model<Option>,
    @InjectModel(SubscriptionPlan.name) private subscriptionPlanModel: Model<SubscriptionPlan>,
    @InjectModel(UserAddress.name)
    private userAdddressModel: Model<UserAddress>,
    private readonly eventEmitter: EventEmitter2,
    private readonly tokenService: TokenService,
    private readonly mediaService: MediaService,
  ) { }

  async create(createUserDto: CreateUserDto) {
    const hashedPassword = await this.tokenService.hashString(
      createUserDto.password,
    );
    const user = await this.userModel.create({
      ...createUserDto,
      password: hashedPassword,
      activeRole: createUserDto.role,
      status: UserStatusEnum.INACTIVE,
      isSeller: false
    });

    const otp: { value: string; id: string } | undefined = undefined;
    if (user.role !== UserRoleEnum.ADMIN) {
      const otp = await this.tokenService.generateOtp(user._id.toString());
      this.eventEmitter.emit(
        USER_CREATED_EVENT_NAME,
        new UserCreatedEvent(user, otp),
      );
    }

    return {
      user,
      otp,
    };
  }

  async findById(id: string | Types.ObjectId): Promise<UserDocument | null> {
    return this.userModel.findById(id).populate(BASE_POPULATE).exec();
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).populate(BASE_POPULATE).exec();
  }

  async update(
    id: string | Types.ObjectId,
    updateUserDto: Partial<Omit<User, 'updatedAt' | 'createdAt'>>,
  ): Promise<UserDocument | null> {
    const userId = typeof id === 'string' ? new Types.ObjectId(id) : id;
    return this.userModel
      .findOneAndUpdate({ _id: userId }, updateUserDto, {
        new: true,
      })
      .populate(BASE_POPULATE)
      .exec();
  }

  async delete(id: string | Types.ObjectId) {
    /**
     * TODO:
     * Delete pictures.
     * Cancel Susbcription if any.
     */
    const user = await this.userModel.findOneAndDelete({ _id: id });
    if (user) {
      const etablissement = await this.etablissementModel.findOneAndDelete({ userId: user.id });
      /*this.eventEmitter.emit(
        USER_DELETED_EVENT_NAME,
        new UserDeletedEvent(user),
      );*/
    }

    return user;
  }

  async removeFCMToken(token: string, userId: string | Types.ObjectId) {
    const fcmToken = await this.fcmTokenModel.findOneAndDelete({
      value: token,
      user: typeof userId === 'string' ? new Types.ObjectId(userId) : userId,
    });

    console.log({ fcmToken });
  }

  async activateUser(userId: string) {
    const user = await this.userModel
      .findOneAndUpdate(
        {
          _id: new Types.ObjectId(userId),
        },
        {
          $set: {
            emailVerified: true,
          },
        },
        {
          new: true,
        },
      )
      .populate(BASE_POPULATE)
      .exec();

    if (!user) {
      throw new NotFoundException(userStrings.E_USER_NOT_FOUND);
    }

    return user;
  }

  async updatePassword(
    userId: string,
    { currentPassword, newPassword }: UpdatePasswordDto,
  ) {
    const user = await this.findById(userId);
    if (
      !user ||
      !(await this.tokenService.hashMatches(user.password, currentPassword))
    ) {
      throw new UnauthorizedException(authStrings.E_PASSWORD_INCORRECT);
    }

    await this.update(new Types.ObjectId(userId), {
      password: await this.tokenService.hashString(newPassword),
    });

    return new SuccessResponse(
      SuccessResponseEnum.OK,
      'Mot de passe modifié avec succès.',
    );
  }

  async updateLanguages(userId: string, { languages }: UpdateLanguagesDto) {
    const user = await this.update(new Types.ObjectId(userId), {
      languages,
    });

    if (!user) {
      throw new NotFoundException('Utilisateur introuvable');
    }

    return new SuccessResponse(
      SuccessResponseEnum.OK,
      'Mot de passe modifié avec succès.',
      languages,
    );
  }

  async updateAddress(
    userId: string,
    { address, type }: UpdateAddressDto & AddressTypeDto,
  ) {
    const user = await this.findById(new Types.ObjectId(userId));

    if (!user) {
      throw new NotFoundException('Utilisateur introuvable');
    }

    const addressDoc = await this.userAdddressModel.findOneAndUpdate(
      {
        user: user._id,
        type,
      },
      {
        $set: {
          address,
          type,
        },
      },
      {
        new: true,
        upsert: true,
      },
    );

    return new SuccessResponse(
      SuccessResponseEnum.OK,
      'Adresse mise à jour avec succès.',
      addressDoc,
    );
  }

  async getAddress(userId: string, { type }: AddressTypeDto) {
    const user = await this.findById(new Types.ObjectId(userId));

    if (!user) {
      throw new NotFoundException('Utilisateur introuvable');
    }

    const addressDoc = await this.userAdddressModel.findOne({
      user: user._id,
      type,
    });

    if (!addressDoc) {
      throw new NotFoundException('Adresse introuvable');
    }

    return new SuccessResponse(
      SuccessResponseEnum.OK,
      'Adresse mise à jour avec succès.',
      addressDoc,
    );
  }
  async switchRole(userId: string, newActiveRole: UserRoleEnum) {
    const user = await this.findById(userId);
    if (!user) {
      throw new UnauthorizedException(authStrings.E_INVALID_CREDENTIALS);
    }

    if (
      newActiveRole === UserRoleEnum.ADMIN ||
      (newActiveRole === UserRoleEnum.DRIVER && !user.isSeller)
    ) {
      throw new ForbiddenException();
    }

    user.activeRole = newActiveRole;
    await user.save();

    const { access_token, refresh_token } =
      await this.tokenService.generateFullJwt(user, false);
    return new SuccessResponse(
      SuccessResponseEnum.OK,
      `Vous intérragissez maintenant en tant que ${USER_ROLES_LABELS[newActiveRole]}.`,
      {
        access_token,
        refresh_token,
        user,
      },
    );
  }

  async addFCMToken(userId: string, token: string) {
    const user = await this.findById(userId);
    if (!user) {
      throw new UnauthorizedException(authStrings.E_INVALID_CREDENTIALS);
    }

    const fcmToken = await this.fcmTokenModel.findOneAndUpdate(
      {
        user: user._id,
        value: token,
      },
      {
        $set: {
          value: token,
        },
      },
      {
        upsert: true,
        new: true,
      },
    );

    return fcmToken;
  }

  async updateProfilePicture(userId: string, photo: Express.Multer.File) {
    const user = await this.findById(userId);
    if (!user) {
      throw new UnauthorizedException(authStrings.E_INVALID_CREDENTIALS);
    }

    const currentMediaId =
      user.media && 'src' in user.media ? user.media._id : user.media;

    const media = await this.mediaService.create({
      file: photo,
      ref: user._id,
      type: MediaTypeEnum.USER_PHOTO,
    });

    if (media) {
      if (currentMediaId) {
        try {
          this.mediaService.delete(currentMediaId.toString());
        } catch (error) { }
      }

      user.media = media._id;
      await user.save();
      await user.populate(BASE_POPULATE);
    }

    return new SuccessResponse(
      SuccessResponseEnum.OK,
      'Photo de profil mise à jour avec succès.',
      user,
    );
  }

  async canDeleteUserAccount(userId: Types.ObjectId): Promise<
    | { status: 'OK' }
    | {
      status: 'ERROR';
      code: 'ACTION_FORBIDEN';
    }
  > {
    const user = await this.findById(userId);

    if (!user) {
      throw new NotFoundException('Utilisateur introuvable.');
    }

    if (user.status === UserStatusEnum.ACTIVE) {
      return {
        status: 'ERROR',
        code: 'ACTION_FORBIDEN',
      };
    }

    return {
      status: 'OK',
    };
  }

  async deleteUserAccount(me: string, isAccountOwner = true) {
    const user = await this.findById(me);
    if (!user) {
      throw new UnauthorizedException(authStrings.E_INVALID_CREDENTIALS);
    }

    const res = await this.canDeleteUserAccount(user._id);

    if (res.status !== 'OK') {
      throw new UnauthorizedException(res.code);
    }

    await this.delete(user._id);

    return new SuccessResponse(
      SuccessResponseEnum.OK,
      isAccountOwner
        ? "Votre compte a été définitivement supprimé. Vous pouvez toujours recréer un nouveau compte si vous changez d'avis."
        : "L'utilisateur a été définitivement supprimé.",
    );
  }

  async paginateUsers({ limit, sort, page, filter }: PaginateUsersDto) {
    const filterQuery: FilterQuery<User> = {
      $and: [],
    };

    if (filter.email) {
      filterQuery.$and.push({
        email: {
          $regex: new RegExp(filter.email),
          $options: 'si',
        },
      });
    }

    if (filter.query) {
      filterQuery.$and.push({
        $or: [
          {
            email: {
              $regex: new RegExp(filter.query),
              $options: 'si',
            },
          },
          {
            name: {
              $regex: new RegExp(filter.query),
              $options: 'si',
            },
          },
        ],
      });
    }

    if (filter.name) {
      filterQuery.$and.push({
        name: {
          $regex: new RegExp(filter.name),
          $options: 'si',
        },
      });
    }

    filterQuery.$and.push({
      role: {
        $in:
          filter.role && filter
            ? [filter.role]
            : [UserRoleEnum.CLIENT, UserRoleEnum.DRIVER, UserRoleEnum.ADMIN],
      },
    });

    filterQuery.$and.push({
      activeRole: {
        $in: filter.activeRole
          ? [filter.activeRole]
          : [UserRoleEnum.CLIENT, UserRoleEnum.DRIVER],
      },
      $or: [{ deletedAt: null }, { deletedAt: undefined }],
    });

    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
      this.userModel
        .find(filterQuery)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .populate(BASE_POPULATE),
      this.userModel.countDocuments(filterQuery),
    ]);

    const totalPages = Math.ceil(total / limit);
    return {
      items: users,
      total,
      page,
      totalPages,
    };
  }

  async getUser(userId: string) {
    const user = await this.userModel
      .findById(new Types.ObjectId(userId))
      .populate(BASE_POPULATE);

    if (!user) {
      throw new NotFoundException('Utilisateur introuvable');
    }

    return user;
  }

  async findOne(filter: FilterQuery<User>) {
    return await this.userModel.findOne(filter);
  }

  async getCounts() {
    const users = await this.userModel.countDocuments({ role: { $ne: UserRoleEnum.ADMIN } });
    const etablissements = await this.etablissementModel.countDocuments();
    const categories = await this.categoryModel.countDocuments();
    const options = await this.optionModel.countDocuments();
    const subscriptionPlans = await this.subscriptionPlanModel.countDocuments();

    return {
      users,
      etablissements,
      categories,
      options,
      subscriptionPlans
    };
  }

  async updateUserStatusByStripeCustomerId(stripeCustomerId: string, status: UserStatusEnum) {

    const user = await this.userModel.findOneAndUpdate(
      {
        stripeCustomerId
      },
      {
        $set: {
          status
        },
      },
      {
        new: true,
      },
    );

    return user;
  }
  
}
