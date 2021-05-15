import { listenAndServe } from 'https://deno.land/std/http/server.ts';
import { acceptWebSocket, acceptable } from 'https://deno.land/std/ws/mod.ts';
import { parse } from 'https://deno.land/std@0.83.0/flags/mod.ts';
import { chat } from './chat.ts';
import { room } from './room.ts';

const DEFAULT_PORT = 8080;
const argPort = parse(Deno.args).port;
const port = argPort ? Number(argPort) : DEFAULT_PORT;

if (isNaN(port)) {
  console.error('Port is not a number.');
  Deno.exit(1);
}

listenAndServe({ port }, async (req) => {
  console.log('🚀 ~ file: server.ts ~ line 17 ~ listenAndServe ~ req.url', req.url);
  if (req.method === 'GET' && req.url === '/') {
    req.respond({
      status: 200,
      headers: new Headers({
        'content-type': 'text/html',
      }),
      body: await Deno.open('./index.html'),
    });
  }

  if (req.method === 'GET' && req.url === '/ws') {
    if (acceptable(req)) {
      acceptWebSocket({
        conn: req.conn,
        bufReader: req.r,
        bufWriter: req.w,
        headers: req.headers,
      }).then(chat);
    }
  }

  if (req.method === 'GET' && req.url.startsWith('/room')) {
    req.respond({
      status: 200,
      headers: new Headers({
        'content-type': 'text/html',
      }),
      body: await Deno.open('./room.html'),
    });
  }

  if (req.method === 'GET' && req.url.startsWith('/ws/room')) {
    if (acceptable(req)) {
      acceptWebSocket({
        conn: req.conn,
        bufReader: req.r,
        bufWriter: req.w,
        headers: req.headers,
      }).then((ws) => {
        const r = decodeURI(req.url.split('/room/')[1]);
        room(ws, r);
      });
    }
  }
});

console.log('Server running on localhost:' + port);
