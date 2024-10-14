// 引入所需模块  
const WebSocket = require('ws');  
const http = require('http');  

// 创建 HTTP 服务器  
const server = http.createServer();  

// 创建 WebSocket 服务器  
const wss = new WebSocket.Server({ server });  

// 处理连接事件  
// 用于存储客户端信息的数组  
let clients = [];  

// 处理连接事件  
wss.on('connection', (ws) => {  
    console.log('New client connected(新客户端接入)');  

    // 为新客户端分配一个唯一的 ID  
    const clientId = clients.length + 1;  
    clients.push({ id: clientId, socket: ws });  
    console.log(`Client ID: ${clientId}`);  

    // 向新客户端发送欢迎消息  
    ws.send(`Welcome to the server! Your client ID is ${clientId}`);   
     
    ws.on('message', (message) => {  
        console.log(`Receive message from client ${clientId}(收到来自客户端 ${clientId} 的消息): ${message}`);  
    
        // 解析接收到的消息  
        const data = JSON.parse(message); // 假设消息是 JSON 格式  
        const targetClientId = parseInt(data.targetId); // 将 targetId 从字符串转换为整数  
        console.log(`Message content is: ${data.content}`)
    
        // 向特定客户端发送消息  
        const targetClient = clients.find(client => client.id === targetClientId);  
    
        if (targetClient && targetClient.socket.readyState === WebSocket.OPEN) {  
            targetClient.socket.send(`${data.content}`);  
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
        console.log(`Client ${clientId} disconnected(客户端 ${clientId} 断开连接)`);  
        // 从客户端数组中移除已断开的客户端  
        clients = clients.filter(client => client.id !== clientId);  
    });  
});  

// 启动服务器  
const PORT = process.env.PORT || 8081; 
server.listen(PORT, () => {  
    console.log(`WebSocket The server is running, listening on port ${PORT}`);  
});