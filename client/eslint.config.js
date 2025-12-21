import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
<<<<<<< HEAD
import { globalIgnores } from 'eslint/config'

export default tseslint.config([
=======
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
>>>>>>> 6e25a48 (resuming project)
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
<<<<<<< HEAD
      reactHooks.configs['recommended-latest'],
=======
      reactHooks.configs.flat.recommended,
>>>>>>> 6e25a48 (resuming project)
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
  },
])
