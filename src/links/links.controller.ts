import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Render,
  NotFoundException,
  Res,
  Req,
  Put,
  BadRequestException,
  Delete,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { LinksService } from './links.service';
import { AuthService } from 'src/auth/auth.service';
import { ChangeUrlDto } from './dto/change-url.dto';

@Controller('/')
export class LinksController {
  constructor(
    private readonly linksService: LinksService,
    private readonly authService: AuthService,
  ) {}

  @Get()
  async Home(@Res() res: any, @Req() req: any) {
    try {
      const token = req.cookies.token ? req.cookies.token : '';
      let user;
      if (token) user = await this.authService.decodeToken(token);
      return res.render('index', {
        authNavbar: user ? false : true,
        firstName: user ? user.firstName : '',
      });
    } catch (err) {
      throw err;
    }
  }

  @Get(':url')
  @Render('links')
  async findURL(@Param('url') url: string, @Req() req) {
    try {
      const token = req.cookies.token ? req.cookies.token : '';
      let user;
      if (token) user = await this.authService.decodeToken(token);
      const found: any = await this.linksService.findURL(url);
      if (!found) throw new NotFoundException(`NOT FOUND`);
      return {
        link: found.link,
        authNavbar: user ? false : true,
        firstName: user ? user.firstName : '',
      };
    } catch (err) {
      throw err;
    }
  }

  @Get('/link/:id')
  async getLink(@Param('id') id, @Res() res) {
    try {
      const link = await this.linksService.getSingleLink(id);
      return res.send(link);
    } catch (err) {
      throw err;
    }
  }

  @Post('/generate')
  async createLinks(@Body('link') link: string, @Req() req: any) {
    try {
      const token = req.cookies.token ? req.cookies.token : '';
      let user;
      if (token) user = await this.authService.decodeToken(token);
      const result = await this.linksService.createLink(link, user?.username);
      return result;
    } catch (err) {
      throw err;
    }
  }

  @Put('/changeUrl')
  @UsePipes(new ValidationPipe({ transform: true }))
  async changeUrl(@Body() changeUrlDto: ChangeUrlDto) {
    try {
      const { id, link, previousNameLink, name } = changeUrlDto;
      const linkFound = await this.linksService.getSingleLink(id);
      if (!linkFound) throw new NotFoundException('Link not found');
      if (previousNameLink !== name) {
        const checkDuplicateName = await this.linksService.findUrlByName(name);
        if (checkDuplicateName && checkDuplicateName._id !== linkFound._id) {
          throw new BadRequestException('Cannot pick up this name');
        }
      }
      await this.linksService.updateUrl(id, link, name);
      return 'Your Link Has Been Updated';
    } catch (err) {
      throw err;
    }
  }

  @Delete('/link')
  async deleteLink(@Body('id') id: string) {
    try {
      return await this.linksService.deleteLink(id);
    } catch (err) {
      throw err;
    }
  }
}
