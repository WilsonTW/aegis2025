
const { Worker } = require('worker_threads');
const vm = require('vm');
const { isString, isNumber } = require('class-validator');

export class DarkBox {

    constructor() {
    }

    static proxyHandler = {
        get(target, prop) {
            // [global,clearImmediate,setImmediate,clearInterval,clearTimeout,setInterval,setTimeout,queueMicrotask,structuredClone,atob,btoa,performance,fetch,crypto,__filename,module,exports,__dirname,require,context,context0,sandbox,]
    
            if (typeof target[prop] != 'undefined') {
                return target[prop];
            } else {
                if (typeof global[prop] != 'undefined') {
                    if (['process', 'global', 'globalThis', 'eval',
                         'require', 'module', 'exports', '__dirname', '__filename',
                         'context', 'context0', 'sandbox',
                         'setTimeout', 'setImmediate', 'setInterval',
                         'clearTimeout', 'clearImmediate', 'clearInterval'
                        ].indexOf(prop)!=-1) {
                        return undefined;
                    }
                    return global[prop];
                } else {
                    return undefined;
                }
            }
            return undefined;
        },
        set(target, prop, value) {
            if (!target.hasOwnProperty(prop)) {
                target[prop] = value;
            }
            return true;
        }
    };

    static async evalScript(code, context=null, throw_error=true, timeout=5000) {
        if (context==null) context={};
        if (typeof(context)!='object') {
            throw "context must be 'Object'";
        }
        if (code==null) {
            return undefined;
        }
        if (typeof(code)!='string') {
            throw "code must be 'String'";
        }
        if (code.trim()=='') {
            return undefined;
        }

        const script = new vm.Script('('+code+')');
        const proxy = new Proxy(context, DarkBox.proxyHandler);
        const sandbox = vm.createContext(proxy);
        var ret = await script.runInNewContext(sandbox, {
            timeout: timeout
        });
        return ret;
    }

    static async evalScript2(code, context=null, throw_error=true, timeout=5000) {
        var prom = new Promise((resolve, reject) => {
            if (context==null) context={};
            if (typeof(context)!='object') {
                reject("context must be 'Object'");
                return;
            }
            if (code==null) {
                resolve(undefined);
                return;
            }
            if (typeof(code)!='string') {
                reject("code must be 'String'");
                return;
            }
            if (code.trim()=='') {
                resolve(undefined);
                return;
            }
    
            code = code.replace(/\`/g, '\\\`')
            var workerScript = `
            //var b = parseInt(12.67)
const { parentPort, stdin, stdout } = require("worker_threads");
// parentPort.on("message",message => parentPort.postMessage({ pong: message }));
const vm = require('vm');
var context = null;
const proxyHandler = {
    get(target, prop) {
        // [global,clearImmediate,setImmediate,clearInterval,clearTimeout,setInterval,setTimeout,queueMicrotask,structuredClone,atob,btoa,performance,fetch,crypto,__filename,module,exports,__dirname,require,context,context0,sandbox,]

        if (typeof target[prop] != 'undefined') {
            return target[prop];
        } else {
            if (typeof global[prop] != 'undefined') {
                if (['process', 'global', 'globalThis', 'eval',
                     'require', 'module', 'exports', '__dirname', '__filename',
                     'context', 'context0', 'sandbox',
                     'setTimeout', 'setImmediate', 'setInterval',
                     'clearTimeout', 'clearImmediate', 'clearInterval'
                    ].indexOf(prop)!=-1) {
                    return undefined;
                }
                return global[prop];
            } else {
                return undefined;
            }
        }

        return global;
        if (prop=='console') return console;
        else if (prop=='Infinity') return Infinity;
        else if (prop=='NaN') return NaN;
        else if (prop=='undefined') return undefined;
        else if (prop=='parseInt') return parseInt;
        else if (prop=='parseFloat') return parseFloat;
        else if (prop=='parseFloat') return parseFloat;
        else if (prop=='parseFloat') return parseFloat;
        else if (prop=='parseFloat') return parseFloat;
        else if (prop=='parseFloat') return parseFloat;

        return target[prop];
        //return target.hasOwnProperty(prop) ? target[prop] : null;

        var s = '';
        for (var n in target.global) {s+=n+',';}
        return '['+s+']';

        console.log('************  -----   target', target, 'prop', prop);
        //return target.hasOwnProperty(prop) ? target[prop] : null;
        if (prop=='parseInt') return target;
        return target[prop];
    },
    set(target, prop, value) {
        if (!target.hasOwnProperty(prop)) {
            target[prop] = value;
        }
        return true;
    }
};
var context0 = ${JSON.stringify(context)}
context = {
//    console: console,
//    parseInt,
//    parseFloat,
//    Math,
//   callback: (result) => {
//     console.log('Received result:', result);
//   }
//    ...global,
//    global,
    ...context0
};
//Object.assign(context, {
//    Math,
//    parseInt
//});
//console.log('context', context);
const proxy = new Proxy(context, proxyHandler);
var script = null;
try {
    script = new vm.Script(\`(${code})\`);
} catch(ex) {
    //console.log(ex);
    parentPort.postMessage({ error: ex.message })
}

if (script!=null) {
    var p = null;
    try {
        sandbox = vm.createContext(proxy);
        p = script.runInContext(sandbox);
    } catch(ex) {
        //console.log(ex);
        parentPort.postMessage({ error: ex.message })
    }
}
if (p==null) {
    parentPort.close()
} else if (p instanceof Promise) {
    p.then(function(result) {
        parentPort.postMessage({ result: result })
    }).catch(function(error) {
        parentPort.postMessage({ error: error.message })
    }).finally(function() {
        parentPort.close()
    })
} else {
    parentPort.postMessage({ result: p })
    parentPort.close()
}
            `;
            //console.log('workerScript', workerScript)
            //const worker = new Worker(workerScript, { eval: true, stdout:true, stderr:true, stdin:false });
            const worker = new Worker(workerScript, { eval: true });
            var timer = setTimeout(function() {
                try {
                    worker.terminate();
                } catch (ex) {console.log(ex);};
                reject("Execution time exceeded")
            }, timeout);

            worker.on('message', function(message) {
                clearTimeout(timer);
                //console.log('>>messag:', message)
                if (message.error!=null) {
                    reject(message.error)
                } else {
                    resolve(message.result)
                }
            });
        });
        if (throw_error) {
            return await prom;
        } else {
            try {
                return await prom;
            } catch(ex) {
                console.log(ex);
            }
        }
        return undefined;
    }
}

//exports.DarkBox = DarkBox;

// async function test() {
//     var code = `
//     (async function(){
//         return asdf;
//         var b = 5;
//         console.log('abcde');
//         return parseInt(a+b);
//     })()
//     `;
//     try {
//         var r = await DarkBox.evalScript(code, {a:12.345}, 5000);
//         console.log('rrr=', r);
//     } catch (ex) {
//         console.log('out - error: ', ex);
//     }
// }

//for (__global_name in global) {
//    console.log('__global_name = '+__global_name);
//}

//test();

// const { Worker } = require('worker_threads');
// /*
// const worker = new Worker('const { parentPort } = require("worker_threads");parentPort.on("message",message => parentPort.postMessage({ pong: message }));  ', { eval: true });
// worker.on('message', message => console.log(message));      
// worker.postMessage('ping');
// worker.postMessage('ping');
// */
