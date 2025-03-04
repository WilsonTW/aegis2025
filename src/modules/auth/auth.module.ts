import { Module, forwardRef } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserService } from '../user/user.service';
import { UserModule } from '../user/user.module';
import { DomainService } from '../domain/domain.service';
import { RoleService } from '../role/role.service';
import { PagePermissionService } from '../page_permission/page_permission.service';
import { PagePermission } from '../page_permission/page_permission.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([PagePermission]),
    UserModule,
    //forwardRef(() => UserModule),
    ConfigModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: '3h' }, // Adjust the expiration time as needed
      }),
      inject: [ConfigService],
    }),
    
  ],
  controllers: [AuthController],
  providers: [AuthResolver, AuthService, LocalStrategy, JwtStrategy, UserService, DomainService, RoleService, PagePermissionService]
  //controllers: [],
  //providers: []

})
export class AuthModule {}