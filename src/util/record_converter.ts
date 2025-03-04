import { DarkBox } from "./darkbox";

const acorn = require("acorn");
const walk = require("acorn-walk");


/*
var store_tags = ['DeviceName:SmartPanel_ID','time:Timestamp','Transformers.Transformer_ID','ACBs.ACB_ID','Meters.Meter_ID', 'Transformers.aa.oo_id']
var store_fields = [
  'Status',
  'Transformers.Temperature',
  'zxc:Transformers.aa.oo_value',
  'ACBs.Release_Protection', 'ACBs.Closing_Abnormal', 'ACBs.Release_Abnormal', 'ACBs.Status',
  'Meters.Voltage_R','Meters.Voltage_S','Meters.Voltage_T',
  'Meters.Current_R','Meters.Current_S','Meters.Current_T',
  'Meters.Line_Voltage_RS','Meters.Line_Voltage_ST','Meters.Line_Voltage_RT',
  'Meters.Line_Current_R','Meters.Line_Current_S','Meters.Line_Current_T',
  'Meters.ActivePower','Meters.ReactivePower','Meters.PowerFactor'
]

async function test() {
  RecordConverter.updateVars(properties)
  var records = await RecordConverter.toInfluxRecords(properties, data)
  console.log(records)
}
*/


export class RecordConverter {


  static getUndefinedVars(script):string[] {
    const ast = acorn.parse(script, { ecmaVersion: 2020 });

    const definedVars = new Set<string>();
    const usedVars = new Set<string>();

    // Track defined variables
    walk.simple(ast, {
        VariableDeclarator(node) {
            definedVars.add(node.id.name);
        },
        FunctionDeclaration(node) {
            // Add function parameters as defined variables
            node.params.forEach(param => definedVars.add(param.name));
        },
        FunctionExpression(node) {
            // Add function parameters as defined variables
            node.params.forEach(param => definedVars.add(param.name));
        },
        ArrowFunctionExpression(node) {
            // Add function parameters as defined variables
            node.params.forEach(param => definedVars.add(param.name));
        }
    });

    // Track used variables
    walk.simple(ast, {
        Identifier(node) {
            if (node.name !== "undefined") {
                usedVars.add(node.name);
            }
        },
        MemberExpression(node) {
            if (node.object && node.property) {
                let name = getIdentifierName2(node)
                if (name!=null) {
                    usedVars.add(name);
                }
                /*
                const objectName = getIdentifierName(node.object);
                const propertyName = getIdentifierName(node.property);
                if (objectName) {
                    usedVars.add(`${objectName}.${propertyName}`);
                }
                */
            }
        }
    });

    // Helper function to get identifier name from a node
    function getIdentifierName(node) {
        if (node.type === "Identifier") {
            return node.name;
        } else if (node.type === "MemberExpression") {
            return getIdentifierName(node.object);
        }
        return null;
    }

    function getIdentifierName2(node):string {
        if (node.type === "Identifier") {
            return node.name;
        } else if (node.type === "MemberExpression") {
            if (node.object!=null) {
                var parent_name = getIdentifierName2(node.object)
                if (parent_name!=null) {
                    if (node.property.type === 'Literal') {
                        return parent_name + '.' + node.property.value;
                    } else if (node.property?.name!=null) {
                        return parent_name + '.' + node.property.name;
                    } else {
                        return parent_name
                    }
                }
            }
        }
        return null;
    }


    // Find variables that are used but not defined
    const undefinedVars:string[] = Array.from(usedVars).filter(v => !definedVars.has(v));
    return undefinedVars;
  }

  public static build(properties) {
    for (var property_fullname in properties) {
      var property = properties[property_fullname]
      var src;
      if (property.src!=null) {
        //src = property.src.replace(/\./g, '?.')
        src = property.src
      } else {
        src = property_fullname
        property.src = property_fullname
      }
      property.short_name = property_fullname.split('.').pop()

      if (property.type==null) {
        property.type = 'number'
      }

      property.vars = RecordConverter.getUndefinedVars(src);
    }

    var root = {
      name: '',
      fullpath: '',
      childs: []
    }
    for (var property_fullname in properties) {
      var property = properties[property_fullname]
      var paths = property_fullname.split('.')
      var node = root
      var fullpath = ''
      for (var path of paths) {
        if (node!=root) fullpath += '.'
        fullpath += path
        var child = node.childs.find(x=>x.name==path)
        if (child==null) {
          var prop = properties
          child = {
            name: path,
            fullpath: fullpath,
            property: (fullpath in properties)?properties[fullpath]:null,
            childs: []
          }
          node.childs.push(child)
        }
        node = child
      }
    }

    return root
    /*
    function toRecord(rules, node, parent_tags=[]) {
      if (node.childs.length==0) return;
      var rule = {
        fullpath: node.fullpath,
        tags: [...parent_tags],
        fields: []
      }
      for (var child of node.childs) {
        if (child.property!=null) {
          if (child.property.tag || child.fullpath=='time') {
            rule.tags.push(child.property)
          } else {
            rule.fields.push(child.property)
          }
        }
      }
      rules.push(rule)
      for (var child of node.childs) {
        toRecord(rules, child, rule.tags)
      }
    }

    var rules = []
    toRecord(rules, root, [])


    return rules
    */
  }

/*
  private static async _toInfluxRecords(records, properties, prefix, refs, root, parent, data) {
    // Transformers.aa.oo_value + Transformers.Temperature + 10
    for (var name in data) {
      var value = data[name]
      if (!Array.isArray(value) && typeof(value)!='object') {
        refs[prefix + name] = value
        parent[name] = value
      }
    }

    var fields = {}
    var tags = {}

    for (var prop_name in properties) {
      var property = properties[prop_name]
      var property_split = prop_name.split('.')
      var prop_name_short = property_split[property_split.length-1]
      if (prop_name_short=='time') property.tag=true;

      //if (property.tag==true || prop_prefix==prefix) {
        var found = true
        var same_level = false
        for (var va of property.vars) {
          if (!(va in refs)) {
            found = false
            break
          }
          let prop_prefix = ''
          let va_split = va.split('.')
          if (va_split.length>1) {
            va_split.pop()
            prop_prefix = va_split.join('.')
            if (prop_prefix!='') prop_prefix = prop_prefix + '.';
          }
          same_level = same_level || (prop_prefix == prefix)
        }
        if (property.tag==true || same_level) {
          var result = null
          try {
            result = await DarkBox.evalScript(property.src, root);
          } catch(ex) {
            console.log((ex.message!=null)?ex.message:ex)
          }
          if (result!=null) {
            if (property.tag==true) {
              tags[prop_name_short] = result
            } else {
              if (same_level) fields[prop_name_short] = result
            }
          }
        }
      //}

    }

    if (Object.keys(fields).length>0) {
      records.push({
        tags, fields
      })
    }

    for (var name in data) {
      var value = data[name]
      if (Array.isArray(value)) {
        for (var c of value) {
          var refs2 = {...refs}
          refs2[prefix + name] = {}
          parent[name] = {}
          await RecordConverter._toInfluxRecords(records, properties, prefix+name+'.', refs2, root, parent[name], c)
        }
      }
    }

  }

  public static async toInfluxRecords_old(properties, data) {
    var records = [];
    var root = {}
    await RecordConverter._toInfluxRecords(records, properties, '', {}, root, root, data)
    //console.log(JSON.stringify(records,null,4))
    return records
  }
*/

  public static async toInfluxRecords(data, program_root) {
    async function toRecs(recs, ancestor_tags, context_root, context, program_node) {

      if (program_node==null) return;

      var rec = {
        tags:[...ancestor_tags],
        fields:[],
        property_external:[]
      }
      for (var child of program_node.childs) {
        if (child.property!=null) {
          var property = child.property
          var value = null
          var src = property.src
          if (src!=null) {
            try {
              value = await DarkBox.evalScript(property.src, context_root);
            } catch(ex) {
              console.log((ex.message!=null)?ex.message:ex)
            }
          }
          if (property.external!=null) {
            rec.property_external.push(property)
          } else if (property.tag || property.short_name=='time') {
            rec.tags.push({
              name: property.short_name,
              value: value,
              type: property.type
            })
          } else {
            rec.fields.push({
              name: property.short_name,
              value: value,
              type: property.type
            })
          }
        }
      }
      recs.push(rec)

      for (var name in context) {
        var data_childs = context[name]
        if (Array.isArray(data_childs)) {
          var cnode = program_node.childs.find(x=>x.name==name)
          if (cnode!=null) {
            var backup = context[name]
            try {
              for (var c of data_childs) {
                context[name] = c
                await toRecs(recs, rec.tags, context_root, c, cnode)
              }
            } catch (ex) {console.log(ex)}
            context[name] = backup
          }
        }
      }

    }

    var recs = []
    await toRecs(recs, [], data, data, program_root)
    return recs;

  }

}


/*

var properties = {
  "time": {
    "type": "string",
    "format": "date-time",
    "src": "Timestamp"
  },
  "DeviceName": {
    "tag": true,
    "type": "string",
    "src": "SmartPanel_ID"
  },
  "Transformers.Transformer_ID": {
    "tag": true,
    "type": "string"
  },
  "ACBs.ACB_ID": {
    "tag": true,
    "type": "string"
  },
  "Meters.Meter_ID": {
    "tag": true,
    "type": "string"
  },
  "Transformers.aa.oo_id": {
    "tag": true,
    "type": "string"
  },
  "Transformers.aa.oo_value": {
    "type": "number"
  },
  "Transformers.aa.xx_value": {
    "type": "number",
    "src": "Transformers.aa.oo_value + Transformers.Temperature + 10"
  },
  "Status": {"type": "string"},
  "Transformers.Temperature": {"type": "number"},
  "ACBs.Release_Protection": {},
  "ACBs.Closing_Abnormal": {},
  "ACBs.Release_Abnormal": {},
  "ACBs.ACBStatus": {},
  "Meters.Voltage_R": {},
  "Meters.Voltage_S": {},
  "Meters.Voltage_T": {},
  "Meters.Current_R": {},
  "Meters.Current_S": {},
  "Meters.Current_T": {},
  "Meters.Line_Voltage_RS": {},
  "Meters.Line_Voltage_ST": {},
  "Meters.Line_Voltage_RT": {},
  "Meters.Line_Current_R": {},
  "Meters.Line_Current_S": {},
  "Meters.Line_Current_T": {},
  "Meters.ActivePower": {},
  "Meters.ReactivePower": {},
  "Meters.PowerFactor": {}
}


var data = {
  "SmartPanel_ID": "SP000001",
  "Timestamp": "2024-02-06T10:00:00Z",
  "Status": "Operational",
  "Transformers": [
      {
          "Transformer_ID": "1",
          "Temperature": 23,
          "aa": [{
            "oo_id": 'ooid',
            "oo_value": 37
          }]
      },
      {
          "Transformer_ID": "2",
          "Temperature": 25
      }
  ],
  "ACBs": [
      {
          "ACB_ID": "1",
          "Release_Protection": 1,
          "Closing_Abnormal": 0,
          "Release_Abnormal": 0,
          "ACBStatus": 1
      },
      {
          "ACB_ID": "2",
          "Release_Protection": 1,
          "Closing_Abnormal": 0,
          "Release_Abnormal": 1,
          "Status": 0
      }
  ],
  "Meters": [
      {
          "Meter_ID": "1",
          "Voltage_R": 233,
          "Voltage_S": 231,
          "Voltage_T": 238,
          "Current_R": 85,
          "Current_S": 73,
          "Current_T": 14,
          "Line_Voltage_RS": 220,
          "Line_Voltage_ST": 225,
          "Line_Voltage_RT": 230,
          "Line_Current_R": 12,
          "Line_Current_S": 15,
          "Line_Current_T": 13,
          "ActivePower": 2343,
          "ReactivePower": 3554,
          "PowerFactor": 0.97
      },
      {
          "Meter_ID": "2",
          "Voltage_R": 236,
          "Voltage_S": 238,
          "Voltage_T": 230,
          "Current_R": 90,
          "Current_S": 78,
          "Current_T": 65,
          "Line_Voltage_RS": 223,
          "Line_Voltage_ST": 229,
          "Line_Voltage_RT": 235,
          "Line_Current_R": 16,
          "Line_Current_S": 18,
          "Line_Current_T": 20,
          "ActivePower": 1900,
          "ReactivePower": 3200,
          "PowerFactor": 0.95,
          "Frequency": 50
      }
  ],
  "Input_Signals": {
      "Reserved1": 0,
      "Reserved2": 0
  }
}

async function test() {
  var program_root = RecordConverter.build(properties)
  var records = await RecordConverter.toInfluxRecords(data, program_root)
  console.log(JSON.stringify(records,null,4))
}
test()

*/