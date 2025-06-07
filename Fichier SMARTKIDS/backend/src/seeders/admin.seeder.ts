import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Seeder } from 'nestjs-seeder';
import * as argon2 from 'argon2';
import { User, UserRoleEnum, UserStatusEnum } from 'src/app/users/schemas/users.schema';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from 'src/core/config';

@Injectable()
export class AdminSeeder implements Seeder {
  constructor(
    @InjectModel(User.name) private readonly admin: Model<User>,
    private readonly configService: ConfigService<AppConfig>,
  ) {}

  async seed(): Promise<any> {
    // Drop all users documents.
    await this.admin.deleteMany({
      role: UserRoleEnum.ADMIN,
    });

    const admin = new this.admin({
      name: this.configService.get('ADMIN_NAME'),
      email: this.configService.get('ADMIN_EMAIL'),
      password: await this.hashPassword(
        this.configService.get('ADMIN_PASSWORD'),
      ),
      phone: this.configService.get('ADMIN_PHONE'),
      role: UserRoleEnum.ADMIN,
      activeRole: UserRoleEnum.ADMIN,
      status: UserStatusEnum.ACTIVE,
      emailVerified: true,
    });

    // Insert into the database.
    return this.admin.insertMany([admin]);
  }

  async hashPassword(password: string): Promise<string> {
    const hash = await argon2.hash(password);
    return hash;
  }

  async drop(): Promise<any> {
    return this.admin.deleteMany({});
  }
}
