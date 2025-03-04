
const sql_path = __dirname + '/../../document/aegis_db_postgres.sql';
const uml_path = __dirname + '/../../document/aegis_db.uml';
const sample_name_snake = 'device_meter'
const from_dir = __dirname + '/' + sample_name_snake;
const to_dir_root = __dirname + '/../../src/modules';


const path = require('path');
const fs = require('fs');
const fsPromises = fs.promises;

//var resolver_content = fs.readFileSync(path.join(from_dir, sample_name_snake + '.resolver.ts'), 'utf-8');


function snakeToCamel(name) {
    return name.toLowerCase().replace(/([-_][a-z])/g, group =>
        group
        .toUpperCase()
        .replace('-', '')
        .replace('_', '')
    );
}

function upperToSnake(name) {
    return name.replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase();
}

function camelToUpper(name) {
    return name.charAt(0).toUpperCase() + name.substring(1, name.length);
}

function splitDot(str) {
    var ret = [];
    var size = str.length;
    var s = '';
    var in_quota = false;
    for (var n=0; n<size; n++) {
        var c = str.charAt(n);
        if (c=='(') in_quota=true;
        if (c==')') in_quota=false;
        if (!in_quota && c==',') {
            var s_trim = s.trim();
            if (s_trim!='') ret.push(s_trim);
            s = '';
            continue;
        }
        s+=c;
    }
    if (s.trim()!='') ret.push(s.trim());
    return ret;
}

function stripQuota(str) {
    if (str.length>=2 && str.charAt(0)=='"' && str.charAt(str.length-1)=='"') {
        str = str.substring(1, str.length-1)
    }
    return str;
}

async function replaceFile(tables, table, from_path, to_path) {

    var snake_name = table.table_name;           // ex: device_meter
    var camel_name = snakeToCamel(snake_name);   // ex: deviceMeter
    var upper_name = camelToUpper(camel_name);   // ex: DeviceMeter

    var primary_field_type = table.primary_field_type;

    var content = fs.readFileSync(from_path, 'utf-8');

    //if (snake_name=='area' && from_path.indexOf('entity')!=-1) {
    //    var x = 123;
    //}

    if (from_path.indexOf('device_meter.entity')!=-1 || from_path.indexOf('device_meter.args')!=-1) {
        content = content.replace(/device_meter_id:number;/g, '')
    }

    var id_type = 'number';
    if (primary_field_type=='CHAR' || primary_field_type=='VARCHAR' || primary_field_type=='TEXT') {
        id_type = 'string';
        if (from_path.indexOf('resolver')!=-1) {
            content = content.replaceAll("device_meter(@Context() context, @Args('device_meter_id', {type:()=>Int}) device_meter_id:number)", "device_meter(@Context() context, @Args('device_meter_id', {type:()=>String}) device_meter_id:string)")
        }
    }

    var import_list = [];
    var resolve_field = '';
    for (var foreign of table.foreigns) {
        var reference_snake_name = foreign.reference_table;
        if (import_list.indexOf(reference_snake_name)==-1) import_list.push(reference_snake_name);

        var resolve_field_name = foreign.foreign_key.substring(0, foreign.foreign_key.length-3);
        /*
        var resolve_field_table = tables.find(x=>x.table_name==foreign.reference_table);
        var resolve_field_type = resolve_field_table.fields.find(x=>x.field_name==foreign.reference_field).field_type;
        var resolve_field_type_graphql = 'Int';
        var resolve_field_type_typescript = 'number';
        if (resolve_field_type=='CHAR' || resolve_field_type=='VARCHAR' || resolve_field_type=='TEXT') {
            resolve_field_type_graphql = 'String';
            resolve_field_type_typescript = 'string';
        }
        */
    
        var reference_camel_name = snakeToCamel(reference_snake_name)
        var reference_upper_name = camelToUpper(reference_camel_name)
/*
  @ResolveField('areas', returns => [Area])
  async areas(@Parent() device_meter: DeviceMeter): Promise<Area[]> {
    const { device_meter_id } = device_meter;
    return this.deviceMeterService.findOne(device_meter_id);
  }
*/
        resolve_field += `
  @ResolveField('${resolve_field_name}', returns => ${reference_upper_name}Get, {nullable: true})
  async ${resolve_field_name}(@Context() context, @Parent() ${snake_name}: ${upper_name}Get): Promise<${reference_upper_name}Get|null> {
    const { ${foreign.foreign_key} } = ${snake_name};
    var service:any = this.${reference_camel_name}Service
    var findOne = (service.findOneInDomain ?? service.findOne).bind(service)
    return (${foreign.foreign_key}==null)?null:findOne(context.req?.user, ${foreign.foreign_key});
  }` + "\n";
    }

    for (var tab of tables) {
        var foreigns = tab.foreigns;
        var foreign_count = 0;
        for (var foreign of foreigns) {
            if (foreign.reference_table==snake_name) {
                foreign_count ++;
            }
        }
        for (var foreign of foreigns) {
            if (foreign.reference_table==snake_name) {
                if (import_list.indexOf(tab.table_name)==-1) import_list.push(tab.table_name);

                var reference_snake_name = tab.table_name;
                var reference_camel_name = snakeToCamel(reference_snake_name)
                var reference_upper_name = camelToUpper(reference_camel_name)
        
                let field_name_snake = reference_snake_name;
                if (foreign_count<=1) {
                    field_name_snake += 's';
                } else {
                    let foreign_key = foreign.foreign_key;
                    if (foreign_key.length>3 && foreign_key.substring(foreign_key.length-3, foreign_key.length)=='_id') {
                        foreign_key = foreign_key.substring(0, foreign_key.length-3);
                    }
                    field_name_snake += '_' + foreign_key;
                }
                if (field_name_snake==snake_name+'s') {
                    field_name_snake = 'child_'+field_name_snake;
                }

/*
  @ResolveField('user_permissions', returns => [UserPermission], {nullable:true})
  async user_permissions(
        @Parent() user: User,
        @Args() args: GetUserPermissionArgs
    ): Promise<Array<UserPermission|null>> {
    const {user_id} = user;
    if (user_id==null) return null;
    if (args==null) args = {}
    args.user_id = user_id;
    return this.userPermissionService.findAll({
        where: args,
    });
  }
*/

                resolve_field += `
  @ResolveField('${field_name_snake}', returns => [${reference_upper_name}Get], {nullable:true})
  async ${field_name_snake}(
      @Context() context,
      @Parent() ${snake_name}: ${upper_name}Get,
      @Args() args: Get${reference_upper_name}Args
    ): Promise<Array<${reference_upper_name}Get|null>> {
    const {${foreign.reference_field}} = ${snake_name};
    if (${foreign.reference_field}==null) return null;
    if (args==null) args = {}
    args.${foreign.foreign_key} = ${foreign.reference_field};
    var service:any = this.${reference_camel_name}Service
    var findAll = (service.findAllInDomain ?? service.findAll).bind(service)
    return findAll(context.req?.user, {
      where: args,
    });
  }
                `;

            }
        }
    }

    var reference_import = '';
    var reference_args_import = '';
    var reference_service = '';
    var module_imports = '';
    var module_providers = '';
    var reference_services = [];
    for (var reference_snake_name of import_list) {
        var reference_camel_name = snakeToCamel(reference_snake_name)
        var reference_upper_name = camelToUpper(reference_camel_name)
        if (reference_snake_name!=snake_name) {
            reference_import += `import { ${reference_upper_name} } from "../${reference_snake_name}/${reference_snake_name}.entity";` + "\n";
            reference_import += `import { ${reference_upper_name}Get } from "../${reference_snake_name}/${reference_snake_name}.get.entity";` + "\n";
            reference_import += `import { ${reference_upper_name}Service } from "../${reference_snake_name}/${reference_snake_name}.service";` + "\n";
            reference_args_import += `import { Get${reference_upper_name}Args } from "../${reference_snake_name}/${reference_snake_name}.args";` + "\n";
            reference_service += `    public readonly ${reference_camel_name}Service: ${reference_upper_name}Service,` + "\n";
            module_imports += `, TypeOrmModule.forFeature([${reference_upper_name}])`;
            module_providers += `, ${reference_upper_name}Service`;
            reference_services.push(`${reference_camel_name}Service`);
        }
    }
    var super_services = (reference_services.length==0)?'':', ';
    super_services += reference_services.join(', ');

    var import_all = false;
    if (import_all) {
        reference_import = '';
        module_imports = '';
        module_providers = '';
        for (var tab of tables) {
            if (tab.table_name!=snake_name) {
                var tab_snake_name = tab.table_name;
                var tab_camel_name = snakeToCamel(tab_snake_name)
                var tab_upper_name = camelToUpper(tab_camel_name)
                reference_import += `import { ${tab_upper_name} } from "../${tab_snake_name}/${tab_snake_name}.entity";` + "\n";
                reference_import += `import { ${tab_upper_name}Service } from "../${tab_snake_name}/${tab_snake_name}.service";` + "\n";
                module_imports += `, TypeOrmModule.forFeature([${tab_upper_name}])`;
                module_providers += `, ${tab_upper_name}Service`;
            }
        }
    }

    content = content.replaceAll('//--- @(reference_import) ---', reference_import);
    content = content.replaceAll('//--- @(reference_args_import) ---', reference_args_import);
    content = content.replaceAll('//--- @(reference_service) ---', reference_service);
    content = content.replaceAll('//--- @(resolve_field) ---', resolve_field);
    content = content.replaceAll('/* @(module_imports) */', module_imports);
    content = content.replaceAll('/* @(module_providers) */', module_providers);
    content = content.replaceAll('/* @(super_services) */', super_services);

    /*
    @ApiProperty()
    @PrimaryGeneratedColumn()
    @Column({ length: 64, default: '', nullable:true })
    @Column('decimal', { precision: 10, scale: 8, nullable: true })
    @Field(type => ID, { nullable: true, defaultValue:'' })
    @IsNumber()
    user_id: number;
    */

    /*
    @ApiProperty()
    @ManyToOne(() => Area)
    @JoinColumn({ name: 'area_id' })
    area: Area;
    */
  
    var paddind = '  ';
    var entities = '';
    var args = '';
    for (var field of table.fields) {
        var column_def = {}
        var field_def = {}
        entities += paddind + '@ApiProperty()' + '\n'

        var jstype = 'string';
        if (field.field_type=='BOOLEAN') {
            jstype = 'boolean';
            args += paddind + '@IsBoolean()' + '\n'
            entities += paddind + '@IsBoolean()' + '\n'
        } else if (field.field_type=='CHAR' || field.field_type=='VARCHAR' || field.field_type=='TEXT' || field.field_type=='DECIMAL') {
            jstype = 'string';
            args += paddind + '@IsString()' + '\n'
            entities += paddind + '@IsString()' + '\n'
        } else if (field.field_type=='INT' || field.field_type=='BIGINT' || field.field_type=='FLOAT' || field.field_type=='DOUBLE') {
            jstype = 'number';
            args += paddind + '@IsNumber()' + '\n'
            entities += paddind + '@IsNumber()' + '\n'
        } else if (field.field_type=='TIME' || field.field_type=='DATE' || field.field_type=='DATETIME' || field.field_type=='TIMESTAMP') {
            jstype = 'string';
            args += paddind + '@IsDateString()' + '\n'
            entities += paddind + '@IsDateString()' + '\n'
        }

        if (!field.is_primary) {
            column_def.nullable = !field.is_not_null;
            field_def.nullable = !field.is_not_null;
            if (!field.is_not_null) entities += paddind + '@IsOptional()' + '\n'
            //if (field.is_not_null) entities += paddind + '@IsNotEmpty()' + '\n'
        }

        /*
        if (jstype!='Date' && field.default_value!=null) {
            column_def.default = field.default_value;
            field_def.defaultValue = field.default_value;
        }
        */

        if (field.field_type=='VARCHAR' && field.field_type_param!=null) {
            column_def['length'] = parseInt(field.field_type_param)
        }

        args += paddind + '@IsOptional()' + '\n'
        if (field.is_primary) {
            //args += paddind + `@Field(type=>ID, { nullable: true })` + '\n'
            args += paddind + `@Field(type=>Int, { nullable: true })` + '\n'
            if (field.field_type=='CHAR' || field.field_type=='VARCHAR') {
                entities += paddind + '@PrimaryColumn()' + '\n'
            } else {
                entities += paddind + '@PrimaryGeneratedColumn()' + '\n'
            }
            //entities += paddind + `@Field(type=>ID, ${JSON.stringify(field_def)})` + '\n'
            entities += paddind + `@Field(type=>Int, ${JSON.stringify(field_def)})` + '\n'
        } else {
            if (field.field_type=='DECIMAL') {
                var a = field.field_type_param.split(',')
                column_def.precision = parseInt(a[0])
                column_def.scale = parseInt(a[1])
                args += paddind + `@Field(type=>String, { nullable: true })` + '\n'
                entities += paddind + `@Column('decimal', ${JSON.stringify(column_def)})` + '\n'
                entities += paddind + `@Field(type=>String, ${JSON.stringify(field_def)})` + '\n'
            } else if (field.field_type=='CHAR') {
                args += paddind + `@Field(type=>String, { nullable: true })` + '\n'
                entities += paddind + `@Column('char', ${JSON.stringify(column_def)})` + '\n'
                entities += paddind + `@Field(type=>String, ${JSON.stringify(field_def)})` + '\n'
            } else if (field.field_type=='TEXT') {
                args += paddind + `@Field(type=>String, { nullable: true })` + '\n'
                entities += paddind + `@Column('text', ${JSON.stringify(column_def)})` + '\n'
                entities += paddind + `@Field(type=>String, ${JSON.stringify(field_def)})` + '\n'
            } else if (field.field_type=='VARCHAR') {
                args += paddind + `@Field(type=>String, { nullable: true })` + '\n'
                entities += paddind + `@Column('varchar', ${JSON.stringify(column_def)})` + '\n'
                entities += paddind + `@Field(type=>String, ${JSON.stringify(field_def)})` + '\n'
            } else if (field.field_type=='INT') {
                args += paddind + `@Field(type=>Int, { nullable: true })` + '\n'
                entities += paddind + `@Column('int', ${JSON.stringify(column_def)})` + '\n'
                entities += paddind + `@Field(type=>Int, ${JSON.stringify(field_def)})` + '\n'
            } else if (field.field_type=='BIGINT') {
                args += paddind + `@Field(type=>Int, { nullable: true })` + '\n'
                entities += paddind + `@Column('bigint', ${JSON.stringify(column_def)})` + '\n'
                entities += paddind + `@Field(type=>Int, ${JSON.stringify(field_def)})` + '\n'
            } else if (field.field_type=='FLOAT') {
                args += paddind + `@Field(type=>Float, { nullable: true })` + '\n'
                entities += paddind + `@Column('float', ${JSON.stringify(column_def)})` + '\n'
                entities += paddind + `@Field(type=>Float, ${JSON.stringify(field_def)})` + '\n'
            } else if (field.field_type=='DOUBLE') {
                args += paddind + `@Field(type=>Float, { nullable: true })` + '\n'
                entities += paddind + `@Column('double', ${JSON.stringify(column_def)})` + '\n'
                entities += paddind + `@Field(type=>Float, ${JSON.stringify(field_def)})` + '\n'
            } else if (field.field_type=='DATE') {
                args += paddind + `@Field(type=>Date, { nullable: true })` + '\n'
                entities += paddind + `@Column('date', ${JSON.stringify(column_def)})` + '\n'
                entities += paddind + `@Field(type=>Date, ${JSON.stringify(field_def)})` + '\n'
            } else if (field.field_type=='DATETIME') {
                args += paddind + `@Field(type=>Date, { nullable: true })` + '\n'
                entities += paddind + `@Column('datetime', ${JSON.stringify(column_def)})` + '\n'
                entities += paddind + `@Field(type=>Date, ${JSON.stringify(field_def)})` + '\n'
            } else if (field.field_type=='TIMESTAMP') {
                args += paddind + `@Field(type=>Date, { nullable: true })` + '\n'
                entities += paddind + `@Column('timestamp', ${JSON.stringify(column_def)})` + '\n'
                entities += paddind + `@Field(type=>Date, ${JSON.stringify(field_def)})` + '\n'
            } else {
                args += paddind + `@Field({ nullable: true })` + '\n'
                entities += paddind + `@Column(${JSON.stringify(column_def)})` + '\n'
                entities += paddind + `@Field(${JSON.stringify(field_def)})` + '\n'
            }
        }
        var find_operator = (jstype=='string')?'|FindOperator<any>':'';
        args += paddind + field.field_name + '?:' + jstype + find_operator + ';' + '\n\n'
        entities += paddind + field.field_name + ':' + jstype + ';' + '\n\n'
    }
    content = content.replaceAll('//--- @(entities) ---', entities);
    content = content.replaceAll('//--- @(args) ---', args);


    content = content.replace(new RegExp('typeof DeviceMeter\.prototype.device_meter_id', 'g'), id_type);
    if (id_type=='string') {
        content = content.replace(new RegExp('\/\/--- if patch start ---', 'g'), '/*');
        content = content.replace(new RegExp('\/\/--- if patch end ---', 'g'), '*/');
    } else {
        content = content.replace(new RegExp('\/\/--- if patch start ---', 'g'), '');
        content = content.replace(new RegExp('\/\/--- if patch end ---', 'g'), '');
    }

    content = content.replace(new RegExp('device_meter', 'g'), snake_name);
    content = content.replace(new RegExp('DeviceMeter', 'g'), upper_name);
    content = content.replace(new RegExp('deviceMeter', 'g'), camel_name);

    console.log(to_path);
    console.log(content);

    //return;

    //if (!fs.existsSync(to_path)) {
        await fsPromises.writeFile(to_path, content);
    //}
}

async function main() {
    const allFileContents = fs.readFileSync(sql_path, 'utf-8');
    var lines = allFileContents.split('\n');
    var lines2 = [];
    for (var line of lines) {
        var t = line.indexOf('--');
        if (t!=-1) {
            line = line.substring(0,t)
        }
        lines2.push(line.trim());
    }
    var allFileContents2 = lines2.join('\n');


    var stmts = [];
    var stmt = '';
    var quota_deepth = 0;
    var in_q1 = false;
    var in_q2 = false;
    var in_q3 = false;
    for (var t=0; t<allFileContents2.length; t++) {
        var c = allFileContents2.charAt(t);
        if (c=='\r') continue;
        if (in_q1 && c!="'") {
            stmt +=c;
            continue;
        }
        if (in_q2 && c!='"') {
            stmt +=c;
            continue;
        }
        if (in_q3 && c!='`') {
            stmt +=c;
            continue;
        }

        if (c=="'") in_q1 = !in_q1;
        if (c=='"') in_q2 = !in_q2;
        if (c=='`') in_q3 = !in_q3;

        if (c=='(') quota_deepth ++;
        if (c==')') {
            quota_deepth --;
            if (quota_deepth<0) throw "quota_deepth<0";
        }
        stmt += c;
        if (c==';'|| (quota_deepth==0 && c=='\n')) {
            if (stmt.trim() != '') {
                stmts.push(stmt);
            }
            stmt = '';
        }
    }

    console.log(stmts);


    var tables = [];
    for (var table_str of stmts) {
        //console.log('----------------');
        //console.log(table);
        var table_lines = table_str.match(/CREATE TABLE \"*[0-9a-zA-Z_]+\"*[ ]*\(/)
        if (table_lines==null) continue;
        var table_line = table_lines[0];
        var table_name_snake = stripQuota(table_line.substring(13, table_line.length-1).trim().toLocaleLowerCase())

        //console.log(table_name_snake);
        console.log(camelToUpper(snakeToCamel(table_name_snake)) + 'Module,')

        var table = {
            primary_field_type: null,
            table_name: table_name_snake,
            fields: [],
            foreigns: []
        };
        tables.push(table);

        var field_strings = splitDot(table_str.substring(table_str.indexOf('(')+1, table_str.length-2));
        for (var field_str of field_strings) {
            field_str = field_str.trim();

            var is_primary = false;
            if (field_str.toUpperCase().indexOf('PRIMARY')!=-1) {
                is_primary = true;
            }

            if (field_str.search(/FOREIGN +KEY +\(\"*\w+\"*\) +REFERENCES +\"*\w+\"*\(\w+\)/g)!=-1) {
                var foreigns = field_str.replace(/FOREIGN +KEY +\(\"*(\w+)\"*\) +REFERENCES +\"*(\w+)\"*\((\w+)\)/g, '$1,$2,$3').split(',')
                var reference_field = foreigns[2];
                var t3 = reference_field.indexOf(' ')
                if (t3!=-1) reference_field = reference_field.substring(0, t3)
                table.foreigns.push({
                    foreign_key: stripQuota(foreigns[0]),
                    reference_table: stripQuota(foreigns[1]),
                    reference_field: stripQuota(reference_field)
                });
            } else {
                var n = field_str.indexOf(' ');
                var field_name = stripQuota(field_str.substring(0, n))
                var remain = field_str.substring(n, field_str.length).trim()
                var n1 = remain.indexOf(' ');
                if (n1==-1) n1=remain.length;
                var n2 = remain.indexOf('(');
                if (n2==-1) n2=remain.length;
                n = Math.min(n1, n2)
                var field_type = remain.substring(0, n);
                if (field_type=='SERIAL') field_type='INT';
                if (is_primary) table.primary_field_type = field_type;

                var field_type_param = null;
                var n3 = remain.indexOf('(', n);
                if (n3!=-1) {
                    var n4 = remain.indexOf(')', n3+1);
                    if (n4!=-1) {
                        field_type_param = remain.substring(n3+1, n4)
                    }
                }

                var is_not_null = false;
                if (remain.search(/NOT +NULL/ig)!=-1) {
                    is_not_null = true;
                }
    
                var default_value = null;
                var n = remain.indexOf ('DEFAULT')
                if (n!=-1) {
                    var t_start = n+7;
                    for (var t=t_start; t<remain.length; t++) {
                        var c = remain.charAt(t)
                        if (c!=' ') break;
                    }
                    var in_quota = false;
                    for (var t2=t; t2<remain.length; t2++) {
                        var c = remain.charAt(t2)
                        if (!in_quota && c==' ') break;
                        if (c=='\'') {
                            if (default_value==null) default_value = '';
                            in_quota = !in_quota;
                            continue;
                        }
                        if (default_value==null) default_value = '';
                        default_value += c;
                    }
                }

                table.fields.push({
                    field_name: field_name,
                    field_type: field_type,
                    field_type_param: field_type_param,
                    is_primary: is_primary,
                    is_not_null: is_not_null,
                    default_value: default_value
                })
            }
        }
        console.log(JSON.stringify(tables, null, 4));
    }

    for (var table of tables) {
        var table_name_snake = table.table_name;

        var to_dir = path.join(to_dir_root, table_name_snake);
        console.log(to_dir)
        if (!fs.existsSync(to_dir)) {
            await fsPromises.mkdir(to_dir)
        }
        if (!(
            table_name_snake=='user' || 
            table_name_snake=='role' || 
            table_name_snake=='domain' || 
            table_name_snake=='device' ||  
            table_name_snake=='sensor_schema' || 
            table_name_snake=='repair_order' ||
            table_name_snake=='repair_record' ||
            table_name_snake=='device_connection' ||
            table_name_snake=='device_type' ||
            table_name_snake=='mail' ||
            table_name_snake=='power_scheduler'
            )) {
            //await replaceFile(tables, table, path.join(from_dir, sample_name_snake + '.service.ts'), path.join(to_dir, table_name_snake + '.service.ts'))
            //await replaceFile(tables, table, path.join(from_dir, sample_name_snake + '.controller.ts'), path.join(to_dir, table_name_snake + '.controller.ts'))
            //await replaceFile(tables, table, path.join(from_dir, sample_name_snake + '.resolver.ts'), path.join(to_dir, table_name_snake + '.resolver.ts'))
        }

        /*
        if (!(
            table_name_snake=='domain' || 
            table_name_snake=='repair_order' ||
            table_name_snake=='repair_order_history' ||
            table_name_snake=='repair_record' ||
            table_name_snake=='repair_item'
            )) {
        }
        */

        //if (!(
        //    table_name_snake=='device' ||
        //    table_name_snake=='power_scheduler'
        //)) {
            await replaceFile(tables, table, path.join(from_dir, sample_name_snake + '.module.ts'), path.join(to_dir, table_name_snake + '.module.ts'))
        //}

        await replaceFile(tables, table, path.join(from_dir, sample_name_snake + '.args.ts'), path.join(to_dir, table_name_snake + '.args.ts'))
        await replaceFile(tables, table, path.join(from_dir, sample_name_snake + '.entity.ts'), path.join(to_dir, table_name_snake + '.entity.ts'))
        await replaceFile(tables, table, path.join(from_dir, sample_name_snake + '.service.base.ts'), path.join(to_dir, table_name_snake + '.service.base.ts'))
        await replaceFile(tables, table, path.join(from_dir, sample_name_snake + '.controller.base.ts'), path.join(to_dir, table_name_snake + '.controller.base.ts'))
        await replaceFile(tables, table, path.join(from_dir, sample_name_snake + '.resolver.base.ts'), path.join(to_dir, table_name_snake + '.resolver.base.ts'))

        //await replaceFile(tables, table, path.join(from_dir, sample_name_snake + '.get.entity.ts'), path.join(to_dir, table_name_snake + '.get.entity.ts'))

    }

    var uml = '@startuml' + '\n';
    for (var table of tables) {
        var table_name_snake = table.table_name;
        var table_camel_name = snakeToCamel(table_name_snake);   // ex: deviceMeter
        var table_upper_name = camelToUpper(table_camel_name);   // ex: DeviceMeter
        uml += `class ${table_upper_name} {\n`
        for (var field of table.fields) {
            uml += `  + ${field.field_name}\n`
        }
        uml += '}\n\n'
    }
    for (var table of tables) {
        var table_name_snake = table.table_name;
        var table_camel_name = snakeToCamel(table_name_snake);   // ex: deviceMeter
        var table_upper_name = camelToUpper(table_camel_name);   // ex: DeviceMeter
        for (var table2 of tables) {
            for (var foreign of table2.foreigns) {
                var table2_name_snake = table2.table_name;
                var table2_camel_name = snakeToCamel(table2_name_snake);   // ex: deviceMeter
                var table2_upper_name = camelToUpper(table2_camel_name);   // ex: DeviceMeter
        
                if (foreign.reference_table==table.table_name) {
                    uml += `${table_upper_name} --|{ ${table2_upper_name}\n`;
                    break;
                }
            }
        }
    }
    uml += '@enduml';
    console.log(uml);
    await fsPromises.writeFile(uml_path, uml);

    console.log('--------- Service ----------')
    for (var table of tables) {
        var table_name_snake = table.table_name;
        var table_camel_name = snakeToCamel(table_name_snake);   // ex: deviceMeter
        var table_upper_name = camelToUpper(table_camel_name);   // ex: DeviceMeter
        console.log(table_upper_name + 'Service,')
    }

    console.log('--------- Controller ----------')
    for (var table of tables) {
        var table_name_snake = table.table_name;
        var table_camel_name = snakeToCamel(table_name_snake);   // ex: deviceMeter
        var table_upper_name = camelToUpper(table_camel_name);   // ex: DeviceMeter
        console.log(table_upper_name + 'Controller,')
    }

    console.log('--------- Resolver ----------')
    for (var table of tables) {
        var table_name_snake = table.table_name;
        var table_camel_name = snakeToCamel(table_name_snake);   // ex: deviceMeter
        var table_upper_name = camelToUpper(table_camel_name);   // ex: DeviceMeter
        console.log(table_upper_name + 'sResolver,')
    }

}

main();
