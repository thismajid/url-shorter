import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserService } from 'src/users/user.service';
import { UserSchema } from 'src/users/user.model';
import { ResetSchema } from './reset.model';

@Module({
  controllers: [AuthController],
  providers: [AuthService, UserService],
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    MongooseModule.forFeature([{ name: 'Reset', schema: ResetSchema }]),
  ],
})
export class AuthModule {}
