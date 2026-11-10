const pages = new Set(['/', '/index.html', '/save-the-date.html', '/travel.html']);
module.exports = async function (req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const {email, page} = req.body || {};
  if (typeof email !== 'string' || email.length > 254 || !/^[^\s@{}]+@[^\s@{}]+\.[^\s@{}]+$/.test(email) || !pages.has(page)) return res.status(400).end();
  const {GUEST_SHEET_WEBHOOK, GUEST_SHEET_SECRET} = process.env;
  if (!GUEST_SHEET_WEBHOOK || !GUEST_SHEET_SECRET) return res.status(503).end();
  try {
    const response = await fetch(GUEST_SHEET_WEBHOOK, {method:'POST', body:JSON.stringify({email,page,secret:GUEST_SHEET_SECRET})});
    if (!response.ok || !(await response.json()).ok) return res.status(502).end();
    return res.status(204).end();
  } catch { return res.status(502).end(); }
};
