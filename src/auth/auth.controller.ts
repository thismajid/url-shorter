import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Render,
  Request,
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from 'src/users/user.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { LoginUserDto } from 'src/users/dto/login-user.dto';
import { ForgetPasswordDto } from './dto/forget-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Get('/register')
  @Render('auth/register')
  async Register(@Request() req, @Res() res) {
    try {
      const token = req.cookies.token;
      let user;
      if (token) {
        user = await this.authService.decodeToken(req.cookies.token);
        if (user) return res.redirect('/');
      }
      return {
        authNavbar: user ? false : true,
        firstName: user ? user.firstName : '',
      };
    } catch (err) {
      throw err;
    }
  }

  @Get('/login')
  @Render('auth/login')
  async Login(@Request() req, @Res() res) {
    try {
      const token = req.cookies.token;
      let user;
      if (token) {
        user = await this.authService.decodeToken(req.cookies.token);
        if (user) return res.redirect('/');
      }
      return {
        authNavbar: user ? false : true,
        firstName: user ? user.firstName : '',
      };
    } catch (err) {
      throw err;
    }
  }

  @Get('/logout')
  async LogoutUser(@Res() res) {
    res.cookie('token', '');
    return res.redirect('/');
  }

  @Get('/forget')
  @Render('auth/forget')
  async ForgetPasswordPage(@Request() req, @Res() res) {
    try {
      const token = req.cookies.token;
      let user;
      if (token) {
        user = await this.authService.decodeToken(req.cookies.token);
        if (user) return res.redirect('/');
      }
      return {
        authNavbar: user ? false : true,
        firstName: user ? user.firstName : '',
      };
    } catch (err) {
      throw err;
    }
  }

  @Get('/forget/:resetToken')
  @Render('auth/reset')
  async ResetPasswordPage(
    @Param('resetToken') resetToken: string,
    @Request() req,
    @Res() res,
  ) {
    try {
      const token = req.cookies.token;
      let user;
      if (token) {
        user = await this.authService.decodeToken(req.cookies.token);
        if (user) return res.redirect('/');
      }
      const tokenFound = await this.authService.checkResetPassToken(resetToken);
      if (!tokenFound) return res.status(404).send('Token is incorrect');
      if (tokenFound.isUsed) return res.redirect('/auth/login');
      const userFound = await this.userService.getUserByEmail(tokenFound.email);
      if (!userFound) return res.status(404).send('User not found');
      return {
        authNavbar: user ? false : true,
        firstName: user ? user.firstName : '',
        token: resetToken,
        email: userFound.email,
      };
    } catch (err) {
      throw err;
    }
  }

  @Post('/register')
  @UsePipes(new ValidationPipe({ transform: true }))
  async RegisterUser(@Res() res, @Body() createUserDto: CreateUserDto) {
    try {
      const { email, username } = createUserDto;
      const emailFound = await this.authService.getUserByEmail(email);
      if (emailFound) return res.status(400).send('Email Duplication');
      const usernameFound = await this.authService.getUserByUsername(username);
      if (usernameFound) return res.status(400).send('Username Duplication');
      const result = await this.authService.createUser(createUserDto);
      if (!result) return res.send('Something went wrong ...');
      return res.send('User created successfully');
    } catch (err) {
      throw err;
    }
  }

  @Post('/login')
  async LoginUser(@Res() res, @Body() loginUserDto: LoginUserDto) {
    try {
      const { remember } = loginUserDto;
      const user = await this.authService.loginUser(loginUserDto);
      if (!user) throw new NotFoundException(`Invalid username/password`);
      const token = await this.authService.createToken(
        {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          username: user.username,
          role: user.role,
        },
        remember,
      );
      res.cookie('token', token);
      return res.redirect('/');
    } catch (err) {
      throw err;
    }
  }

  @Post('/forget')
  @UsePipes(new ValidationPipe({ transform: true }))
  async ForgetPassword(
    @Body() forgetPasswordDto: ForgetPasswordDto,
    @Res() res,
  ) {
    try {
      const { email } = forgetPasswordDto;
      const userFound = await this.userService.getUserByEmail(email);
      if (!userFound) return res.status(404).send('Invalid Email');
      await this.authService.sendEmailResetPassword(userFound.firstName, email);
      return res.send('Email Sent');
    } catch (err) {
      throw err;
    }
  }

  @Put('/reset')
  @UsePipes(new ValidationPipe({ transform: true }))
  async ResetPassword(@Body() resetPasswordDto: ResetPasswordDto, @Res() res) {
    try {
      const { email, password, token } = resetPasswordDto;
      const tokenFound = await this.authService.checkResetPassToken(token);
      if (!tokenFound) return res.status(404).send('Token is incorrect');
      const userFound = await this.userService.getUserByEmail(email);
      if (!userFound) return res.status(404).send('User not found');
      await this.userService.updatePassword(userFound._id, password);
      await this.authService.updateTokenStatus(tokenFound._id);
      return res.send(`User's password updated successfully`);
    } catch (err) {
      throw err;
    }
  }
}
