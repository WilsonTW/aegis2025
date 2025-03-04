
const fs = require('node:fs/promises');

const crlf = '\n'

var tables = [
    "user",
    "notify_device:",
    "setting",
    "domain",
    "role",
    "device_type_category",
    "device_type",
    "device_connection",
    "device",
    "repair_item",
    "repair_order_history",
    "repair_record",
    "repair_user_record",
    "mail",
    "event",
    "device_input",
    "device_output",
    "repair_order"
]

var readme = null;
var readme_lines = [];
var schemas = {};

function getReadmeTableData(table_name, find, col_index) {
    
    var table_name_upper = ''
    var prev_is_space = true
    for (var n=0; n<table_name.length; n++) {
        var c = table_name.charAt(n)
        if (prev_is_space) {
            table_name_upper += c.toUpperCase()
        } else {
            table_name_upper += (c=='_')?' ':c;
        }
        prev_is_space = (c=='_')
    }

    var table_name_upper_head = '## ' + table_name_upper + ' ('

    var table_found = false
    for (var line of readme_lines) {
        if (line.substring(0, table_name_upper_head.length)==table_name_upper_head) {
            table_found = true
        }
        if (!table_found) continue;
        line = line.trim()
        if (line.length>2) {
            if (line.charAt(0)=='|' && line.charAt(line.length-1)=='|') {
                if (line.indexOf(find)!=-1) {
                    var cols = line.split("|")
                    var ret = cols[col_index+1]
                    return (ret!=null)?ret.trim():'';
                }
            }
        }
    }
    return ''
}


function contentToMarkdown(content, table_name, header1, header2) {
    var out = header1 + crlf
    var mimes = Object.keys(content)
    if (mimes.length>0) {
        var mime_name = mimes[0]
        var mime = content[mime_name]
        out += mime_name + crlf
        if (mime?.schema!=null) {
            var schema = mime.schema
            out += header2 + crlf
            if ('$ref' in schema) {
                let a = schema.$ref.split('/')
                schema_name = a.pop()
                schema = schemas[schema_name]
            }
            out += schema.type + crlf
            if (schema.type=='object' || schema.type=='array') {
                if (schema.type=='array') {
                    if (schema.items!=null && '$ref' in schema.items) {
                        let a = schema.items.$ref.split('/')
                        schema_name = a.pop()
                        schema = schemas[schema_name]
                    } else {
                        if (schema?.items?.type!=null) {
                            out += schema.items.type + crlf
                        }
                        schema = null
                    }
                }
                if (schema!=null && schema.properties!=null && Object.keys(schema.properties).length>0) {
                    out += '| Name | Type | Description |' + crlf
                    out += '|------|------|-------------|' + crlf
                    for (var property_name in schema.properties) {
                        var property = schema.properties[property_name]
                        var type = ("format" in property)?property.format:property.type;
                        var description = ''
                        if (property.description!=null) {
                            description = property.description
                        } else if (table_name!=null) {
                            description = getReadmeTableData(table_name, property_name, 2)
                        }
                        out += `|${property_name}|${type}|${description}|` + crlf
                    }
                }
            }

        }
    }
    return out;
}

async function example() {
    try {
        var out = ''
        readme = await fs.readFile(__dirname + '/../../README.md', { encoding: 'utf8' });
        readme_lines = readme.split("\n")
        //console.log(readme);


        var data = await fs.readFile(__dirname + '/api-json.json', { encoding: 'utf8' });
        //console.log(data);
        var root = JSON.parse(data)

        schemas = root.components?.schemas
        if (schemas==null) schemas = {}

        var paths = root.paths
        for (var path_name in paths) {
            var table_name = null
            var n1 = path_name.indexOf('/api/')
            if (n1!=-1) {
                var n2 = path_name.indexOf('/', 5)
                if (n2==-1) {
                    table_name = path_name.substring(5,path_name.length-1)
                } else {
                    table_name = path_name.substring(5,n2-1)
                }
                if (tables.indexOf(table_name)==-1) {
                    table_name = null
                }
            }
            //if (path_name.indexOf('{')==-1) console.log(path_name)
            var path = paths[path_name]
            for (var method_name in path) {
                out += '## ' + method_name.toUpperCase() + ' ' + path_name + crlf
                out += '### 說明' + crlf
                var summary = ''
                var method = path[method_name]
                if (method.summary!=null) {
                    summary = method.summary
                } else {
                    var method_desc = ''
                    if (method_name=='post') method_desc='新增'
                    if (method_name=='get') method_desc='取得'
                    if (method_name=='put') method_desc='更新'
                    if (method_name=='patch') method_desc='修改'
                    if (method_name=='delete') method_desc='刪除'
                    if (table_name!=null) {
                        summary = method_desc + ' ' + table_name
                    }
                }
                out += summary + crlf

                out += '### 參數說明' + crlf
                if (method.parameters!=null && method.parameters.length>0) {
                    out += '| Name | In Path | Required | Description |' + crlf
                    out += '|------|---------|----------|-------------|' + crlf
                    for (var parameter of method.parameters) {
                        var in_path = (parameter.in=='path')?'true':'';
                        var description = ''
                        if (parameter.description!=null) {
                            description = parameter.description
                        } else {
                            if (parameter.name=='id') {
                                description = '識別碼'
                            } else if (table_name!=null) {
                                description = getReadmeTableData(table_name, parameter.name, 2)
                            }
                        }
                        out += `|${parameter.name}|${in_path}|${parameter.required}|${description}|` + crlf
                    }
                } else {
                    out += '此 API 沒有參數' + crlf
                }

                if (method?.requestBody?.content!=null) {
                    var content = method.requestBody.content;
                    out += contentToMarkdown(content, table_name, '### 資料段格式', '### 資料段欄位說明')
                }

                if (method?.responses!=null) {
                    var responses = method.responses;
                    out += '### 傳回結果' + crlf
                    for (var status_code in responses) {
                        var response = responses[status_code]
                        var description = (response.description!=null)?response.description:'';
                        out += '#### HTTP Status(' + status_code + ')'
                        if (description!='') out += ' - ' + description
                        out += crlf
                        if (response.content!=null) {
                            out += contentToMarkdown(response.content, table_name, '##### 傳回資料格式', '##### 傳回資料欄位說明')
                        }
                    }
                }

                out += crlf
            }
        }

        console.log(out)
        await fs.writeFile(__dirname + '/api.md', out);
    } catch (err) {
        console.log(err);
    }

}
example();
