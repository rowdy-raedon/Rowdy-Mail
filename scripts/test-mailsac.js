#!/usr/bin/env node

// Simple script to test Mailsac API integration
const fetch = require('node-fetch');

const MAILSAC_API_KEY = process.env.MAILSAC_API_KEY || 'your_api_key_here';
const MAILSAC_BASE_URL = 'https://mailsac.com';

async function testMailsac() {
  console.log('Testing Mailsac API integration...\n');

  if (MAILSAC_API_KEY === 'your_api_key_here') {
    console.log('⚠️  Warning: Using placeholder API key. Set MAILSAC_API_KEY environment variable for real testing.\n');
  }

  try {
    // Test 1: Generate random email
    console.log('1. Testing random email generation...');
    const randomString = Math.random().toString(36).substring(2, 15);
    const testEmail = `${randomString}@mailsac.com`;
    console.log('✅ Generated email:', testEmail);
    
    // Test 2: Check for messages (should be empty for new email)
    console.log('\n2. Testing getMessages...');
    const messagesResponse = await fetch(`${MAILSAC_BASE_URL}/api/addresses/${encodeURIComponent(testEmail)}/messages`, {
      headers: {
        'Mailsac-Key': MAILSAC_API_KEY,
      },
    });
    
    if (messagesResponse.ok) {
      const messages = await messagesResponse.json();
      console.log('✅ Messages:', messages.length === 0 ? 'Empty (expected for new email)' : `${messages.length} messages found`);
    } else {
      console.log('❌ Failed to fetch messages:', messagesResponse.status, messagesResponse.statusText);
      if (messagesResponse.status === 401) {
        console.log('   This usually means the API key is invalid or not set.');
      }
    }
    
    // Test 3: Generate custom email
    console.log('\n3. Testing custom email generation...');
    const customLogin = 'test123';
    const customEmail = `${customLogin}@mailsac.com`;
    console.log('✅ Custom email:', customEmail);
    
    // Test 4: Test API endpoint accessibility
    console.log('\n4. Testing API endpoint accessibility...');
    const testResponse = await fetch(`${MAILSAC_BASE_URL}/api/addresses/test@mailsac.com/messages`, {
      headers: {
        'Mailsac-Key': MAILSAC_API_KEY,
      },
    });
    
    if (testResponse.ok) {
      console.log('✅ API endpoint accessible');
    } else {
      console.log('❌ API endpoint not accessible:', testResponse.status);
    }
    
    console.log('\n🎉 Mailsac API integration test completed!');
    
    if (MAILSAC_API_KEY === 'your_api_key_here') {
      console.log('\n📝 Next steps:');
      console.log('1. Sign up at https://mailsac.com');
      console.log('2. Get your API key from https://mailsac.com/api-keys');
      console.log('3. Add it to your .env.local file: MAILSAC_API_KEY=your_actual_key');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  testMailsac();
}

module.exports = { testMailsac };