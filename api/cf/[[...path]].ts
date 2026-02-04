/**
 * Vercel Edge Function
 * 代理 Codeforces API，解决 CORS 问题
 * 
 * @author Cooper
 */

export const config = {
  runtime: 'edge',
};

export default async function handler(request: Request) {
  const url = new URL(request.url);
  const path = url.pathname.replace('/api/cf', '');
  const targetUrl = `https://codeforces.com/api${path}${url.search}`;

  try {
    const response = await fetch(targetUrl, {
      method: request.method,
      headers: {
        'Accept': 'application/json',
      },
    });

    const data = await response.text();

    return new Response(data, {
      status: response.status,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Cache-Control': 'public, max-age=60', // 缓存 60 秒
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        status: 'FAILED',
        comment: error instanceof Error ? error.message : 'Proxy error',
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }
}
