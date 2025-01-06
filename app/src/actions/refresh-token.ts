export default async function refreshTokens() {
const refreshToken = sessionStorage.getItem('refreshToken');
  const response = await fetch('/auth/refresh-token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh_token: refreshToken }),
  });
  if (response.ok) {
    const data = await response.json();
    sessionStorage.setItem('accessToken', data.tokens.accessToken);
    sessionStorage.setItem('tokenExpiry', (Date.now() + data.expiresIn * 1000).toString());
    return data.tokens.accessToken;
  } 
}