import { ExecutionContext, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class GqlAuthGuard extends AuthGuard('jwt') {

  // 遞迴遍歷字段結構並處理參數
  traverseFields(fieldNodes) {
    fieldNodes.forEach((node) => {
      // 打印當前欄位名稱
      console.log('Field name:', node.name.value);

      // 打印欄位的參數（如果有）
      if (node.arguments.length > 0) {
        node.arguments.forEach((arg) => {
          console.log(`  Argument: ${arg.name.value} = ${arg.value.value}`);
        });
      }

      // 如果有子欄位，遞迴遍歷
      if (node.selectionSet) {
        this.traverseFields(node.selectionSet.selections);
      }
    });
  }

  canActivate(context) {
    // 可以加入一些自定義邏輯來處理守衛行為
    return super.canActivate(context);  // 呼叫父類別的 canActivate
  }

  
  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    var req = ctx.getContext().req;
    return req
  }
  

  handleRequest(err, user, info, context: ExecutionContext) {
    // 這裡是處理解碼後的 user 資料
    if (err || !user) {
      throw new HttpException('Unauthorized' + (err==null?'':'. '+err), HttpStatus.FORBIDDEN);
    }
    
    /*
    const ctx = GqlExecutionContext.create(context);

    // 取得查詢參數
    const args = ctx.getArgs(); // 取得所有的參數
    console.log('All arguments:', args);

    // 如果你只想要查詢中的特定參數，例如 `name`
    const name = ctx.getArgByIndex(0); // 假設 `name` 在第一個位置
    console.log('Argument "name":', name);

    // 也可以獲取解析的資料（例如查詢本身）
    const node_info = ctx.getInfo(); // 可以取得 GraphQL 的資訊
    console.log('GraphQL query info:', node_info);

    this.traverseFields(node_info.fieldNodes);
    */

    return user; // 返回解析後的 user 資料
  }

  // "crons": "[{\"start_time\":61200, \"stop_time\":68400,\"power\":-20000}]"
}