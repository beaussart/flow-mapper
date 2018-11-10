import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { User } from './user.entity';
import { UserService } from './user.service';
import { Role } from './role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserRepository, Role])],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}