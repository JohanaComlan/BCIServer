// 引入所需模块  
const WebSocket = require('ws');  
const http = require('http');  

// 创建 HTTP 服务器  
const server = http.createServer();  

// 创建 WebSocket 服务器  
const wss = new WebSocket.Server({ server });  

// 处理连接事件  
// 用于存储客户端信息的数组  
let clients = new Map(); // 使用 Map 来存储客户端信息

// 处理连接事件  
wss.on('connection', (ws) => {  
    console.log('New client connected(新客户端接入)');  

    // 为新客户端分配一个唯一的 ID  
    // const clientId = clients.length + 1;  
    // clients.push({ id: clientId, socket: ws });  
    // console.log(`Client ID: ${clientId}`);  

    // 向新客户端发送欢迎消息  
    ws.send(`Welcome to the server!`);   
     
    ws.on('message', (message) => {  
        console.log(`Receive message from client: ${message}`);  

        // 解析接收到的消息  
        const data = JSON.parse(message); // 解析JSON 格式  

        // 如果消息中包含clientId  
        if (data.clientId) {  
            const clientId = parseInt(data.clientId);   
            // 检查是否已经存在该客户端 ID  
            if (!clients.has(clientId)) {  
                // 将 clientId 和 ws 关联存储  
                clients.set(clientId, ws);  
                ws.clientId = clientId; // 也可以将 clientId 存储在 ws 对象上  
                console.log(`Client ID is ${clientId}`);   
            } else {  
                console.log(`Client ID ${clientId} already exists.`);  
            }  
        }    

        // 如果消息中包含targetId  
        if (data.targetId) {  
            const targetClientId = parseInt(data.targetId); // 将 targetId 从字符串转换为整数  
            console.log(`Message content is: ${data.content}`);  
        
            // 向特定客户端发送消息  
            const targetClientSocket = clients.get(targetClientId); // 使用 Map 的 get 方法查找客户端  
        
            if (targetClientSocket && targetClientSocket.readyState === WebSocket.OPEN) {  
                targetClientSocket.send(`${data.content}`);  
            } else {  
                console.warn(`Target client ${targetClientId} is not connected or does not exist.`);  
            }  
        }  

        // 向所有连接的客户端广播消息  
        // wss.clients.forEach((client) => {  
        //     if (client.readyState === WebSocket.OPEN) {  
        //         client.send(`Server reply(服务器回复): ${data.content}`);  
        //     }  
        // });  
    });

    // 处理关闭事件  
    ws.on('close', () => {  
        // 查找与断开连接的 ws 相关联的 clientId  
        let disconnectedClientId = null;  
        for (const [id, socket] of clients.entries()) {  
            if (socket === ws) {  
                disconnectedClientId = id;  
                break;  
            }  
        }  

        if (disconnectedClientId !== null) {  
            console.log(`Client ${disconnectedClientId} disconnected(客户端 ${disconnectedClientId} 断开连接)`);  
            // 从客户端数组中移除已断开的客户端  
            clients.delete(disconnectedClientId);  
        } else {  
            console.warn('Client disconnected without a valid clientId(客户端断开连接时没有有效的 clientId)');  
        }    
    });    
});  

// 启动服务器  
const PORT = process.env.PORT || 8081; 
server.listen(PORT, () => {  
    console.log(`WebSocket The server is running, listening on port ${PORT}`);  
});