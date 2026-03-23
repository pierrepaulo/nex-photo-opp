const LOGIN_FLASH_STORAGE_KEY = 'photoopp-login-flash';

export function setSessionExpiredLoginFlash(): void {
  try {
    sessionStorage.setItem(LOGIN_FLASH_STORAGE_KEY, 'session_expired');
  } catch {
    /* ignore quota / private mode */
  }
}

export function consumeLoginFlashMessage(): string | null {
  try {
    const raw = sessionStorage.getItem(LOGIN_FLASH_STORAGE_KEY);
    sessionStorage.removeItem(LOGIN_FLASH_STORAGE_KEY);
    if (raw === 'session_expired') {
      return 'Sua sessão expirou. Faça login novamente.';
    }
  } catch {
    /* ignore */
  }
  return null;
}
