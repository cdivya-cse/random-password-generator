import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import { spawn, ChildProcess } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT || 3000);
const JAVA_PORT = 8085;

let javaProcess: ChildProcess | null = null;
let javaStartTime = 0;
let javaStatus: 'STOPPED' | 'STARTING' | 'RUNNING' | 'ERROR' = 'STOPPED';
let javaLastError = '';

/**
 * Ensures the Java backend classes are compiled and starts the PasswordServer process.
 */
function startJavaBackend(): Promise<boolean> {
  return new Promise((resolve) => {
    const javaBinDir = path.resolve(__dirname, 'java-backend', 'bin');
    const javaSrcDir = path.resolve(__dirname, 'java-backend', 'src');

    if (!fs.existsSync(javaBinDir)) {
      fs.mkdirSync(javaBinDir, { recursive: true });
    }

    console.log('[Java Server] Compiling Java source files...');
    javaStatus = 'STARTING';

    const javac = spawn('javac', ['-d', 'java-backend/bin', 'java-backend/src/PasswordRule.java', 'java-backend/src/PasswordResult.java', 'java-backend/src/PasswordChecker.java', 'java-backend/src/PasswordGenerator.java', 'java-backend/src/PasswordService.java', 'java-backend/src/PasswordServer.java']);

    javac.on('close', (code) => {
      if (code !== 0) {
        console.error(`[Java Server] javac compilation failed with code ${code}`);
        javaStatus = 'ERROR';
        javaLastError = `Compilation failed with exit code ${code}`;
        resolve(false);
        return;
      }

      console.log('[Java Server] Compilation successful. Spawning Java HTTP server...');
      
      javaProcess = spawn('java', ['-cp', 'java-backend/bin', 'PasswordServer', String(JAVA_PORT)], {
        env: { ...process.env, JAVA_PORT: String(JAVA_PORT) }
      });

      javaProcess.stdout?.on('data', (data) => {
        const str = data.toString();
        console.log(`[Java STDOUT] ${str.trim()}`);
        if (str.includes('SecurePass Java Server Started')) {
          javaStatus = 'RUNNING';
          javaStartTime = Date.now();
        }
      });

      javaProcess.stderr?.on('data', (data) => {
        console.error(`[Java STDERR] ${data.toString().trim()}`);
      });

      javaProcess.on('error', (err) => {
        console.error('[Java Process Error]', err);
        javaStatus = 'ERROR';
        javaLastError = err.message;
      });

      javaProcess.on('close', (exitCode) => {
        console.log(`[Java Process Exited] code ${exitCode}`);
        javaStatus = 'STOPPED';
        javaProcess = null;
      });

      // Give server 500ms to bind
      setTimeout(() => {
        javaStatus = 'RUNNING';
        javaStartTime = Date.now();
        resolve(true);
      }, 500);
    });
  });
}

async function forwardToJava(endpoint: string, method: string, body?: any): Promise<{ status: number; data: any }> {
  try {
    const url = `http://127.0.0.1:${JAVA_PORT}${endpoint}`;
    const options: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (body && (method === 'POST' || method === 'PUT')) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(url, options);
    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { raw: text };
    }
    return { status: response.status, data };
  } catch (err: any) {
    console.error(`[Proxy Error] Failed to reach Java backend at ${endpoint}:`, err.message);
    throw err;
  }
}

async function startServer() {
  const app = express();
  app.use(express.json());

  // Start Java server child process
  await startJavaBackend();

  // API Route: Check Password (proxied directly to Java OOP PasswordServer)
  app.post('/api/check-password', async (req: Request, res: Response) => {
    try {
      const { status, data } = await forwardToJava('/api/check-password', 'POST', req.body);
      res.status(status).json(data);
    } catch (err: any) {
      res.status(502).json({
        error: 'Java Backend Gateway Error: ' + err.message,
        suggestion: 'The Java HttpServer is restarting or compiling. Please retry in a few seconds.',
      });
    }
  });

  // API Route: Generate Password (proxied directly to Java OOP PasswordServer)
  app.post('/api/generate-password', async (req: Request, res: Response) => {
    try {
      const { status, data } = await forwardToJava('/api/generate-password', 'POST', req.body);
      res.status(status).json(data);
    } catch (err: any) {
      res.status(502).json({
        error: 'Java Backend Gateway Error: ' + err.message,
        suggestion: 'The Java HttpServer is restarting or compiling. Please retry in a few seconds.',
      });
    }
  });

  // API Route: Java Health
  app.get('/api/health', async (_req: Request, res: Response) => {
    try {
      const { status, data } = await forwardToJava('/api/health', 'GET');
      res.status(status).json({
        ...data,
        proxyBridge: 'Express Node.js Port 3000',
        javaPid: javaProcess?.pid || null,
        uptimeSeconds: javaStartTime ? Math.floor((Date.now() - javaStartTime) / 1000) : 0,
      });
    } catch (err: any) {
      res.status(200).json({
        status: 'STARTING',
        service: 'SecurePass Java OOP Backend',
        engine: 'Java 17 OpenJDK (Initializing)',
        proxyBridge: 'Express Node.js Port 3000',
        error: err.message,
      });
    }
  });

  // API Route: OOP Architecture info
  app.get('/api/architecture', async (_req: Request, res: Response) => {
    try {
      const { status, data } = await forwardToJava('/api/architecture', 'GET');
      res.status(status).json(data);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // API Route: Download project zip
  app.get('/api/download-zip', (_req: Request, res: Response) => {
    const zipPath = path.resolve(__dirname, 'random-password-checker.zip');
    if (fs.existsSync(zipPath)) {
      res.download(zipPath, 'random-password-checker.zip');
    } else {
      res.status(404).json({ error: 'Zip archive not found' });
    }
  });

  // API Route: Get all Java source code files for student inspection
  app.get('/api/source-code', (_req: Request, res: Response) => {
    try {
      const srcDir = path.resolve(__dirname, 'java-backend', 'src');
      const files = ['PasswordChecker.java', 'PasswordGenerator.java', 'PasswordResult.java', 'PasswordRule.java', 'PasswordService.java', 'PasswordServer.java'];
      const sourceFiles: Record<string, string> = {};

      for (const file of files) {
        const filePath = path.join(srcDir, file);
        if (fs.existsSync(filePath)) {
          sourceFiles[file] = fs.readFileSync(filePath, 'utf-8');
        }
      }

      res.json({ files: sourceFiles });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to read source files: ' + err.message });
    }
  });

  // Dev server with Vite middleware
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production static serving
    const distPath = path.resolve(__dirname, 'dist');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('*', (_req, res) => {
        res.sendFile(path.resolve(distPath, 'index.html'));
      });
    }
  }

  // Graceful shutdown
  const shutdown = () => {
    if (javaProcess) {
      console.log('[Java Server] Stopping Java child process...');
      javaProcess.kill();
      javaProcess = null;
    }
    process.exit(0);
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Web Server] SecurePass App running on http://0.0.0.0:${PORT}`);
    console.log(`[Java Backend] Running on internal port ${JAVA_PORT}`);
  });
}

startServer().catch((err) => {
  console.error('[Server Error]', err);
  process.exit(1);
});
