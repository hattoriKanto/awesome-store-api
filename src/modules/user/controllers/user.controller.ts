import { Controller, Delete, UseGuards } from '@nestjs/common';
import { AtGuard } from 'src/modules/auth/guards/at.guard';
import { UserService } from '../services/user.service';
import { JwtPayload, SuccessResponse } from 'src/types';
import { GetUser } from 'src/decorators';

@UseGuards(AtGuard)
@Controller('me')
export class UserController {
  constructor(private userService: UserService) {}

  @Delete()
  async deleteUser(@GetUser() user: JwtPayload): Promise<SuccessResponse> {
    return this.userService.deleteUserById(user.sub);
  }
}
