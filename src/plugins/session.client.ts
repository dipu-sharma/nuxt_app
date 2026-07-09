export default defineNuxtPlugin(() => {
  if (process.client) {
    window.addEventListener('beforeunload', () => {
      const match = document.cookie.match(new RegExp('(?:^|; )auth_token=([^;]*)'));
      const token = match ? decodeURIComponent(match[1]) : null;

      if (token) {
        // Since useRuntimeConfig isn't easily accessible inside a beforeunload synchronously without setup,
        // we'll rely on the default base URL for the beacon.
        const baseURL = 'http://192.168.157.128:8001';
        fetch(`${baseURL}/api/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          keepalive: true
        }).catch(() => {});
      }
    });
  }
});
