import { ExecutionContext, Injectable, CanActivate, HttpException, HttpStatus } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../user/user.entity';

@Injectable()
export class LocalAuthGuard extends AuthGuard('jwt') {
  canActivate(context) {
    // 可以加入一些自定義邏輯來處理守衛行為
    return super.canActivate(context);  // 呼叫父類別的 canActivate
  }

  handleRequest(err, user, info, context: ExecutionContext) {
    // 這裡是處理解碼後的 user 資料
    if (err || !user) {
      throw new HttpException('Unauthorized' + (err==null?'': '. '+err), HttpStatus.FORBIDDEN);
    }

    const request = context.switchToHttp().getRequest();
    var user2:User & {permissions:string[]} = user
    var user_permissions = user2.permissions

    var api_prefix = '/api'
    var path = request.path

    //path = '/api/users/1/xxx'
    //user_permissions.unshift("get:/users/#")

    function checkPath(pattern, path) {
      var reg = pattern.replace(/\+/g, '[0-9a-zA-Z_]*')
      reg = reg.replace(/\#/g, '[0-9a-zA-Z_\/]*')
      reg = '^' + api_prefix + reg + '$'
      return (new RegExp(reg)).test(path)
    }

    var user_api_path = api_prefix+'/users'
    var role_api_path = api_prefix+'/roles'
    var can_access = false
    for (var permission of user_permissions) {
      var perm = permission.split(':')
      var method = perm[0]
      var source = perm[1]
      if (method==null) continue;
      if (method=='all_perm') {
        can_access = true
        break;
      } else if (request.method=='GET' && (path==role_api_path) || (new RegExp(`^${role_api_path}\/[0-9a-zA-Z]+$`)).test(path)) {
        can_access = true
        break;
      } else if (request.method=='GET' && (path==user_api_path) || (new RegExp(`^${user_api_path}\/[0-9a-zA-Z]+$`)).test(path)) {
        can_access = true
        break;
      } else if (request.method=='GET' && source!=null) {
        if ((method=='view' || method=='edit' || method=='manage') && ((new RegExp(`^${api_prefix}/${source}s$`)).test(path) || (new RegExp(`^${api_prefix}/${source}s/`)).test(path))) {
          can_access = true
          break;
        } else if (method=='get') {
          can_access = checkPath(source, path)
          if (can_access) break;
        }
      } else if (request.method=='POST') {
        if ((method=='manage') && (new RegExp(`^${api_prefix}/${source}s$`)).test(path)) {
          can_access = true
          break;
        } else if (method=='post') {
          can_access = checkPath(source, path)
          if (can_access) break;
        }
      } else if (request.method=='PUT') {
        if ((method=='manage') && (new RegExp(`^${api_prefix}/${source}s/`)).test(path)) {
          can_access = true
          break;
        } else if (method=='put') {
          can_access = checkPath(source, path)
          if (can_access) break;
        }
      } else if (request.method=='PATCH') {
        if ((method=='edit' || method=='manage') && (new RegExp(`^${api_prefix}/${source}s/`)).test(path)) {
          can_access = true
          break;
        } else if (method=='patch') {
          can_access = checkPath(source, path)
          if (can_access) break;
        }
      } else if (request.method=='DELETE') {
        if ((method=='manage') && (new RegExp(`^${api_prefix}/${source}s/`)).test(path)) {
          can_access = true
          break;
        } else if (method=='delete') {
          can_access = checkPath(source, path)
          if (can_access) break;
        }
      }
    }



    // 這裡可以對請求做額外處理，例如記錄日誌或進行條件檢查
    if (request) {
      console.log('permission:', can_access ? permission : null);
      console.log('Request Method:', request.method); // 輸出請求方法
      console.log('Request URL:', request.url); // 輸出請求 URL
    }

    if (!can_access) {
      throw new HttpException('The role does not have this permission', HttpStatus.FORBIDDEN);
    }

    return user; // 返回解析後的 user 資料
  }

  validateRequest(request): boolean {
    // 在這裡進行身份驗證的邏輯
    const token = request.headers.authorization;

    //if (token !== 'valid_token') {
    //  return false;
    //}

    return true;
  }

}

