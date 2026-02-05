# Test App Node

A production-ready Node.js/Express/TypeScript application with comprehensive CI/CD pipeline.

## Features

- **Express.js** REST API with TypeScript
- **Zod** validation
- **Winston** logging
- **Helmet**, **CORS**, **Rate Limiting** security
- **Jest** testing (unit, integration, e2e)
- **ESLint** + **Prettier** code quality
- **Docker** multi-stage builds
- **GitHub Actions** CI/CD pipeline

## Quick Start

```bash
# Install dependencies
npm install

# Development
npm run dev

# Build
npm run build

# Production
npm start
```

## Testing

```bash
# Unit & Integration tests
npm test

# With coverage
npm run test:coverage

# E2E tests
npm run test:e2e
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /health | Health check |
| GET | /health/live | Liveness probe |
| GET | /health/ready | Readiness probe |
| GET | /api/items | List items |
| POST | /api/items | Create item |
| GET | /api/items/:id | Get item |
| PATCH | /api/items/:id | Update item |
| DELETE | /api/items/:id | Delete item |
| GET | /api/users | List users |
| POST | /api/users | Create user |
| GET | /api/users/:id | Get user |
| PATCH | /api/users/:id | Update user |
| DELETE | /api/users/:id | Delete user |

## CI/CD Pipeline

The pipeline includes:

1. **Code Quality**: ESLint, Prettier, TypeScript
2. **Testing**: Unit tests (Node 18/20/22), E2E tests
3. **Security**: npm audit, Snyk, CodeQL, Trivy
4. **Build**: TypeScript compilation, Docker multi-arch
5. **Release**: Semantic versioning, changelog generation
6. **Deploy**: Staging (develop), Production (tags)

## License

MIT
