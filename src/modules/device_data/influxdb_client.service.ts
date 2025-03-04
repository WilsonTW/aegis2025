import { Injectable } from '@nestjs/common';
import { AppConfigService } from '../../app_config.service';

const {Agent} = require('http')
const {InfluxDB, Point} = require('@influxdata/influxdb-client')

var client = null;


async function ajax(url, options, is_return_response=false, time = 15000) {
    const controller = new AbortController();
    setTimeout(() => {
        controller.abort();
    }, time);
    const config = { ...options, signal: controller.signal };
    try {
        const response = await fetch(url, config);
        if (is_return_response) return response;

        var text = await response.text();
        if (response.status>=400) {
            console.log('Cannot load page "'+url+'". response('+response.status+')="'+text+'"');
            return null;
        } else {
            return text;
        }
        //const responseJson = await response.json();
        //return responseJson;
    } catch (error) {
        console.log('Cannot load page "'+url+'"');
        console.error(error);
        return null;
    }
}


@Injectable()
export class InfluxdbClientService {

    constructor(
    ) {}

    static getClient() {
        if (client!=null) {
            return client;
        } else {
            try {
                const agent = new Agent({
                    keepAlive: true,
                    keepAliveMsecs: 5 * 1000, // 5 seconds keep alive
                })

                var config = AppConfigService.getInfluxdbConfig();
                let client2 = new InfluxDB({
                    url: config.url,
                    token: config.token,
                    transportOptions: {agent}
                })
                return client2;
            } catch (ex) {
                console.log("Cannot create influxdb client !!!");
                console.log(ex);
            }
        }
    }

    formatString(str: string) {
        str = str + "";
        var ret = str.replace(/\\/g, '\\\\');
        return ret.replace(/"/g, '\\\"');
    }

    async writeData(bucketName:string, measurementName:string, tags:Array<{name:string, value:string}>, fields:Array<{name:string, value:any, type:string}>, time:number|null=null) {
        var config = AppConfigService.getInfluxdbConfig();

        var arr_tags = [];
        for (var tag of tags) {
            var str = this.formatString(tag.value).replace(/ /g, '\\\ ');
            arr_tags.push(tag.name + '=' + str);
        }

        var arr_fields = [];
        for (var field of fields) {
            try {
                if (field.type=='int') {
                    var v = parseInt(field.value);
                    if (isNaN(v)) {
                        console.log("write to influxdb error. [" + field.name + "]=[" + field.value + "] must be a Integer");
                        continue;
                    } else {
                        arr_fields.push(field.name + '=' + (field.value + 'i'));
                    }
                } else if (field.type=='float') {
                    var v = parseFloat(field.value);
                    if (isNaN(v)) {
                        console.log("write to influxdb error. [" + field.name + "]=[" + field.value + "] must be a Float");
                        continue;
                    } else {
                        arr_fields.push(field.name + '=' + field.value);
                    }
                } else if (field.type=='string') {
                    if (typeof (field.value) == 'string') {
                        arr_fields.push(field.name + '="' + this.formatString(field.value) + '"');
                    } else {
                        var json_str = JSON.stringify(field.value);
                        arr_fields.push(field.name + '="' + this.formatString(json_str) + '"');
                    }
                } else if (field.type=='boolean') {
                    arr_fields.push(field.name + '=' + (('' + field.value == 'true') || ('' + field.value == 'True') || ('' + field.value == 'TRUE') || ('' + field.value == 'T') || ('' + field.value == '1')));
                } else {
                    arr_fields.push(field.name + '="' + this.formatString('' + field.value) + '"');
                }
            } catch (err) {
                console.log("write to influxdb error. [" + field.name + "]=[" + field.value + "]");
                console.log(err);
            }
        }

        var timestamp = null;
        if (time!=null) {
            timestamp = new Date(time).getTime();
            if (isNaN(timestamp)) {
                console.log('write to influxdb error. time is invalid - time=[' + time + ']');
                return;
            }
        }

        if (arr_fields.length > 0) {
            var url = config.url + `/api/v2/write?org=${encodeURIComponent(config.org)}&bucket=${encodeURIComponent(bucketName)}&precision=ms`;
            var data_tags_str = (arr_tags.length == 0) ? '' : ',' + arr_tags.join(',');
            var body = this.formatString(measurementName).replace(' ', '\\\ ') + data_tags_str + ' ' + arr_fields.join(',');
            if (timestamp!=null) {
                var timestamp_ns = timestamp * 1000000;
                body += ' ' + timestamp_ns;
            }

        //    console.log('url', url);
        //    console.log('body', body);

            // GET localhost:8086/api/v2/write?bucket=db/rp&precision=s
            // mem,host=host1 used_percent=23.43234543 1556896326
            await ajax(url, {
                method: "POST",
                headers: new Headers({
                    'Authorization': 'Token ' + config.token,
                }),
                body: body,
                cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
                mode: 'cors', // no-cors, cors, *same-origin
            }, false, 10000);
        }



    }


}
