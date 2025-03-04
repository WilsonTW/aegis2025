import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'path';
import { PowerScheduler } from './modules/power_scheduler/power_scheduler.entity';
import { UserWithPermission } from './modules/user/user_with_permission.entity';

export class AppConfigService {

    public static ROOT_DOMAIN_ID: number = 1;
    public static RECYCLE_DOMAIN_ID: number = 2;
    public static DEVICE_NAME_FIELD: string = 'DeviceName';
    public static PLACE_NAME_FIELD: string = 'PlaceName';
    public static DEVICE_NAME_MQTT_TOPIC: string = '_mqtt_topic';
    
    constructor() {}

    static getEnv(env_name, default_value='') {
        if (process.env[env_name]!=null) {
            return process.env[env_name];
        } else {
            return default_value;
        }
    }

    static getStaticPageRootPath() {
        return AppConfigService.getEnv('STATIC_PAGE', join(__dirname, '..', '..', 'web', 'dist'));
    }

    static getDatabaseConfig():TypeOrmModuleOptions {
        return {
            //type: 'mysql',
            //type: 'mariadb',
            type: 'postgres',
            //host: '127.0.0.1',
            // host: '192.168.1.20',
            //host: '192.168.1.36',
            host: 'localhost',
            //port: 3306,
            port: 5432,
            //username: 'root',
            username: 'postgres',
            password: 'abcd1234',
            database: 'aegis',
            entities: [__dirname + '/**/*.entity{.ts,.js}'],
            synchronize: false,
        }

        /*
        return {
            host: AppConfigService.getEnv('MYSQL_HOST', '127.0.0.1'),
            port: parseInt(AppConfigService.getEnv('MYSQL_PORT', '3306')),
            user: AppConfigService.getEnv('MYSQL_USER', 'root'), 
            password: AppConfigService.getEnv('MYSQL_PASSWORD', 'abcd1234'),
            database : AppConfigService.getEnv('MYSQL_DATABASE', 'aegis'),
            connectionLimit: 10,
        //    connectTimeout: 15000
        };
        */
    }

    static getInfluxdbConfig() {
        return {
            // 192.168.1.36
            //token: AppConfigService.getEnv('INFLUXDB_TOKEN', '3laePk3V2tdsxCWGoQKeNvdq0isbETmg5r-aTdTAegxPtLuEjQDtz_SDIN7V7dSB0BlUHtKBWJZPcuZCIGwloA=='),
            
            // 192.168.1.20
            token: AppConfigService.getEnv('INFLUXDB_TOKEN', 'zLi7R-fu6DPkEcKOJVzzH37nGKvfG1vtMdCOgu_yAaS-A8XuwyyIZxegt4Y1kJYT9kraDfVlBK7P5Fdg1-ARjA=='),
            
            url: AppConfigService.getEnv('INFLUXDB_URL', 'http://192.168.1.20:8086'),
            //url: AppConfigService.getEnv('INFLUXDB_URL', 'http://192.168.1.36:8086'),
            org: AppConfigService.getEnv('INFLUXDB_ORG', 'my-org'),
            bucket: AppConfigService.getEnv('INFLUXDB_BUCKET', 'aegis')
        };
    }

    static getLogDir() {
        return process.env.LOG_DIR;
    }

    static getSystemConfig() {
        var offline_timeout = parseInt(AppConfigService.getEnv('OFFLINE_TIMEOUT', '180000')) // 3*60*1000, 3min
        if (offline_timeout==null || isNaN(offline_timeout)) {
            offline_timeout = 180000
        }
        var test_mode_str = ''+AppConfigService.getEnv('TEST_MODE', 'false')
        var test_mode = (test_mode_str.toLowerCase() == 'true')

        return {
            test_mode: test_mode,

            static_page_path: AppConfigService.getEnv('STATIC_PAGE_PATH', join(__dirname, '..', 'public')),
            max_upload_file_size: AppConfigService.getEnv('MAX_UPLOAD_FILE_SIZE', String(3*1024*1024)),

            //upload_path: AppConfigService.getEnv('UPLOAD_PATH', join(__dirname, '..', 'public', 'upload')),
            //download_path: AppConfigService.getEnv('DOWNLOAD_PATH', 'upload'),
            upload_path: join(__dirname, '..', 'public', 'upload'),
            download_path: 'upload',
            
            repair_order_dirname: AppConfigService.getEnv('REPAIR_ORDER_DIRNAME', 'repair_order'),
            repair_record_dirname: AppConfigService.getEnv('REPAIR_RECORD_DIRNAME', 'repair_record'),
            domain_dirname: AppConfigService.getEnv('DOMAIN_DIRNAME', 'domain'),
            max_photo_wh: AppConfigService.getEnv('MAX_PHOTO_WH', String(4320)),

            pomcube_api_host: AppConfigService.getEnv('POMCUBE_API_HOST', 'https://k7topdvct9.execute-api.ap-northeast-1.amazonaws.com'),
            pomcube_username: AppConfigService.getEnv('POMCUBE_USERNAME', 'bomb054@gmail.com'),
            pomcube_password: AppConfigService.getEnv('POMCUBE_PASSWORD', 'Abcd1234'),

            tempfile_path: __dirname + '/../tmp',
            power_scheduler_measurement: 'power_scheduler',
            offline_timeout: offline_timeout,
        }
    }

    static getSystemUser() {
        var user:UserWithPermission = new UserWithPermission()
        user.user_id = null
        user.user_account = 'system'
        user.role_id = 1
        user.domain_id = 1
        user.permissions = ["all_perm"]
        return user
    }

}
