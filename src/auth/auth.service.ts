import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { LoginUserDto } from 'src/users/dto/login-user.dto';
import { User } from 'src/users/user.model';
import { compare } from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { Role } from 'src/users/role/role.enum';
import { Reset } from './reset.model';
import * as shortid from 'shortid';
import * as nodemailer from 'nodemailer';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    @InjectModel('Reset') private readonly resetModel: Model<Reset>,
  ) {}

  async getUserByEmail(email) {
    try {
      return await this.userModel.findOne({ email });
    } catch (err) {
      throw err;
    }
  }

  async getUserByUsername(username) {
    try {
      return await this.userModel.findOne({ username });
    } catch (err) {
      throw err;
    }
  }

  async createUser(createUserDto: CreateUserDto) {
    try {
      return new this.userModel(createUserDto).save();
    } catch (err) {
      throw err;
    }
  }

  async loginUser(loginUserDto: LoginUserDto) {
    try {
      const { username, password } = loginUserDto;
      const user = await this.getUserByUsername(username);
      if (user && (await this.checkPassword(password, user.password))) {
        return user;
      }
      return false;
    } catch (err) {
      throw err;
    }
  }

  async checkPassword(password, userPassword) {
    return await compare(password, userPassword);
  }

  async createToken(payload, remember) {
    const expire = remember ? '7d' : '2h';
    return await jwt.sign(payload, process.env.TOKEN_SECRET, {
      expiresIn: expire,
    });
  }

  async decodeToken(token) {
    return await jwt.verify(token, process.env.TOKEN_SECRET);
  }

  async sendEmailResetPassword(firstName, email) {
    try {
      const token = await shortid.generate();
      await new this.resetModel({
        email,
        token,
      }).save();
      let transporter = nodemailer.createTransport({
        host: process.env.MAILER_SERVER,
        port: process.env.MAILER_PORT,
        secure: true, // true for 465, false for other ports
        auth: {
          user: process.env.MAILER_USER, // generated ethereal user
          pass: process.env.MAILER_PASS, // generated ethereal password
        },
        tls: {
          rejectUnauthorized: false,
        },
      });
      return await transporter.sendMail({
        from: `"URL Shorter 👻" <manager@URLShorter.ir>`, // sender address
        to: `${email}`, // list of receivers
        subject: 'Reset Password ✔', // Subject line
        html: `<b>Dear ${firstName}, Reset Password URL: <a href="http://${process.env.HOST}:${process.env.PORT}/auth/forget/${token}">Reset Password</a></b>`, // html body
      });
    } catch (err) {
      throw err;
    }
  }

  async checkResetPassToken(token) {
    try {
      return await this.resetModel.findOne({
        token,
      });
    } catch (err) {
      throw err;
    }
  }

  async updateTokenStatus(id) {
    try {
      return await this.resetModel.findByIdAndUpdate(id, {
        isUsed: true,
      });
    } catch (err) {
      throw err;
    }
  }
}
