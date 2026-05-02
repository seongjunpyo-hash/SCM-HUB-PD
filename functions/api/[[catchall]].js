// ============================================================
// SCM HUB · Auth API (Pages Functions, single-file router)
// ============================================================
// Routes:
//   POST   /api/auth/login        — email + password → session cookie
//   POST   /api/auth/logout       — clear session
//   GET    /api/auth/me           — current user info (or null)
//
//   GET    /api/users             — list users (super, admin)
//   POST   /api/users             — invite new user (role-based)
//   PATCH  /api/users/:id         — update user (toggle active, change role)
//   DELETE /api/users/:id         — delete user (super, admin* — *not admin role)
//
//   GET    /api/invite/:token     — verify invite token (for accept page)
//   POST   /api/invite/accept     — set password, activate account
//
// Bindings (configured in Cloudflare Pages dashboard):
//   env.DB              — D1 database
//   env.RESEND_API_KEY  — Resend API key (for invite emails)
// ============================================================

const ROLES = ['super', 'admin', 'biz', 'internal'];
const SESSION_DAYS = 30;
const INVITE_DAYS = 7;

// ----------------- helpers -----------------
const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

const nowUnix = () => Math.floor(Date.now() / 1000);

const randomHex = (bytes = 32) => {
  const arr = new Uint8Array(bytes);
  crypto.getRandomValues(arr);
  return [...arr].map((b) => b.toString(16).padStart(2, '0')).join('');
};

const hexToBytes = (hex) => {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  }
  return bytes;
};

// PBKDF2-SHA256 password hashing (Web Crypto API)
async function deriveKey(password, saltHex, iterations) {
  const enc = new TextEncoder();
  const salt = hexToBytes(saltHex);
  const baseKey = await crypto.subtle.importKey(
    'raw',
    enc.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits']
  );
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt, iterations, hash: 'SHA-256' },
    baseKey,
    256
  );
  return [...new Uint8Array(bits)]
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

async function hashPassword(password) {
  const salt = randomHex(16);
  const iterations = 100000;
  const key = await deriveKey(password, salt, iterations);
  return `pbkdf2-sha256$${iterations}$${salt}$${key}`;
}

async function verifyPassword(password, stored) {
  if (!stored || !stored.startsWith('pbkdf2-sha256$')) return false;
  const parts = stored.split('$');
  if (parts.length !== 4) return false;
  const iterations = parseInt(parts[1], 10);
  const salt = parts[2];
  const expected = parts[3];
  const got = await deriveKey(password, salt, iterations);
  // constant-time compare
  if (got.length !== expected.length) return false;
  let diff = 0;
  for (let i = 0; i < got.length; i++) diff |= got.charCodeAt(i) ^ expected.charCodeAt(i);
  return diff === 0;
}

// Cookie helpers
function getCookie(request, name) {
  const cookieHeader = request.headers.get('cookie') || '';
  const m = cookieHeader.match(new RegExp(`(?:^|;\\s*)${name}=([^;]+)`));
  return m ? decodeURIComponent(m[1]) : null;
}

function setCookieHeader(name, value, opts = {}) {
  const parts = [`${name}=${encodeURIComponent(value)}`];
  if (opts.maxAge != null) parts.push(`Max-Age=${opts.maxAge}`);
  if (opts.path) parts.push(`Path=${opts.path}`);
  if (opts.httpOnly) parts.push('HttpOnly');
  if (opts.secure) parts.push('Secure');
  if (opts.sameSite) parts.push(`SameSite=${opts.sameSite}`);
  return parts.join('; ');
}

// Permission matrix
function canCreateRole(creatorRole, targetRole) {
  if (creatorRole === 'super') return ROLES.includes(targetRole);
  if (creatorRole === 'admin') return ['biz', 'internal'].includes(targetRole);
  return false;
}

// Can `actor` modify/delete `target`?
function canModify(actor, target) {
  if (!actor || !target) return false;
  if (actor.id === target.id) return false; // can't self-modify via this path
  if (actor.role === 'super') return true;
  if (actor.role === 'admin' && ['biz', 'internal'].includes(target.role)) return true;
  return false;
}

// Audit
async function audit(env, request, actorId, targetId, action, details) {
  try {
    const ip = request.headers.get('cf-connecting-ip') || '';
    const ua = request.headers.get('user-agent') || '';
    await env.DB.prepare(
      `INSERT INTO audit_log (actor_user_id, target_user_id, action, details, ip, user_agent)
       VALUES (?, ?, ?, ?, ?, ?)`
    )
      .bind(actorId, targetId, action, details ? JSON.stringify(details) : null, ip, ua)
      .run();
  } catch (e) {
    console.error('audit failed:', e);
  }
}

// Get current user from session cookie
async function getCurrentUser(request, env) {
  const sid = getCookie(request, 'session');
  if (!sid) return null;
  const row = await env.DB.prepare(
    `SELECT u.id, u.email, u.name, u.role, u.is_active
     FROM sessions s JOIN users u ON u.id = s.user_id
     WHERE s.id = ? AND s.expires_at > ? AND u.is_active = 1`
  )
    .bind(sid, nowUnix())
    .first();
  return row || null;
}

// Generate a memorable but strong initial password (e.g., "k3rgs8nt-9f2a")
function generateInitialPassword() {
  const bytes = new Uint8Array(12);
  crypto.getRandomValues(bytes);
  const alphabet = 'abcdefghijkmnpqrstuvwxyz23456789';
  const main = [...bytes].slice(0, 8).map((b) => alphabet[b % alphabet.length]).join('');
  const suffix = ((bytes[8] << 16) | (bytes[9] << 8) | bytes[10]).toString(36).slice(0, 4);
  return `${main}-${suffix}`;
}

// Send welcome email with first password (used by /api/_seed-super)
async function sendWelcomeEmail(env, toEmail, password) {
  const body = {
    from: 'SCM HUB <onboarding@resend.dev>',
    to: [toEmail],
    subject: 'SCM HUB 슈퍼 계정 생성 완료',
    html: `
<div style="font-family:-apple-system,Segoe UI,sans-serif;max-width:560px;margin:0 auto;padding:32px 24px;color:#222;">
  <h2 style="margin:0 0 16px;">슈퍼 계정 생성 완료</h2>
  <p style="line-height:1.6;color:#444;">SCM HUB 슈퍼(super) 계정이 생성되었습니다.</p>
  <div style="background:#f5f5fa;border:1px solid #ddd;border-radius:10px;padding:16px 20px;margin:20px 0;">
    <div style="color:#888;font-size:12px;margin-bottom:4px;">초기 비밀번호</div>
    <code style="font-size:18px;font-weight:600;color:#6E6BFF;letter-spacing:0.5px;">${password}</code>
  </div>
  <p style="line-height:1.6;color:#666;font-size:13px;">로그인 후 즉시 비밀번호를 변경해 주세요.</p>
  <hr style="border:none;border-top:1px solid #eee;margin:24px 0;">
  <p style="color:#aaa;font-size:11px;">SCM HUB · MUSINSA Internal</p>
</div>`,
  };
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`resend ${res.status}: ${errText}`);
  }
}

// ----------------- main router -----------------
export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const path = url.pathname;
  const method = request.method;

  // Helper: parse JSON body safely
  const readBody = async () => {
    try {
      return await request.json();
    } catch {
      return {};
    }
  };

  try {
    // ========== /api/auth/login ==========
    if (path === '/api/auth/login' && method === 'POST') {
      const { email, password } = await readBody();
      if (!email || !password) return json({ error: 'invalid' }, 400);
      const emailLower = String(email).toLowerCase();

      const user = await env.DB.prepare(
        `SELECT id, email, name, role, password_hash, is_active FROM users WHERE email = ? COLLATE NOCASE`
      )
        .bind(emailLower)
        .first();

      if (!user || !user.password_hash || !user.is_active) {
        await audit(env, request, null, user?.id || null, 'login_failed', { email: emailLower, reason: 'no_user_or_inactive' });
        return json({ error: 'invalid_credentials' }, 401);
      }

      const ok = await verifyPassword(password, user.password_hash);
      if (!ok) {
        await audit(env, request, null, user.id, 'login_failed', { email: emailLower, reason: 'bad_password' });
        return json({ error: 'invalid_credentials' }, 401);
      }

      const sid = randomHex(32);
      const expires = nowUnix() + SESSION_DAYS * 86400;
      const ip = request.headers.get('cf-connecting-ip') || '';
      const ua = request.headers.get('user-agent') || '';
      await env.DB.prepare(
        `INSERT INTO sessions (id, user_id, expires_at, ip, user_agent) VALUES (?, ?, ?, ?, ?)`
      )
        .bind(sid, user.id, expires, ip, ua)
        .run();
      await env.DB.prepare(`UPDATE users SET last_login_at = ? WHERE id = ?`)
        .bind(nowUnix(), user.id)
        .run();
      await audit(env, request, user.id, user.id, 'login', null);

      return new Response(
        JSON.stringify({ user: { id: user.id, email: user.email, name: user.name, role: user.role } }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Set-Cookie': setCookieHeader('session', sid, {
              maxAge: SESSION_DAYS * 86400,
              path: '/',
              httpOnly: true,
              secure: true,
              sameSite: 'Lax',
            }),
          },
        }
      );
    }

    // ========== /api/auth/logout ==========
    if (path === '/api/auth/logout' && method === 'POST') {
      const sid = getCookie(request, 'session');
      if (sid) {
        await env.DB.prepare(`DELETE FROM sessions WHERE id = ?`).bind(sid).run();
      }
      return new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Set-Cookie': setCookieHeader('session', '', {
            maxAge: 0,
            path: '/',
            httpOnly: true,
            secure: true,
            sameSite: 'Lax',
          }),
        },
      });
    }

    // ========== /api/auth/me ==========
    if (path === '/api/auth/me' && method === 'GET') {
      const user = await getCurrentUser(request, env);
      if (!user) return json({ user: null });
      return json({ user: { id: user.id, email: user.email, name: user.name, role: user.role } });
    }

    // ========== /api/auth/change-password ==========
    if (path === '/api/auth/change-password' && method === 'POST') {
      const me = await getCurrentUser(request, env);
      if (!me) return json({ error: 'unauthorized' }, 401);

      const { currentPassword, newPassword } = await readBody();
      if (!currentPassword || !newPassword) return json({ error: 'invalid' }, 400);
      if (newPassword.length < 8) return json({ error: 'password_too_short' }, 400);
      if (currentPassword === newPassword) return json({ error: 'same_password' }, 400);

      // re-fetch full user record to get password_hash
      const row = await env.DB.prepare(`SELECT id, password_hash FROM users WHERE id = ?`)
        .bind(me.id)
        .first();
      if (!row || !row.password_hash) {
        await audit(env, request, me.id, me.id, 'change_password_failed', { reason: 'no_user' });
        return json({ error: 'unauthorized' }, 401);
      }
      const ok = await verifyPassword(currentPassword, row.password_hash);
      if (!ok) {
        await audit(env, request, me.id, me.id, 'change_password_failed', { reason: 'bad_current' });
        return json({ error: 'invalid_current' }, 401);
      }

      const newHash = await hashPassword(newPassword);
      await env.DB.prepare(`UPDATE users SET password_hash = ? WHERE id = ?`)
        .bind(newHash, me.id)
        .run();

      // Optional: invalidate all OTHER sessions (keep current one)
      const currentSid = getCookie(request, 'session');
      await env.DB.prepare(`DELETE FROM sessions WHERE user_id = ? AND id != ?`)
        .bind(me.id, currentSid || '')
        .run();

      await audit(env, request, me.id, me.id, 'change_password', null);
      return json({ ok: true });
    }

    // ========== /api/users (list / create) ==========
    if (path === '/api/users') {
      const actor = await getCurrentUser(request, env);
      if (!actor) return json({ error: 'unauthorized' }, 401);

      if (method === 'GET') {
        if (!['super', 'admin'].includes(actor.role)) return json({ error: 'forbidden' }, 403);
        const rows = await env.DB.prepare(
          `SELECT id, email, name, role, is_active, created_at, last_login_at,
                  (password_hash IS NULL) AS pending_invite, invite_expires_at
           FROM users ORDER BY created_at DESC`
        ).all();
        return json({ users: rows.results || [] });
      }

      if (method === 'POST') {
        const { email, name, role } = await readBody();
        if (!email || !role) return json({ error: 'invalid' }, 400);
        if (!ROLES.includes(role)) return json({ error: 'invalid_role' }, 400);
        if (!canCreateRole(actor.role, role)) return json({ error: 'forbidden' }, 403);

        const emailLower = String(email).toLowerCase();
        const exists = await env.DB.prepare(
          `SELECT id FROM users WHERE email = ? COLLATE NOCASE`
        )
          .bind(emailLower)
          .first();
        if (exists) return json({ error: 'email_exists' }, 409);

        const initialPassword = generateInitialPassword();
        const hash = await hashPassword(initialPassword);
        const result = await env.DB.prepare(
          `INSERT INTO users (email, name, role, password_hash, is_active, created_by_user_id)
           VALUES (?, ?, ?, ?, 1, ?) RETURNING id`
        )
          .bind(emailLower, name || null, role, hash, actor.id)
          .first();

        await audit(env, request, actor.id, result.id, 'user_create', {
          email: emailLower,
          role,
        });

        // Return the initial password ONCE — admin must copy and share via Slack/etc.
        return json({
          user: { id: result.id, email: emailLower, name: name || null, role },
          password: initialPassword,
        });
      }

      return json({ error: 'method_not_allowed' }, 405);
    }

    // ========== /api/users/:id (patch / delete) ==========
    const userIdMatch = path.match(/^\/api\/users\/(\d+)$/);
    if (userIdMatch) {
      const actor = await getCurrentUser(request, env);
      if (!actor) return json({ error: 'unauthorized' }, 401);

      const targetId = parseInt(userIdMatch[1], 10);
      const target = await env.DB.prepare(
        `SELECT id, email, role FROM users WHERE id = ?`
      )
        .bind(targetId)
        .first();
      if (!target) return json({ error: 'not_found' }, 404);

      if (!canModify(actor, target)) return json({ error: 'forbidden' }, 403);

      if (method === 'DELETE') {
        await env.DB.prepare(`DELETE FROM users WHERE id = ?`).bind(targetId).run();
        await audit(env, request, actor.id, target.id, 'user_delete', {
          email: target.email,
          role: target.role,
        });
        return json({ ok: true });
      }

      if (method === 'PATCH') {
        const { is_active, role } = await readBody();
        const updates = [];
        const values = [];
        if (typeof is_active === 'boolean' || is_active === 0 || is_active === 1) {
          updates.push('is_active = ?');
          values.push(is_active ? 1 : 0);
        }
        if (role && ROLES.includes(role)) {
          if (!canCreateRole(actor.role, role)) return json({ error: 'forbidden_role' }, 403);
          updates.push('role = ?');
          values.push(role);
        }
        if (updates.length === 0) return json({ error: 'no_changes' }, 400);
        values.push(targetId);
        await env.DB.prepare(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`)
          .bind(...values)
          .run();
        await audit(env, request, actor.id, target.id, 'user_update', { is_active, role });
        return json({ ok: true });
      }

      return json({ error: 'method_not_allowed' }, 405);
    }

    // ========== /api/users/:id/reset-password (super only) ==========
    const resetPwMatch = path.match(/^\/api\/users\/(\d+)\/reset-password$/);
    if (resetPwMatch && method === 'POST') {
      const actor = await getCurrentUser(request, env);
      if (!actor) return json({ error: 'unauthorized' }, 401);
      if (actor.role !== 'super') return json({ error: 'forbidden' }, 403);

      const targetId = parseInt(resetPwMatch[1], 10);
      if (targetId === actor.id) return json({ error: 'use_change_password' }, 400);

      const target = await env.DB.prepare(
        `SELECT id, email, role FROM users WHERE id = ?`
      )
        .bind(targetId)
        .first();
      if (!target) return json({ error: 'not_found' }, 404);

      const newPassword = generateInitialPassword();
      const hash = await hashPassword(newPassword);
      await env.DB.prepare(`UPDATE users SET password_hash = ? WHERE id = ?`)
        .bind(hash, targetId)
        .run();
      // Invalidate all sessions for the target user
      await env.DB.prepare(`DELETE FROM sessions WHERE user_id = ?`).bind(targetId).run();

      await audit(env, request, actor.id, target.id, 'password_reset', {
        email: target.email,
        role: target.role,
      });

      return json({
        ok: true,
        user: { id: target.id, email: target.email, role: target.role },
        password: newPassword,
      });
    }

    // ========== /api/_seed-super (one-time bootstrap) ==========
    // Creates the first super user when DB is empty. Returns the generated
    // password in the response AND tries to email it. Refuses if any user exists.
    if (path === '/api/_seed-super' && method === 'POST') {
      const { email, name } = await readBody();
      if (!email) return json({ error: 'email_required' }, 400);

      const existing = await env.DB.prepare(`SELECT COUNT(*) AS n FROM users`).first();
      if ((existing?.n ?? 0) > 0) {
        return json({ error: 'already_seeded' }, 409);
      }

      // Generate a memorable but strong password: 4 random words-like + 4 digits
      const pwBytes = new Uint8Array(12);
      crypto.getRandomValues(pwBytes);
      const password =
        [...pwBytes]
          .slice(0, 8)
          .map((b) => 'abcdefghijkmnpqrstuvwxyz23456789'[b % 32])
          .join('') +
        '-' +
        ((pwBytes[8] << 16) | (pwBytes[9] << 8) | pwBytes[10]).toString(36).slice(0, 4);

      const hash = await hashPassword(password);
      const emailLower = String(email).toLowerCase();
      const result = await env.DB.prepare(
        `INSERT INTO users (email, name, role, password_hash, is_active)
         VALUES (?, ?, 'super', ?, 1) RETURNING id`
      )
        .bind(emailLower, name || null, hash)
        .first();

      let emailStatus = 'sent';
      let emailError = null;
      try {
        await sendWelcomeEmail(env, emailLower, password);
      } catch (e) {
        emailStatus = 'failed';
        emailError = String(e.message || e);
      }

      await audit(env, request, result.id, result.id, 'super_seed', {
        email: emailLower,
        emailStatus,
      });

      return json({
        ok: true,
        user: { id: result.id, email: emailLower, role: 'super' },
        password, // shown only this once
        email: { status: emailStatus, error: emailError },
      });
    }

    // 404 fallthrough
    return json({ error: 'not_found', path }, 404);
  } catch (e) {
    console.error('handler error:', e, e?.stack);
    return json({ error: 'server_error', message: String(e?.message || e) }, 500);
  }
}

// Export utilities so a separate seed function can reuse them
export { hashPassword, randomHex, sendWelcomeEmail };
