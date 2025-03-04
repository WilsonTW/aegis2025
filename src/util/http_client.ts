
export class HttpClientError extends Error {
  readonly http_status: number
  constructor(http_status, message) {
    super(message)
    this.http_status = http_status
  }
}

export class HttpClient {

  timeout:number = 15000
  url:string = ''
  headers:object = {}

  constructor(url='') {
    this.url = url
  }

  buildQueryString(querys?:object) {
    if (querys==null) return '';
    var formBody = [];
    for (var property in querys) {
      var encodedKey = encodeURIComponent(property);
      var encodedValue = encodeURIComponent(querys[property]);
      formBody.push(encodedKey + "=" + encodedValue);
    }
    return formBody.join("&");
  }

  async ajax(path, options:any={}, headers=null):Promise<Response> {
    return new Promise(async (resolve, reject) => {
      try {

        const controller = new AbortController();
        setTimeout(() => {
          controller.abort();
        }, this.timeout);
        
        var headers_new = Object.assign({}, this.headers)
        if (options.headers!=null) {
          Object.assign(headers_new, options.headers)
        }
        if (headers!=null) {
          Object.assign(headers_new, headers)
        }

        const config = { ...options, signal: controller.signal };
        config.headers = (Object.keys(headers_new).length>0)?headers_new:undefined;
        
        var url = this.url + path
        const response:Response = await fetch(url, config);
        if (response.status>=400) {
          var text = await response.text();
          var msg = 'Cannot load page "'+url+'". response('+response.status+') : "'+text+'"'
          console.log(msg);
          reject(new HttpClientError(response.status, msg))
          return;
        } else {
          resolve(response)
          return;
        }
      } catch (error) {
        console.log('Cannot load page "'+url+'"');
        console.error(error);
        reject(error)
        return;
      }
    })
  }

  static async decodeResponse(response, decode='json') {
    if (decode=='json') {
      return await response.json()
    } else if (decode=='text') {
      return await response.text()
    } else if (decode==null) {
      return response
    }
    return null
  }

  async postJson(path, data, decode='json', headers=null) {
    var headers_new = {
      'Content-Type': 'application/json'
    }
    if (headers!=null) Object.assign(headers_new, headers)
    var response = await this.ajax(path, {method:'POST', body:data}, headers_new)
    return await HttpClient.decodeResponse(response, decode)
  }

  async getJson(path, query=null, decode='json', headers=null) {
    var query_string =this.buildQueryString(query)
    if (query_string!='') path += '?' + query_string;
    var headers_new = {
      'Content-Type': 'application/json'
    }
    if (headers!=null) Object.assign(headers_new, headers)
    var response = await this.ajax(path, {method:'GET'}, headers_new)
    return await HttpClient.decodeResponse(response, decode)
  }
  async patchJson(path, data, decode='json', headers=null) {
    var headers_new = {
      'Content-Type': 'application/json'
    }
    if (headers!=null) Object.assign(headers_new, headers)
    var response = await this.ajax(path, {method:'PATCH', body:data}, headers_new)
    return await HttpClient.decodeResponse(response, decode)
  }
  async deleteData(path, decode='json', headers=null) {
    var response = await this.ajax(path, {method:'DELETE'}, headers)
    return await HttpClient.decodeResponse(response, decode)
  }

  async postForm(path, query, decode='json', headers=null) {
    var query_string =this.buildQueryString(query)
    var headers_new = {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    }
    if (headers!=null) Object.assign(headers_new, headers)
    var response = await this.ajax(path, {method:'POST', body:query_string}, headers_new)
    return await HttpClient.decodeResponse(response, decode)
  }

}
