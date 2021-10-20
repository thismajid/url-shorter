import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Put,
  Render,
  Request,
  Res,
} from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { LinksService } from 'src/links/links.service';
import { ChangeRoleDto } from 'src/users/dto/change-role.dto';
import { DeleteUserDto } from 'src/users/dto/delete-user.dto';
import { UserService } from 'src/users/user.service';
import { ChangeProfileDto } from 'src/users/dto/change-profile.dto';
import { ResetPasswordDto } from 'src/users/dto/reset-password.dto';
import { Role } from 'src/users/role/role.enum';

@Controller('/dashboard')
export class UserController {
  constructor(
    private readonly authService: AuthService,
    private readonly linksService: LinksService,
    private readonly userService: UserService,
  ) {}
  @Get('/main')
  @Render('dashboard/main')
  async DashboardPage(@Request() req, @Res() res) {
    try {
      const token = req.cookies.token ? req.cookies.token : '';
      let user;
      if (!token) return res.redirect('/');
      user = await this.authService.decodeToken(token);
      const limit = 10;
      const page = req.query.page || 1;
      const skip = limit * page - limit;
      const order = req.query.order === 'desc' ? '-1' : '1';
      const search = new RegExp(req.query.search, 'i');
      const query = await this.userService.queryMainPage(search, user.username);
      const links = await this.linksService.getAllUserLinks(
        query,
        limit,
        skip,
        order,
      );
      const countLinks = await this.linksService.countAllUserLinks(query);
      const totalPages = Math.ceil(countLinks / limit);
      return {
        authNavbar: user ? false : true,
        firstName: user ? user.firstName : '',
        user,
        links,
        current: page,
        totalPages,
        query: req.query,
        order: req.query.order === 'desc' ? 'desc' : 'asc',
      };
    } catch (err) {
      throw err;
    }
  }

  @Get('/profile')
  @Render('dashboard/profile')
  async ProfilePage(@Request() req, @Res() res) {
    try {
      const token = req.cookies.token ? req.cookies.token : '';
      if (!token) return res.redirect('/');
      const user = await this.authService.decodeToken(token);
      return {
        authNavbar: user ? false : true,
        firstName: user ? user.firstName : '',
        user,
      };
    } catch (err) {
      throw err;
    }
  }

  @Put('/profile')
  async changeProfile(@Body() changeProfileDto: ChangeProfileDto, @Res() res) {
    try {
      await this.userService.changeProfile(
        changeProfileDto.id,
        changeProfileDto.firstName,
        changeProfileDto.lastName,
      );
      return res.send('User Has Been Updated');
    } catch (err) {
      throw err;
    }
  }

  @Get('/profile/reset')
  @Render('dashboard/reset-password')
  async resetPasswordPage(@Request() req, @Res() res) {
    try {
      const token = req.cookies.token ? req.cookies.token : '';
      if (!token) return res.redirect('/');
      const user = await this.authService.decodeToken(token);
      return {
        authNavbar: user ? false : true,
        firstName: user ? user.firstName : '',
        user,
      };
    } catch (err) {
      throw err;
    }
  }

  @Put('/profile/reset')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto, @Res() res) {
    try {
      const { id, oldPassword, newPassword } = resetPasswordDto;
      await this.userService.resetPassword(id, oldPassword, newPassword);
      return res.send('User Password Has Been Updated');
    } catch (err) {
      throw err;
    }
  }

  @Get('/users')
  async getAllUsersPage(@Request() req, @Res() res) {
    try {
      const token = req.cookies.token ? req.cookies.token : '';
      if (!token) return res.redirect('/');
      const user = await this.authService.decodeToken(token);
      if (user) {
        const fetchUserFromDB = await this.userService.getUser(user.id);
        if (fetchUserFromDB.role !== user.role) {
          return res.redirect('/auth/logout');
        }
      }
      if (user.role === Role.User) return res.redirect('/dashboard/main');
      const search = new RegExp(req.query.search, 'i');
      const limit = 10;
      const page = req.query.page || 1;
      const skip = limit * page - limit;
      const order = req.query.order === 'desc' ? '-1' : '1';
      const query = await this.userService.queryUsersPage(search, user.role);
      const users = await this.userService.getAllUsers(
        query,
        limit,
        skip,
        order,
      );
      const countUsers = await this.userService.countAllUsers(query);
      const totalPages = Math.ceil(countUsers / limit);
      return res.render('dashboard/users', {
        authNavbar: user ? false : true,
        firstName: user ? user.firstName : '',
        user,
        users,
        current: page,
        totalPages,
        query: req.query,
        order: req.query.order === 'desc' ? 'desc' : 'asc',
      });
    } catch (err) {
      throw err;
    }
  }

  @Put('/user/role')
  async changeRole(@Body() changeRoleDto: ChangeRoleDto) {
    try {
      const user = await this.userService.getUser(changeRoleDto.id);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      const role = user.role === 'admin' ? 'user' : 'admin';
      await this.userService.changeRole(changeRoleDto.id, role);
      return 'Role changed successfully';
    } catch (err) {
      throw err;
    }
  }

  @Delete('/user')
  async deleteUser(@Body() deleteUserDto: DeleteUserDto) {
    try {
      const user = await this.userService.getUser(deleteUserDto.id);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      await this.linksService.deleteLinksByUsername(user.username);
      await this.userService.deleteUser(deleteUserDto.id);
      return 'User deleted successfully';
    } catch (err) {
      throw err;
    }
  }
}
