(() => {
  const guest = new URLSearchParams(location.search).get('utm_guest');
  if (guest !== null) {
    localStorage.removeItem('utm_guest');
    if (/^[^\s@{}]+@[^\s@{}]+\.[^\s@{}]+$/.test(guest)) {
      localStorage.setItem('utm_guest', guest);
    }
    const cleanUrl = new URL(location.href);
    cleanUrl.searchParams.delete('utm_guest');
    history.replaceState(history.state, '', cleanUrl);
  }

  const email = localStorage.getItem('utm_guest');
  if (!email) return;
  fetch('/api/guest-visit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, page: location.pathname }),
    keepalive: true
  }).catch(() => {});
})();
