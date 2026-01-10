#!/usr/bin/env tsx
/**
 * Test DeepSeek API Connection
 */

import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function testAPI() {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  const apiBase = process.env.DEEPSEEK_API_BASE || 'https://api.deepseek.com';
  
  console.log('Testing DeepSeek API Connection...\n');
  console.log('API Base:', apiBase);
  console.log('API Key:', apiKey ? `${apiKey.substring(0, 10)}...` : 'NOT SET');
  console.log('');
  
  if (!apiKey) {
    console.error('❌ Error: DEEPSEEK_API_KEY not found in .env.local');
    process.exit(1);
  }
  
  try {
    console.log('Sending test request...');
    
    const response = await fetch(`${apiBase}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'user',
            content: 'Say "Hello, World!" in Chinese.'
          }
        ],
        max_tokens: 50,
      }),
    });
    
    console.log('Response status:', response.status);
    
    if (!response.ok) {
      const error = await response.text();
      console.error('❌ API Error:', error);
      process.exit(1);
    }
    
    const data = await response.json();
    console.log('\n✅ API Connection Successful!');
    console.log('Response:', data.choices[0].message.content);
    console.log('\nYou can now use: npm run ai-create-article');
    
  } catch (error: any) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

testAPI();
