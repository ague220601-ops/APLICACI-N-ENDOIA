export type UserRole = 'clinico' | 'tutor' | 'investigador';

export const ROLE_BY_EMAIL: Record<string, UserRole> = {
  'jennifer.endoia@gmail.com': 'tutor',
  'jenifer.margon@gmail.com': 'tutor',
  'segura.endoia@gmail.com': 'tutor',
  'sevillaendous@gmail.com': 'tutor',
  'ague220601@gmail.com': 'tutor',
  'investigador.endoia@gmail.com': 'investigador',
  'ague2206@gmail.com': 'investigador',
};

export function getRoleFromEmail(email: string | null | undefined): UserRole {
  if (!email) return 'clinico';
  const lower = email.toLowerCase();
  return ROLE_BY_EMAIL[lower] ?? 'clinico';
}
