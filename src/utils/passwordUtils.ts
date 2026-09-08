export interface PasswordOptions {
  length: number;
  uppercase: boolean;
  lowercase: boolean;
  numbers: boolean;
  symbols: boolean;
}

export function generatePassword(options: PasswordOptions): string {
  const upperChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowerChars = 'abcdefghijklmnopqrstuvwxyz';
  const numberChars = '0123456789';
  const symbolChars = '!@#$%^&*()_+~`|}{[]:;?><,./-=';

  let allowedChars = '';
  if (options.uppercase) allowedChars += upperChars;
  if (options.lowercase) allowedChars += lowerChars;
  if (options.numbers) allowedChars += numberChars;
  if (options.symbols) allowedChars += symbolChars;

  if (allowedChars.length === 0) return '';

  let password = '';
  const randomValues = new Uint32Array(options.length);
  window.crypto.getRandomValues(randomValues);

  for (let i = 0; i < options.length; i++) {
    password += allowedChars[randomValues[i] % allowedChars.length];
  }

  return password;
}

export function calculatePasswordStrength(password: string): string {
  let score = 0;
  if (!password) return 'Vazia';

  if (password.length > 8) score += 1;
  if (password.length > 12) score += 1;
  if (password.length >= 16) score += 1;

  if (/[A-Z]/.test(password)) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  if (score <= 2) return 'Fraca';
  if (score <= 4) return 'Média';
  if (score <= 5) return 'Forte';
  return 'Muito Forte';
}
