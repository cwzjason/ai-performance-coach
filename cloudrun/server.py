"""
AI 绩效面谈陪练师 — 后端代理 (SiliconFlow API)
启动方式: python server.py

免费注册获取 API Key: https://cloud.siliconflow.cn/
"""
import json
import http.server
import urllib.request
import ssl
import os

# ========== 配置 ==========
SILICONFLOW_API_KEY = os.environ.get("SILICONFLOW_API_KEY", "sk-your-api-key-here")
PORT = int(os.environ.get("PORT", "3456"))  # CloudRun uses PORT env var (default 80)
MODEL = "Qwen/Qwen2.5-7B-Instruct"  # 免费模型，也可换 deepseek-ai/DeepSeek-V3
API_URL = f"https://api.siliconflow.cn/v1/chat/completions"


class CORSHandler(http.server.BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        self._send_cors()
        self.send_response(204)
        self.end_headers()

    def do_POST(self):
        if self.path != "/api/chat":
            self._send_cors()
            self.send_response(404)
            self.end_headers()
            self.wfile.write(b"Not Found")
            return

        try:
            length = int(self.headers.get("Content-Length", 0))
            body = self.rfile.read(length).decode("utf-8")
            data = json.loads(body)

            messages = data.get("messages", [])
            system_prompt = data.get("systemPrompt", "")

            # Build OpenAI-compatible messages
            chat_messages = []
            if system_prompt:
                chat_messages.append({"role": "system", "content": system_prompt})

            for msg in messages:
                role = "user" if msg.get("role") == "manager" else "assistant"
                chat_messages.append({
                    "role": role,
                    "content": msg.get("content", "")
                })

            req_body = json.dumps({
                "model": MODEL,
                "messages": chat_messages,
                "temperature": 0.85,
                "max_tokens": 1024,
                "top_p": 0.95,
            }).encode("utf-8")

            req = urllib.request.Request(API_URL, data=req_body)
            req.add_header("Content-Type", "application/json")
            req.add_header("Authorization", f"Bearer {SILICONFLOW_API_KEY}")

            ctx = ssl.create_default_context()
            with urllib.request.urlopen(req, context=ctx, timeout=30) as resp:
                result = json.loads(resp.read().decode("utf-8"))

            # Parse response
            text = ""
            if "choices" in result and result["choices"]:
                text = result["choices"][0].get("message", {}).get("content", "")

            if "error" in result:
                self._send_json(500, {"error": str(result["error"])})
                return

            if not text:
                text = "（员工思考中...）"

            print(f"  [AI] Response: {text[:50]}...", flush=True)
            self._send_json(200, {"response": text})

        except json.JSONDecodeError as e:
            self._send_json(400, {"error": f"Invalid JSON: {e}"})
        except urllib.error.HTTPError as e:
            err_body = e.read().decode("utf-8") if e.fp else str(e)
            print(f"  [ERR] HTTP {e.code}: {err_body}", flush=True)
            self._send_json(e.code, {"error": err_body})
        except Exception as e:
            print(f"  [ERR] {type(e).__name__}: {e}", flush=True)
            self._send_json(500, {"error": str(e)})

    def _send_cors(self):
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")

    def _send_json(self, status, data):
        body = json.dumps(data, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def log_message(self, format, *args):
        pass


if __name__ == "__main__":
    import sys, io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace', line_buffering=True)

    if SILICONFLOW_API_KEY == "sk-your-api-key-here":
        print("\n" + "="*50, flush=True)
        print("  [!] 请先设置 API Key!", flush=True)
        print("  步骤:", flush=True)
        print("  1. 打开 https://cloud.siliconflow.cn/", flush=True)
        print("  2. 注册账号（手机号即可）", flush=True)
        print("  3. 进入「API 密钥」页面创建 Key", flush=True)
        print("  4. 把 Key 填到 server.py 第 12 行 SILICONFLOW_API_KEY", flush=True)
        print("="*50 + "\n", flush=True)
    else:
        print(f"\n{'='*50}", flush=True)
        print(f"  [OK] AI Performance Coach Backend Started", flush=True)
        print(f"  URL:   http://localhost:{PORT}", flush=True)
        print(f"  API:  http://localhost:{PORT}/api/chat", flush=True)
        print(f"  Model: {MODEL} (SiliconFlow)", flush=True)
        print(f"{'='*50}\n", flush=True)
        print(f"  Now open ai-performance-coach.html\n", flush=True)

    server = http.server.HTTPServer(("0.0.0.0", PORT), CORSHandler)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\n  Backend closed.", flush=True)
        server.server_close()
