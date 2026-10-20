// Cloudflare Worker: saves newsletter signups to a D1 database.
//
// Only requests to /api/* run this code (see "run_worker_first" in
// wrangler.jsonc). Every other request is served straight from the static
// site in ./dist.
//
// See subscribers in the Cloudflare dashboard:
//   Storage & databases → D1 → vibe-coded-site-subscribers → Console
//   SELECT email, created_at FROM subscribers ORDER BY created_at DESC;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/api/subscribe') {
      if (request.method !== 'POST') {
        return json({ ok: false, error: 'Method not allowed.' }, 405);
      }
      return subscribe(request, env);
    }

    if (url.pathname.startsWith('/api/')) {
      return json({ ok: false, error: 'Not found.' }, 404);
    }

    return env.ASSETS.fetch(request);
  },
};

async function subscribe(request, env) {
  const wantsJson = (request.headers.get('Accept') || '').includes('application/json');

  let form;
  try {
    form = await request.formData();
  } catch {
    return reply(wantsJson, false, 'Please enter your email address.', 400);
  }

  // Honeypot: real visitors never see or fill the "website" field; bots often do.
  // Pretend it worked so bots don't retry, but save nothing.
  if (form.get('website')) {
    return reply(wantsJson, true, 'You’re subscribed!');
  }

  const email = String(form.get('email') || '').trim().toLowerCase();
  if (!email || email.length > 254 || !EMAIL_PATTERN.test(email)) {
    return reply(wantsJson, false, 'That doesn’t look like a valid email address.', 400);
  }

  try {
    // Creates the table on first use, so no manual database setup is needed.
    await env.DB.prepare(
      `CREATE TABLE IF NOT EXISTS subscribers (
        email TEXT PRIMARY KEY,
        created_at TEXT NOT NULL DEFAULT (datetime('now'))
      )`
    ).run();

    // Signing up twice is harmless: the existing row is kept.
    await env.DB.prepare('INSERT INTO subscribers (email) VALUES (?) ON CONFLICT(email) DO NOTHING')
      .bind(email)
      .run();
  } catch (error) {
    console.error('Failed to save subscriber', error);
    return reply(wantsJson, false, 'Something went wrong on our side. Please try again later.', 500);
  }

  return reply(wantsJson, true, 'You’re subscribed!');
}

// The site's script asks for JSON. If JavaScript is off, the browser submits
// the form normally, so send back a simple page with a link home instead.
function reply(wantsJson, ok, message, status = 200) {
  if (wantsJson) {
    return json(ok ? { ok } : { ok, error: message }, status);
  }
  const html = `<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${ok ? 'Subscribed' : 'Signup problem'}</title>
<body style="font-family:system-ui,sans-serif;max-width:32rem;margin:4rem auto;padding:0 1.25rem">
<h1>${message}</h1><p><a href="/">← Back to the site</a></p></body>`;
  return new Response(html, { status, headers: { 'Content-Type': 'text/html; charset=utf-8' } });
}

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
