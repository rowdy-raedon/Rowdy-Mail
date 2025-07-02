#!/usr/bin/env node

// Simple script to test webhook endpoints
const https = require('https');
const http = require('http');

const WEBHOOK_URL = process.env.WEBHOOK_URL || 'http://localhost:3000/api/webhook/email';
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || 'test-secret';

const testMessage = {
  to: 'test@rowdymail.pro',
  from: 'sender@example.com',
  subject: 'Test Message',
  text: 'This is a test message to verify the webhook is working correctly.',
  html: '<p>This is a <strong>test message</strong> to verify the webhook is working correctly.</p>',
  attachments: []
};

console.log('Testing webhook endpoint...');
console.log('URL:', WEBHOOK_URL);
console.log('Payload:', JSON.stringify(testMessage, null, 2));

const postData = JSON.stringify(testMessage);
const url = new URL(WEBHOOK_URL);

const options = {
  hostname: url.hostname,
  port: url.port || (url.protocol === 'https:' ? 443 : 80),
  path: url.pathname,
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData),
    'Authorization': `Bearer ${WEBHOOK_SECRET}`
  }
};

const client = url.protocol === 'https:' ? https : http;

const req = client.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  console.log(`Headers:`, res.headers);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('Response:', data);
    if (res.statusCode === 200) {
      console.log('✅ Webhook test successful!');
    } else {
      console.log('❌ Webhook test failed!');
    }
  });
});

req.on('error', (e) => {
  console.error('❌ Error testing webhook:', e.message);
});

req.write(postData);
req.end();