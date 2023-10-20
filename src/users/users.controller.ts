import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { SendOneClickCredentialsDto } from './dto/send-one-click-creds.dto';
// import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { SignInDto } from './dto/sign-in.dto';
import { SignInByPhoneDto } from './dto/sign-in-by-phone.dto';
import { CreateUserDto } from './dto/create-user.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('one-click')
  oneClickSignUp() {
    return this.usersService.oneClickSignUp();
  }

  @Post('send-one-click')
  sendOneClickCredentials(@Body() body: SendOneClickCredentialsDto) {
    return this.usersService.sendOneClickCredentials(body);
  }

  @Post('email')
  signUpByEmail(@Body() createUserDto: CreateUserDto) {
    return this.usersService.signUpByEmail(createUserDto);
  }

  @Post('phone')
  signUpByPhone(@Body() body: { phone: string }) {
    return this.usersService.signUpByPhone(body.phone);
  }

  @Post('sign-in')
  signIn(@Body() body: SignInDto) {
    return this.usersService.signIn(body);
  }

  @Get('reauth')
  reauthorize(@Body() body: { userId: number }) {
    return this.usersService.reauthorize(body.userId);
  }

  @Post('phone/verification')
  createPhoneVerification(@Body() body: { phone: string }) {
    return this.usersService.createPhoneVerification(body);
  }

  @Post('phone/sign-in')
  signInByPhone(@Body() body: SignInByPhoneDto) {
    return this.usersService.signInByPhone(body);
  }

  @Get(':id')
  getAProfile(@Param('id') id: string) {
    return this.usersService.getAProfile(+id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.usersService.update(+id, updateUserDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
