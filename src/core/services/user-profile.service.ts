import { Injectable } from '@nestjs/common';
import { IUserProfile } from 'interfaces/user-profile.interface';
import { UserProfile } from 'models/user-profile.model';
import { CreateDTO } from 'shared/helpers/base/create-dto.type';
import { UpdateDTO } from 'shared/helpers/base/update-dto.type';

@Injectable()
export class UserProfileService {
  create(createDto: CreateDTO<IUserProfile>) {
    new UserProfile(createDto).save();
  }

  findAll() {
    return UserProfile.find();
  }

  findOne(id: string) {
    return UserProfile.findOne(id);
  }

  update(id: string, updateDto: UpdateDTO<IUserProfile>) {
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