// =====================================================================
// Claude API integration. API key is stored in localStorage and sent
// directly to api.anthropic.com from the browser.
// =====================================================================

const API_KEY_KEY = 's360.claude.apiKey';
const MODEL = 'claude-haiku-4-5-20251001';

export function getApiKey() {
  return localStorage.getItem(API_KEY_KEY) || '';
}

export function setApiKey(key) {
  if (key) {
    localStorage.setItem(API_KEY_KEY, key.trim());
  } else {
    localStorage.removeItem(API_KEY_KEY);
  }
}

export function hasApiKey() {
  return !!getApiKey();
}

// complete() — mirrors window.claude.complete() from the design.
// Throws { code: 'NO_API_KEY' } when no key is configured so callers
// can prompt the user rather than swallowing a generic error.
export async function complete({ messages, maxTokens = 256 }) {
  const apiKey = getApiKey();
  if (!apiKey) {
    const err = new Error('No Anthropic API key configured');
    err.code = 'NO_API_KEY';
    throw err;
  }

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
      'content-type': 'application/json',
    },
    body: JSON.stringify({ model: MODEL, max_tokens: maxTokens, messages }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const msg = body?.error?.message || `API error ${res.status}`;
    if (res.status === 401) {
      const err = new Error('Invalid API key');
      err.code = 'INVALID_KEY';
      throw err;
    }
    throw new Error(msg);
  }

  const data = await res.json();
  return data.content[0].text;
}
