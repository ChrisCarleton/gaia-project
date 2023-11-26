import { UserDTO } from '@gaia-project/api';
import { Controller, Get, NotFoundException, Param } from '@nestjs/common';

import { UsersService } from './users.service';

@Controller('api/users')
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @Get()
  async searchUsers(): Promise<UserDTO[]> {
    return [];
  }

  @Get(':id')
  async getUserById(@Param('id') userId: string): Promise<UserDTO> {
    const user = await this.users.getUser(userId);

    if (!user) {
      throw new NotFoundException(`Unable to find user with ID "${userId}".`);
    }

    return user.toDTO();
  }
}
