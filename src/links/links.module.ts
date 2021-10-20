import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LinksController } from './links.controller';
import { LinkSchema } from './links.model';
import { UserSchema } from 'src/users/user.model';
import { LinksService } from './links.service';
import { AuthService } from 'src/auth/auth.service';
import { ResetSchema } from 'src/auth/reset.model';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Link', schema: LinkSchema }]),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    MongooseModule.forFeature([{ name: 'Reset', schema: ResetSchema }]),
  ],
  controllers: [LinksController],
  providers: [LinksService, AuthService],
})
export class LinksModule {}
