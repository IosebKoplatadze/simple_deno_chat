import { listenAndServe } from 'https://deno.land/std/http/server.ts';
import { acceptWebSocket, acceptable } from 'https://deno.land/std/ws/mod.ts';
import { chat } from './chat.ts';

// addEventListener('fetch',  ((event:any) => {
//   const req=event.request as Request;
//   if (req.method === 'GET' && req.url === '/') {
//     const html = new URL('index.html', import.meta.url);
//     return fetch(html);
//   }

//   // if (req.method === 'GET' && req.url === '/ws') {
//   //   if (acceptable(req)) {event
//   //     acceptWebSocket({
//   //       conn: req,
//   //       bufReader: req.r,
//   //       bufWriter: req.w,
//   //       headers: req.headers,
//   //     }).then(chat);
//   //   }
//   // }
// }) as any);

listenAndServe({ port: 443 }, async (req) => {
  console.log('🚀 ~ file: server.ts ~ line 25 ~ listenAndServe ~ req', req)
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
});

console.log('Server running');
