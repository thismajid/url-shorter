import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './user.model';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { LinkSchema } from 'src/links/links.model';
import { ResetSchema } from 'src/auth/reset.model';
import { AuthService } from 'src/auth/auth.service';
import { LinksService } from 'src/links/links.service';

@Module({
  controllers: [UserController],
  providers: [AuthService, UserService, LinksService],
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    MongooseModule.forFeature([{ name: 'Link', schema: LinkSchema }]),
    MongooseModule.forFeature([{ name: 'Reset', schema: ResetSchema }]),
  ],
})
export class UserModule {}
