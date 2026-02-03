const http = require('http');
const { setTimeout } = require('timers');

const http = require('http');
const { setTimeout } = require('timers');

const data = JSON.stringify({
  name: 'Test Item',
  category: 'Electronics',
  floor: '1',
  aisle: 'A',
  rack: '1',
  shelf: '1',
  quantity: 20,
  minStockLevel: 5,
  description: 'Test from Node.js',
  createdBy: 'admin'
});

// Wait a bit before making request
setTimeout(() => {
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/items',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length
    }
  };

  const req = http.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    console.log(`HEADERS:`, res.headers);
    
    let responseData = '';
    res.on('data', (chunk) => {
      responseData += chunk;
    });
    
    res.on('end', () => {
      console.log('BODY:', responseData);
      process.exit(0);
    });
  });

  req.on('error', (error) => {
    console.error(`ERROR:`, error.message);
    process.exit(1);
  });

  req.write(data);
  req.end();
}, 8000);
