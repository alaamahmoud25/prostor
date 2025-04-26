// eslint.config.js (أو .ts لو تستخدم TypeScript)
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';
import { config as tseslint } from 'typescript-eslint';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default [
  // قواعد ESLint و Next.js التقليدية
  ...compat.extends(['next/core-web-vitals', 'next/typescript']),

  // قواعد TypeScript ESLint الإضافية
  ...tseslint(),

  // قواعد مخصصة
  {
    rules: {
      // إيقاف القاعدة الأصلية لتجنب التعارض
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['error'],
    },
  },
];
