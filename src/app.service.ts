import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Role } from './users/role/role.enum';
import { User } from './users/user.model';

@Injectable()
export class AppService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  async onModuleInit() {
    const getSuperAdmin = await this.getSuperAdmin();
    if (!getSuperAdmin) {
      await this.createSuperAdmin();
      console.log(`Super Admin Created Successfully`);
    }
  }

  async getSuperAdmin() {
    try {
      return await this.userModel.findOne({
        role: Role.SuperAdmin,
      });
    } catch (err) {
      throw err;
    }
  }

  async createSuperAdmin() {
    try {
      const newUser = new this.userModel({
        firstName: 'admin',
        lastName: 'admin',
        email: 'manager@admin.com',
        username: 'admin',
        password: '123456789',
        role: Role.SuperAdmin,
      });
      return await newUser.save();
    } catch (err) {
      throw err;
    }
  }
}
