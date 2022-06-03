import { ApiBody, ApiResponse } from '@nestjs/swagger';
import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';

import { UserProfile } from 'models/user-profile.model';
import { UserProfileService } from 'core/services/user-profile.service';
import { CreateUserProfileDTO } from 'interfaces/DTOs/user-profile.create.dto';
import { UpdateUserProfileDTO } from 'interfaces/DTOs/user-profile.update.dto';

@Controller('user-profile')
export class UserProfileController {
  constructor(private readonly userProfileService: UserProfileService) {}

  @Post()
  @ApiBody({type: CreateUserProfileDTO})
  create(@Body() createUserProfileDto: CreateUserProfileDTO) {
    return this.userProfileService.create(createUserProfileDto);
  }

  @Get()
  @ApiResponse({type: UserProfile, isArray: true})
  findAll() {
    return this.userProfileService.findAll();
  }

  @Get(':id')
  @ApiResponse({type: UserProfile})
  findOne(@Param('id') id: string) {
    return this.userProfileService.findOne(id);
  }

  @Patch(':id')
  @ApiBody({type: UpdateUserProfileDTO})
  @ApiResponse({type: UserProfile})
  update(@Param('id') id: string, @Body() updateUserProfileDto: CreateUserProfileDTO) {
    return this.userProfileService.update(id, updateUserProfileDto);
  }

  @Delete(':id')
  @ApiResponse({type: null})
  remove(@Param('id') id: string) {
    return this.userProfileService.remove(id);
  }
}