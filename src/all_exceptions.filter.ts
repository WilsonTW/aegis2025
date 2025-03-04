import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  ExecutionContext,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ApolloError } from 'apollo-server-express';

function mapStatusCodeToCode(statusCode: number): string {
  switch (statusCode) {
    case HttpStatus.CONTINUE:
      return 'CONTINUE';
    case HttpStatus.SWITCHING_PROTOCOLS:
      return 'SWITCHING_PROTOCOLS';
    case HttpStatus.PROCESSING:
      return 'PROCESSING';
    case HttpStatus.EARLYHINTS:
      return 'EARLYHINTS';
    case HttpStatus.OK:
      return 'OK';
    case HttpStatus.CREATED:
      return 'CREATED';
    case HttpStatus.ACCEPTED:
      return 'ACCEPTED';
    case HttpStatus.NON_AUTHORITATIVE_INFORMATION:
      return 'NON_AUTHORITATIVE_INFORMATION';
    case HttpStatus.NO_CONTENT:
      return 'NO_CONTENT';
    case HttpStatus.RESET_CONTENT:
      return 'RESET_CONTENT';
    case HttpStatus.PARTIAL_CONTENT:
      return 'PARTIAL_CONTENT';
    case HttpStatus.AMBIGUOUS:
      return 'AMBIGUOUS';
    case HttpStatus.MOVED_PERMANENTLY:
      return 'MOVED_PERMANENTLY';
    case HttpStatus.FOUND:
      return 'FOUND';
    case HttpStatus.SEE_OTHER:
      return 'SEE_OTHER';
    case HttpStatus.NOT_MODIFIED:
      return 'NOT_MODIFIED';
    case HttpStatus.TEMPORARY_REDIRECT:
      return 'TEMPORARY_REDIRECT';
    case HttpStatus.PERMANENT_REDIRECT:
      return 'PERMANENT_REDIRECT';
    case HttpStatus.BAD_REQUEST:
      return 'BAD_REQUEST';
    case HttpStatus.UNAUTHORIZED:
      return 'UNAUTHORIZED';
    case HttpStatus.PAYMENT_REQUIRED:
      return 'PAYMENT_REQUIRED';
    case HttpStatus.FORBIDDEN:
      return 'FORBIDDEN';
    case HttpStatus.NOT_FOUND:
      return 'NOT_FOUND';
    case HttpStatus.METHOD_NOT_ALLOWED:
      return 'METHOD_NOT_ALLOWED';
    case HttpStatus.NOT_ACCEPTABLE:
      return 'NOT_ACCEPTABLE';
    case HttpStatus.PROXY_AUTHENTICATION_REQUIRED:
      return 'PROXY_AUTHENTICATION_REQUIRED';
    case HttpStatus.REQUEST_TIMEOUT:
      return 'REQUEST_TIMEOUT';
    case HttpStatus.CONFLICT:
      return 'CONFLICT';
    case HttpStatus.GONE:
      return 'GONE';
    case HttpStatus.LENGTH_REQUIRED:
      return 'LENGTH_REQUIRED';
    case HttpStatus.PRECONDITION_FAILED:
      return 'PRECONDITION_FAILED';
    case HttpStatus.PAYLOAD_TOO_LARGE:
      return 'PAYLOAD_TOO_LARGE';
    case HttpStatus.URI_TOO_LONG:
      return 'URI_TOO_LONG';
    case HttpStatus.UNSUPPORTED_MEDIA_TYPE:
      return 'UNSUPPORTED_MEDIA_TYPE';
    case HttpStatus.REQUESTED_RANGE_NOT_SATISFIABLE:
      return 'REQUESTED_RANGE_NOT_SATISFIABLE';
    case HttpStatus.EXPECTATION_FAILED:
      return 'EXPECTATION_FAILED';
    case HttpStatus.I_AM_A_TEAPOT:
      return 'I_AM_A_TEAPOT';
    case HttpStatus.MISDIRECTED:
      return 'MISDIRECTED';
    case HttpStatus.UNPROCESSABLE_ENTITY:
      return 'UNPROCESSABLE_ENTITY';
    case HttpStatus.FAILED_DEPENDENCY:
      return 'FAILED_DEPENDENCY';
    case HttpStatus.PRECONDITION_REQUIRED:
      return 'PRECONDITION_REQUIRED';
    case HttpStatus.TOO_MANY_REQUESTS:
      return 'TOO_MANY_REQUESTS';
    case HttpStatus.INTERNAL_SERVER_ERROR:
      return 'INTERNAL_SERVER_ERROR';
    case HttpStatus.NOT_IMPLEMENTED:
      return 'NOT_IMPLEMENTED';
    case HttpStatus.BAD_GATEWAY:
      return 'BAD_GATEWAY';
    case HttpStatus.SERVICE_UNAVAILABLE:
      return 'SERVICE_UNAVAILABLE';
    case HttpStatus.GATEWAY_TIMEOUT:
      return 'GATEWAY_TIMEOUT';
    case HttpStatus.HTTP_VERSION_NOT_SUPPORTED:
      return 'HTTP_VERSION_NOT_SUPPORTED';
    default:
      return 'UNKNOWN_ERROR';
  }
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: any): void {
    // In certain situations `httpAdapter` might not be available in the
    // constructor method, thus we should resolve it here.
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();

    /*
    var host_type:any = host.getType()
    if (host_type=='graphql') {
      var gqlContext = GqlExecutionContext.create(host);
      var errorMessage = exception instanceof HttpException
        ? exception.getResponse()
        : exception;
    } else if (host_type=='http') {
    }
    */

    var path = ''
    var method = ''

    var request
    var response

    var host_type:any = host.getType()
    if (host_type=='graphql') {
      var gqlContext = GqlExecutionContext.create(host);
      request = gqlContext.getContext().req;
      response = gqlContext.getContext().response;
      path = request.originalUrl
      method = request.method;
    } else if (host_type=='http') {
      request = ctx.getRequest()
      response = ctx.getResponse()
      path = httpAdapter.getRequestUrl(request);
      method = httpAdapter.getRequestMethod(request);
    }

    var httpStatus:number = 500;
    if (exception instanceof HttpException) {
      httpStatus = exception.getStatus();
    } else if (exception instanceof ApolloError) {
      httpStatus = exception.extensions?.statusCode || 500;
      console.log('GraphQL Error:', exception.message);
    } else if (exception instanceof Object && typeof(exception['statusCode'])=='number') {
      httpStatus = exception['statusCode']
    }

    var time = (new Date()).toISOString();

    var ex:any = exception;
    if (exception instanceof Object) {
      if ('code' in exception && 'errno' in exception && 'sqlState' in exception && 'sqlMessage' in exception) {
        ex = {
          code: exception.code,
          errno: exception.errno,
          sqlState: exception.sqlState,
          sqlMessage: exception.sqlMessage
        };
      } else if ('message' in exception) {
        ex = {
          message: exception.message
        };
        if ('name' in exception) ex.name = exception.name;
        if ('cause' in exception) ex.cause = exception.cause;
        if ('fileName' in exception) ex.fileName = exception.fileName;
        if ('lineNumber' in exception) ex.lineNumber = exception.lineNumber;

        if ('code' in exception) ex.code = exception.code;
        if ('errno' in exception) ex.errno = exception.errno;
        if ('status' in exception) ex.status = exception.status;
        if ('syscall' in exception) ex.syscall = exception.syscall;
      }
    }

    const responseBody = {
      statusCode: httpStatus,
      timestamp: time,
      path: path,
      error: ex
    };

    if (exception["status"]<400) {
      console.log(`${time} (${httpStatus}) ${method} ${path}`);
    } else if (exception["status"]==500) {
      console.log(`${time} (${httpStatus}) ${method} ${path}`);
      console.log(exception);
    } else if (ex.message!=null) {
      console.log(`${time} (${httpStatus}) ${method} ${path} - ${ex.message}`);
    } else {
      console.log(`${time} (${httpStatus}) ${method} ${path}`);
      console.log(responseBody);
    }

    if (host_type=='graphql') {
      //response.status(httpStatus).json(responseBody);
      if (exception instanceof HttpException) {
        throw new ApolloError(ex.message ?? ex.sqlMessage, mapStatusCodeToCode(httpStatus), {
          statusCode: httpStatus,
        });
      }
    } else {
      httpAdapter.reply(response, responseBody, httpStatus);
    }
  }
}