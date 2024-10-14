// Import the Express module
const express = require('express');    
// Create express app
const app = express();  
const PORT = 3000;  

app.get('/', (req, res) => {  
    res.send('Hello, World!');  
});  

app.listen(PORT, () => {  
    console.log(`Server is running on http://localhost:${PORT}`);  
});