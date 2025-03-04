
  const { parentPort } = require('worker_threads');

  // 接收來自主執行緒的訊息
  parentPort.on('message', (message) => {
    console.log('Received message from main thread: ' + message);
    
    // 回覆訊息給主執行緒
    parentPort.postMessage('Hello from worker thread!');
  });
