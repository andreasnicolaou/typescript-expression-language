# Contributing to TypeScript Expression Language

Thank you for your interest in contributing to TypeScript Expression Language! This document provides guidelines and instructions for contributing to the project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Making Changes](#making-changes)
- [Testing](#testing)
- [Code Style](#code-style)
- [Submitting Changes](#submitting-changes)
- [Reporting Issues](#reporting-issues)

## Code of Conduct

This project adheres to the [Contributor Covenant Code of Conduct](./CODE_OF_CONDUCT.md).
By participating, you are expected to uphold this code. Please be respectful and inclusive in all interactions.

If you experience or witness unacceptable behavior, please report it to the project maintainer at anicolaou66@gmail.com. All reports will be handled confidentially and promptly.

## Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- npm or yarn
- Git

### Fork and Clone

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/typescript-expression-language.git
   cd typescript-expression-language
   ```

## Development Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Build the project:
   ```bash
   npm run build
   ```

3. Run tests to ensure everything works:
   ```bash
   npm test
   ```

## Making Changes

### Branch Naming

Create a descriptive branch name:
- `feature/add-new-operator` for new features
- `fix/parser-error-handling` for bug fixes
- `docs/update-readme` for documentation
- `test/improve-coverage` for test improvements

### Commit Messages

Use clear, descriptive commit messages:
- Start with a verb in present tense (add, fix, update, remove)
- Keep the first line under 50 characters
- Add detailed description if needed

Examples:
```
Add support for null coalescing operator

Fix parser error when handling nested expressions

Update documentation for new API methods
```

## Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run CI tests
npm run test:ci
```

### Writing Tests

- Write tests for all new features and bug fixes
- Maintain or improve test coverage (aim for 90%+)
- Place test files next to the source files with `.test.ts` extension
- Use descriptive test names that explain the behavior being tested

Example test structure:
```typescript
describe('FeatureName', () => {
  test('should handle basic case', () => {
    // Arrange
    const input = 'test input';
    
    // Act
    const result = featureFunction(input);
    
    // Assert
    expect(result).toBe('expected output');
  });
});
```

### Test Coverage

We aim for high test coverage. Before submitting:
1. Run `npm run test:coverage`
2. Ensure new code is covered by tests
3. Check that overall coverage doesn't decrease

## Code Style

### Formatting

This project uses Prettier for code formatting with the following configuration:
- Single quotes
- Semicolons
- 120 character line width
- 2 space indentation
- Trailing commas (ES5)

Run formatting:
```bash
npm run format
```

### Linting

We use ESLint with TypeScript rules:
```bash
npm run lint
```

### TypeScript Guidelines

- Use strict TypeScript settings
- Prefer explicit types over `any`
- Use meaningful names for variables and functions
- Add JSDoc comments for public APIs
- Follow existing patterns in the codebase

Example:
```typescript
/**
 * Parses an expression string into an AST node.
 * @param expression - The expression string to parse
 * @param names - Available variable names
 * @returns The parsed AST node
 * @throws SyntaxError when expression is invalid
 */
public parse(expression: string, names: string[]): Node {
  // Implementation
}
```

## Submitting Changes

### Pull Request Process

1. Create a feature branch from `main`
2. Make your changes following the guidelines above
3. Ensure all tests pass and coverage is maintained
4. Update documentation if needed
5. Submit a pull request with:
   - Clear title describing the change
   - Detailed description of what was changed and why
   - Reference any related issues

### Pull Request Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tests pass locally
- [ ] New tests added for changes
- [ ] Coverage maintained or improved

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No breaking changes (or properly documented)
```

### Review Process

- All submissions require review
- Reviews focus on correctness, performance, and maintainability
- Address feedback promptly and respectfully
- Maintainers may request changes before merging

## Reporting Issues

### Bug Reports

When reporting bugs, include:
- Clear, descriptive title
- Steps to reproduce
- Expected vs actual behavior
- Environment details (Node.js version, OS)
- Code samples or test cases

### Feature Requests

For feature requests, include:
- Clear description of the proposed feature
- Use cases and motivation
- Examples of how it would work
- Consider backward compatibility

### Security Issues

For security vulnerabilities, please email the maintainer directly rather than opening a public issue.

## Project Structure

```
src/
├── node/              # AST node implementations
├── compiler.ts        # Expression compiler
├── lexer.ts          # Tokenization
├── parser.ts         # Expression parsing
├── expression-language.ts  # Main API
└── *.test.ts         # Test files
```

## Development Tips

- Use `npm run test:watch` during development
- Run `npm run lint` frequently to catch issues early
- Check test coverage with `npm run test:coverage`
- Build the project with `npm run build` before submitting

## Getting Help

- Check existing issues and documentation
- Ask questions in GitHub discussions
- Review the codebase for examples
- Reach out to maintainers if needed

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.
## Contribution Recognition

We value and appreciate all contributions to this project. Contributors are recognized in the following ways:

- All merged pull requests are credited in the GitHub contributors list.
- Major contributions and bug fixes are highlighted in release notes and changelogs.
- Contributors may be acknowledged in documentation or project announcements.
- If you wish to remain anonymous, please indicate this in your pull request or issue.

Thank you for helping make this project better!

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing! 🎉
