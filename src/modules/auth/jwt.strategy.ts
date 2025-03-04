import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../user/user.service';
import { RoleService } from '../role/role.service';
import { PagePermissionService } from '../page_permission/page_permission.service';
import { Util } from 'src/util/util';
import { PagePermission } from '../page_permission/page_permission.entity';
import { User } from '../user/user.entity';
import { UserWithPermission } from '../user/user_with_permission.entity';
import { AppConfigService } from 'src/app_config.service';


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    private readonly roleService: RoleService,
    private readonly pagePermissionService: PagePermissionService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    var system_user = AppConfigService.getSystemUser()
    //var user:User & {permissions:string[]}
    var user:UserWithPermission;
    user = {...(await this.userService.findOne(system_user, payload.sub)), permissions:null}
    delete user.user_password
    var user_perms = await this.roleService.getPermissionByRole(user.role_id)
    user.permissions = user_perms
    return user
  }
}