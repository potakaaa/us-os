/**
 * Strict password validation rules for couple space lock.
 * Max length 72 chars (bcrypt limit).
 */

export const PASSWORD_RULES = {
  minLength: 8,
  maxLength: 72,
} as const;

export type PasswordRule =
  | 'minLength'
  | 'maxLength'
  | 'uppercase'
  | 'lowercase'
  | 'number'
  | 'special';

export type ValidationResult = {
  valid: boolean;
  failedRules: PasswordRule[];
};

const RULE_CHECKS: Record<PasswordRule, (password: string) => boolean> = {
  minLength: (p) => p.length >= PASSWORD_RULES.minLength,
  maxLength: (p) => p.length <= PASSWORD_RULES.maxLength,
  uppercase: (p) => /[A-Z]/.test(p),
  lowercase: (p) => /[a-z]/.test(p),
  number: (p) => /\d/.test(p),
  special: (p) => /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(p),
};

const ALL_RULES: PasswordRule[] = [
  'minLength',
  'maxLength',
  'uppercase',
  'lowercase',
  'number',
  'special',
];

export function validatePassword(password: string): ValidationResult {
  const failedRules: PasswordRule[] = ALL_RULES.filter(
    (rule) => !RULE_CHECKS[rule](password)
  );
  return {
    valid: failedRules.length === 0,
    failedRules,
  };
}

export function getRuleLabel(rule: PasswordRule): string {
  switch (rule) {
    case 'minLength':
      return `At least ${PASSWORD_RULES.minLength} characters`;
    case 'maxLength':
      return `No more than ${PASSWORD_RULES.maxLength} characters`;
    case 'uppercase':
      return 'At least one uppercase letter';
    case 'lowercase':
      return 'At least one lowercase letter';
    case 'number':
      return 'At least one number';
    case 'special':
      return 'At least one special character (!@#$%^&*...)';
    default:
      return '';
  }
}
