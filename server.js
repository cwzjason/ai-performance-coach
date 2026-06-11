const http = require('http');
const https = require('https');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'your-gemini-api-key-here';
const PORT = 3456;

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

const server = http.createServer((req, res) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, corsHeaders);
    res.end();
    return;
  }

  // Only accept POST to /api/chat
  if (req.method !== 'POST' || req.url !== '/api/chat') {
    res.writeHead(404, corsHeaders);
    res.end('Not Found');
    return;
  }

  let body = '';
  req.on('data', chunk => body += chunk);
  req.on('end', () => {
    try {
      const { messages, systemPrompt } = JSON.parse(body);

      // Build Gemini API request
      const contents = [];
      
      // Add system prompt as first user message (Gemini doesn't have native system role in v1)
      if (systemPrompt) {
        contents.push({
          role: 'user',
          parts: [{ text: systemPrompt }]
        });
        contents.push({
          role: 'model',
          parts: [{ text: '好的，我明白了。我会严格按照这个角色设定来回应。' }]
        });
      }

      // Add conversation messages
      for (const msg of messages) {
        const role = msg.role === 'manager' ? 'user' : 'model';
        contents.push({
          role: role,
          parts: [{ text: msg.content }]
        });
      }

      const requestBody = JSON.stringify({
        contents: contents,
        generationConfig: {
          temperature: 0.85,
          topP: 0.95,
          topK: 40,
          maxOutputTokens: 1024,
        },
        safetySettings: [
          { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
          { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
          { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
          { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
        ],
      });

      const options = {
        hostname: 'generativelanguage.googleapis.com',
        path: `/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(requestBody),
        },
      };

      const apiReq = https.request(options, (apiRes) => {
        let data = '';
        apiRes.on('data', chunk => data += chunk);
        apiRes.on('end', () => {
          try {
            const result = JSON.parse(data);
            
            if (result.error) {
              res.writeHead(500, { ...corsHeaders, 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: result.error.message }));
              return;
            }

            const text = result.candidates?.[0]?.content?.parts?.[0]?.text || '（员工思考中...）';
            res.writeHead(200, { ...corsHeaders, 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ response: text }));
          } catch (e) {
            res.writeHead(500, { ...corsHeaders, 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Parse error: ' + e.message }));
          }
        });
      });

      apiReq.on('error', (e) => {
        res.writeHead(500, { ...corsHeaders, 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'API error: ' + e.message }));
      });

      apiReq.write(requestBody);
      apiReq.end();

    } catch (e) {
      res.writeHead(400, { ...corsHeaders, 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Invalid JSON: ' + e.message }));
    }
  });
});

server.listen(PORT, () => {
  console.log(`\n✅ AI 绩效面谈陪练师 — 后端代理已启动`);
  console.log(`   地址: http://localhost:${PORT}`);
  console.log(`   API:  http://localhost:${PORT}/api/chat`);
  console.log(`   模型: Gemini 2.0 Flash (免费)\n`);
});
