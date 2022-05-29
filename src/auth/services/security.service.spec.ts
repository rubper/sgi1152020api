import { Test, TestingModule } from '@nestjs/testing';
import { SecurityService } from './security.service';
import { UserService } from '../../core/services/user.service';
import { User } from '../../models/user.model';

describe('SecurityService', () => {
  let service: SecurityService;
  let userService;
  beforeEach(async () => {
    const userServiceMethods = [
      'findByUsername'
    ];
    const userServiceSpy = jasmine.createSpyObj('UserService', userServiceMethods);
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SecurityService,
        {
          provide: UserService,
          useValue: userServiceSpy
        }
      ],
    }).compile();

    service = module.get<SecurityService>(SecurityService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should login', () => {
    service.login('fakeuser', 'fakeuser', 'fakeuser')
      .subscribe(console.log);
  });


});
