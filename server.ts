function handleRequest(request: Request) {
  const { pathname } = new URL(request.url);

  if (request.method === 'GET' && pathname === '/') {
    const html = new URL('index.html', import.meta.url);
    return fetch(html);
  }
  return new Response(
    `<html>
      <head>
        <link rel="stylesheet" href="style.css" />
      </head>
      <body>
        <h1>Example</h1>
      </body>
    </html>`,
    {
      headers: {
        'content-type': 'text/html; charset=utf-8',
      },
    }
  );
}

addEventListener('fetch', (event: any) => {
  event.respondWith(handleRequest(event.request));
});
