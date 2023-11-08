import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseInterceptors,
  UploadedFile,
  Headers,
} from '@nestjs/common';
import { SendOneClickCredentialsDto } from './dto/send-one-click-creds.dto';
import { UsersService } from './users.service';
// import { UpdateUserDto } from './dto/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { SignInByPhoneDto } from './dto/sign-in-by-phone.dto';
import { SignInDto } from './dto/sign-in.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('one-click')
  oneClickSignUp(@Body() body: { invite?: string }) {
    return this.usersService.oneClickSignUp(body.invite);
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
  signUpByPhone(@Body() body: { phone: string; invite?: string }) {
    return this.usersService.signUpByPhone(body);
  }

  @Post('sign-in')
  signIn(@Body() body: SignInDto) {
    return this.usersService.signIn(body);
  }

  @Get('reauth')
  reauthorize(@Body() body: { userId: number }) {
    return this.usersService.reauthorize(body.userId);
  }

  // @Post('phone/verification')
  // createPhoneVerification(@Body() body: { phone: string; invite: string }) {
  //   return this.usersService.createPhoneVerification(body);
  // }

  @Post('phone/sign-in')
  signInByPhone(@Body() body: SignInByPhoneDto) {
    return this.usersService.signInByPhone(body);
  }

  @Get(':id')
  getAProfile(@Param('id') id: string) {
    return this.usersService.getAProfile(+id);
  }

  @Patch()
  @UseInterceptors(FileInterceptor('profilePic'))
  editUser(
    @Headers('Authorization') token: string,
    @Body() body: UpdateUserDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.usersService.editUser(body, token, file);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
