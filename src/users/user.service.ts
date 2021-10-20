import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.model';
import { compare, hash } from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { Role } from './role/role.enum';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  /**
   * Create new link
   *
   *
   * @param user
   */
  async createUser(createUserDto: CreateUserDto) {
    const newUser = new this.userModel(createUserDto);
    await newUser.save();
    return newUser;
  }

  async changeProfile(id, firstName, lastName) {
    try {
      return await this.userModel.findByIdAndUpdate(
        id,
        {
          firstName,
          lastName,
        },
        { new: true },
      );
    } catch (err) {
      throw err;
    }
  }

  async resetPassword(id, oldPassword, newPassword) {
    try {
      const user = await this.getUser(id);
      if (!user) return 'User not found';
      const match = await this.comparePassword(oldPassword, user.password);
      if (!match) return 'Password is not match';
      const hashPassword = await this.hashPassword(newPassword);
      return await this.userModel.findOneAndUpdate(
        {
          _id: id,
        },
        {
          password: hashPassword,
        },
      );
    } catch (err) {
      throw err;
    }
  }

  async getUser(id) {
    try {
      return await this.userModel.findById(id);
    } catch (err) {
      throw err;
    }
  }

  async comparePassword(oldPassword, userPassword) {
    try {
      return compare(oldPassword, userPassword);
    } catch (err) {
      throw err;
    }
  }

  async hashPassword(password) {
    try {
      return await hash(password, 10);
    } catch (err) {
      throw err;
    }
  }

  async getAllUsers(query, limit, skip, order) {
    try {
      return await this.userModel
        .find(query)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: order });
    } catch (err) {
      throw err;
    }
  }

  async countAllUsers(query) {
    try {
      return await this.userModel.find(query).count();
    } catch (err) {
      throw err;
    }
  }

  async changeRole(id, role) {
    try {
      return await this.userModel.findByIdAndUpdate(
        id,
        {
          role,
        },
        { new: true },
      );
    } catch (err) {
      throw err;
    }
  }

  async deleteUser(id) {
    try {
      return await this.userModel.findByIdAndDelete(id);
    } catch (err) {
      throw err;
    }
  }

  async getUserByEmail(email: string) {
    try {
      return await this.userModel.findOne({
        email,
      });
    } catch (err) {
      throw err;
    }
  }

  async updatePassword(id, password) {
    try {
      const newPassword = await this.hashPassword(password);
      return await this.userModel.findByIdAndUpdate(id, {
        password: newPassword,
      });
    } catch (err) {
      throw err;
    }
  }

  async queryMainPage(search, username) {
    try {
      return {
        $and: [
          {
            $or: [{ link: { $regex: search } }, { name: { $regex: search } }],
          },
          {
            user: { $eq: username },
          },
        ],
      };
    } catch (err) {
      throw err;
    }
  }

  async queryUsersPage(search, role) {
    try {
      if (role === 'admin') {
        return {
          $and: [
            {
              $or: [
                { firstName: { $regex: search } },
                { lastName: { $regex: search } },
                { email: { $regex: search } },
                { username: { $regex: search } },
              ],
            },
            {
              role: { $eq: 'user' },
            },
          ],
        };
      } else if (role === 'superadmin') {
        return {
          $and: [
            {
              $or: [
                { firstName: { $regex: search } },
                { lastName: { $regex: search } },
                { email: { $regex: search } },
                { username: { $regex: search } },
                { role: { $regex: search } },
              ],
            },
            {
              role: { $ne: 'superadmin' },
            },
          ],
        };
      }
    } catch (err) {
      throw err;
    }
  }
}
