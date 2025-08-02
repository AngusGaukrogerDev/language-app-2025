# Pre-commit Hook Setup

This setup ensures that no commits can be made without first passing linting checks on staged files.

## Installation Steps

1. **Install required dependencies:**
   ```bash
   npm install --save-dev husky lint-staged
   ```

2. **Initialize Husky:**
   ```bash
   npx husky init
   ```

3. **Make the pre-commit hook executable:**
   ```bash
   chmod +x .husky/pre-commit
   ```

## How It Works

### Pre-commit Hook (`.husky/pre-commit`)
- Runs `lint-staged` on staged files to fix linting issues automatically
- Runs `npm run build` to ensure the project builds successfully
- If either step fails, the commit is blocked

### Lint-staged Configuration (`package.json`)
- Automatically runs ESLint with `--fix` on staged JavaScript/TypeScript files
- Only processes files that are actually being committed

## Optional: Add Prettier for Code Formatting

If you want consistent code formatting, install Prettier:

```bash
npm install --save-dev prettier
```

Then update the `lint-staged` configuration in `package.json`:

```json
"lint-staged": {
  "*.{js,jsx,ts,tsx}": [
    "eslint --fix",
    "prettier --write"
  ],
  "*.{json,css,md}": [
    "prettier --write"
  ]
}
```

## Testing the Setup

1. Make a change to a TypeScript/JavaScript file
2. Stage the changes: `git add .`
3. Try to commit: `git commit -m "test commit"`
4. The pre-commit hook will run automatically

## Troubleshooting

- If the hook fails, fix the linting/build errors and try committing again
- To skip the hook in emergency situations: `git commit --no-verify -m "emergency commit"`
- To disable temporarily: `git config core.hooksPath /dev/null`
- To re-enable: `git config --unset core.hooksPath` 