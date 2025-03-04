
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { User } from '../user/user.entity';
import { DomainService } from '../domain/domain.service';
import { Domain } from '../domain/domain.entity';
import { PagePermissionService } from '../page_permission/page_permission.service';
import { RoleService } from '../role/role.service';
import { PagePermission } from '../page_permission/page_permission.entity';
import { Util } from 'src/util/util';
import { AppConfigService } from 'src/app_config.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly domainService: DomainService,
    private readonly roleService: RoleService,
    private readonly pagePermissionService: PagePermissionService,
  ) {
    console.log('AuthService constructor jwtService=',jwtService)
  }

  async validateUser(user_account: string, user_password: string): Promise<Omit<User,'user_password'> | null> {
    var system_user = AppConfigService.getSystemUser()
    const users = await this.userService.findAll(system_user, {
      where: {
        user_account:user_account,
      }
    }, true);

    if (users.length>0) {
      var user = users[0];
      if (user && user.user_password === user_password) {
        const { user_password, ...result } = user;
        return result;
      }
    }

    return null;
  }

  async login(user_account:string, user_password:string): Promise<{
      access_token: string,
      refresh_token: string,
      user_id: number,
      user_name: string,
      domain_id: number,
      domain_name: string,
      role_id: number,
      organization_id:number
    }>|null {

    var user = await this.validateUser(user_account, user_password);
    if (user==null) {
      throw new HttpException('incorrect account or password', HttpStatus.UNAUTHORIZED);
    }

    if (user.expire_time!=null) {
      var expire_time = new Date(user.expire_time)
      if (Date.now()>=expire_time.getTime()) {
        throw new HttpException('user account is expired', HttpStatus.FORBIDDEN);
      }
    }

    var system_user = AppConfigService.getSystemUser()
    
    var domain_name = null;
    var domain:Domain = null;
    if (user.domain_id!=null) {
      domain = await this.domainService.findOne(system_user, user.domain_id)
      if (domain==null) {
        throw new HttpException('Domain of user is not found', HttpStatus.NOT_FOUND);
      }
      domain_name = domain?.domain_name;
    }

    /*
    var dom = domain;
    var organization_id = null;
    for (var n=0; n<10000; n++) {
      if (dom==null) break;
      if (dom.is_organization) {
        organization_id = dom.domain_id
        break;
      }
      if (dom.parent_domain_id==null) break;
      dom = await this.domainService.findOne(dom.parent_domain_id);
    }
    */
    var organization_id = await this.domainService.getOrganizationId(user.domain_id);

    const payload = { username: user.user_name, sub: user.user_id };

    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'), // 設置 refresh token 的密鑰
      expiresIn: '1d',               // 設置 refresh token 的過期時間
    });

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      user_id: user.user_id,
      user_name: user.user_name,
      role_id: user.role_id,
      domain_id: user.domain_id,
      domain_name: domain_name,
      organization_id: organization_id
    };
  }

  // 根據 refresh token 獲取新的 access token
  async refreshToken(refresh_token: string) {
    var decoded = null
    try {
      decoded = this.jwtService.verify(refresh_token, {
        secret: this.configService.get('JWT_REFRESH_SECRET'), // 驗證 refresh token 的密鑰
      });
    } catch (e) {
      throw new HttpException('Invalid refresh token', HttpStatus.FORBIDDEN);
    }

    const payload = { username: decoded.username, sub: decoded.sub };

    var system_user = AppConfigService.getSystemUser()
    const user = await this.userService.findOne(system_user, payload.sub);
    if (user==null) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    if (user.expire_time!=null) {
      var expire_time = new Date(user.expire_time)
      if (Date.now()>=expire_time.getTime()) {
        throw new HttpException('user account is expired', HttpStatus.FORBIDDEN);
      }
    }

    const access_token = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'), // 設置 refresh token 的密鑰
      expiresIn: '1d',               // 設置 refresh token 的過期時間
    });
    
    return {
      access_token,
      refresh_token: refreshToken
    };

  }

}
