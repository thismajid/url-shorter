import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LinksModule } from './links/links.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './users/user.module';
import { LinksService } from './links/links.service';
import { LinkSchema } from './links/links.model';
import { UserSchema } from './users/user.model';

@Module({
  imports: [
    MongooseModule.forRoot(`mongodb://localhost:27017/urlshorter`),
    MongooseModule.forFeature([{ name: 'Link', schema: LinkSchema }]),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    ConfigModule.forRoot(),
    LinksModule,
    AuthModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService, LinksService],
})
export class AppModule {}
