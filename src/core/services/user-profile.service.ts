import { Injectable } from '@nestjs/common';

import { UserProfile } from 'models/user-profile.model';
import { CreateUserProfileDTO } from 'interfaces/DTOs/user-profile.create.dto';
import { UpdateUserProfileDTO } from 'interfaces/DTOs/user-profile.update.dto';

@Injectable()
export class UserProfileService {
  create(createDto: CreateUserProfileDTO) {
    return new UserProfile(createDto).save();
  }

  findAll() {
    return UserProfile.find();
  }

  findOne(id: string) {
    return UserProfile.findOne(id);
  }

  update(id: string, updateDto: UpdateUserProfileDTO) {
    return UserProfile.findOne(id).then(
      (userProfile: UserProfile) => {
        userProfile.mapValueFromBase(updateDto);
        userProfile.save();
      }
    );
  }

  remove(id: string) {
    return UserProfile.findOne(id).then(
      (userProfile: UserProfile) => {
        userProfile.softRemove();
      }
    );
  }
}