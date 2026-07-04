---
name: Bug report
about: Report a problem with the expression language
title: ''
labels: bug
assignees: ''
---

**Describe the bug**
A clear and concise description of what the bug is.

**Expression / code to reproduce**

```ts
import { ExpressionLanguage } from '@andreasnicolaou/typescript-expression-language';

const el = new ExpressionLanguage();
el.evaluate('...'); // what you ran
```

**Expected behavior**
What you expected to happen (e.g. the value/result you expected).

**Actual behavior**
What actually happened (error message, wrong result, stack trace).

**Environment**

- Package version: [e.g. 1.7.0]
- Node.js version: [e.g. 20.11]
- TypeScript version: [e.g. 5.9]
- Module format: [ESM / CJS / UMD]
- OS: [e.g. macOS, Windows, Linux]

**Additional context**
Add any other context about the problem here.
