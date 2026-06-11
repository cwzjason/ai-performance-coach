const https = require('https');

// SiliconFlow API 配置
const API_KEY = process.env.SILICONFLOW_API_KEY || 'sk-your-api-key-here';
const API_URL = 'api.siliconflow.cn';
const MODEL = 'Qwen/Qwen2.5-7B-Instruct';

exports.main = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json; charset=utf-8'
  };

  // 预检请求
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  try {
    // 兼容多种调用方式
    let bodyData;
    if (typeof event.body === 'string' && event.body) {
      bodyData = JSON.parse(event.body);
    } else if (event.body && typeof event.body === 'object') {
      bodyData = event.body;
    } else {
      bodyData = event; // invokeFunction 方式
    }

    const messages = bodyData.messages || [];
    const systemPrompt = bodyData.systemPrompt || '';

    const chatMessages = [];
    if (systemPrompt) {
      chatMessages.push({ role: 'system', content: systemPrompt });
    }
    for (const msg of messages) {
      const role = msg.role === 'manager' ? 'user' : 'assistant';
      chatMessages.push({ role, content: msg.content });
    }

    const postData = JSON.stringify({
      model: MODEL,
      messages: chatMessages,
      temperature: 0.85,
      max_tokens: 1024,
      top_p: 0.95
    });

    const options = {
      hostname: API_URL,
      port: 443,
      path: '/v1/chat/completions',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Length': Buffer.byteLength(postData)
      },
      timeout: 30000
    };

    const response = await new Promise((resolve, reject) => {
      const req = https.request(options, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => resolve({ statusCode: res.statusCode, data }));
      });
      req.on('error', reject);
      req.on('timeout', () => { req.destroy(); reject(new Error('Request timeout')); });
      req.write(postData);
      req.end();
    });

    if (response.statusCode !== 200) {
      return { statusCode: response.statusCode, headers, body: JSON.stringify({ error: response.data }) };
    }

    const result = JSON.parse(response.data);
    let text = '';
    if (result.choices && result.choices[0]) {
      text = result.choices[0].message?.content || '';
    }
    if (!text) text = '(员工思考中...)';

    return { statusCode: 200, headers, body: JSON.stringify({ response: text }) };

  } catch (e) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: e.message }) };
  }
};
