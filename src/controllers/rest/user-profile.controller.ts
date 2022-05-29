import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserProfileService } from 'core/services/user-profile.service';
import { IUserProfile } from 'interfaces/user-profile.interface';
import { CreateDTO } from 'shared/helpers/base/create-dto.type';
import { UpdateDTO } from 'shared/helpers/base/update-dto.type';

@Controller('user-profile')
export class UserProfileController {
  constructor(private readonly userProfileService: UserProfileService) {}

  @Post()
  create(@Body() createUserProfileDto: CreateDTO<IUserProfile>) {
    return this.userProfileService.create(createUserProfileDto);
  }

  @Get()
  findAll() {
    return this.userProfileService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userProfileService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserProfileDto: UpdateDTO<IUserProfile>) {
    return this.userProfileService.update(id, updateUserProfileDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userProfileService.remove(id);
  }
}