# deploy

Deployment workflow for Aesthetica STEM — Netlify (frontend) + Coolify (backend).

**Usage:** `/deploy [frontend|backend|both] [preview|prod]`

$ARGUMENTS

## Stack

- **Frontend:** Angular 21 SSR → Netlify (Edge Functions for SSR)
- **Backend:** NestJS → Coolify (Docker, self-hosted VPS)
- **DB:** MongoDB Atlas (cloud) or Coolify-managed MongoDB

## Frontend — Netlify

### netlify.toml
```toml
[build]
  base = "frontend"
  command = "npm run build:ssr"
  publish = "dist/frontend/browser"

[build.environment]
  NODE_VERSION = "20"

[[plugins]]
  package = "@netlify/plugin-angular-ssr"

[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/*.js"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/api/*"
  [headers.values]
    Cache-Control = "no-cache"

[[redirects]]
  from = "/api/*"
  to = "https://api.aesthetica.com/:splat"
  status = 200
```

### Angular SSR build
```bash
# package.json scripts
"build:ssr": "ng build --configuration production"
"prerender": "ng build --prerender"  # for static pages
```

### Environment files
```typescript
// src/environments/environment.prod.ts
export const environment = {
  production: true,
  apiUrl: 'https://api.aesthetica.com/api/v1',
};
```

## Backend — Coolify

### Dockerfile
```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=10s \
  CMD wget -qO- http://localhost:3000/health || exit 1
CMD ["node", "dist/main.js"]
```

### Coolify environment variables
```
MONGODB_URI=mongodb+srv://...
JWT_SECRET=<strong-random-secret>
JWT_EXPIRES_IN=7d
CORS_ORIGIN=https://aesthetica.netlify.app
PORT=3000
NODE_ENV=production
FRONTEND_URL=https://aesthetica.com
RATE_LIMIT_TTL=60
RATE_LIMIT_LIMIT=100
```

### NestJS main.ts for production
```typescript
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: process.env.CORS_ORIGIN, credentials: true });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.setGlobalPrefix('api/v1');
  const config = new DocumentBuilder()
    .setTitle('Aesthetica API').setVersion('1.0').addBearerAuth().build();
  SwaggerModule.setup('api/docs', app, SwaggerModule.createDocument(app, config));
  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
}
```

## GitHub Actions CI/CD

### .github/workflows/ci.yml
```yaml
name: CI
on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test-backend:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: backend
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20', cache: 'npm', cache-dependency-path: backend/package-lock.json }
      - run: npm ci
      - run: npm run lint
      - run: npm run test:cov
      - run: npm run build

  test-frontend:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: frontend
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20', cache: 'npm', cache-dependency-path: frontend/package-lock.json }
      - run: npm ci
      - run: npm run lint
      - run: npm run test -- --watch=false --browsers=ChromeHeadless
      - run: npm run build
```

## Deployment Commands

```bash
# Preview deploy (Netlify)
netlify deploy --dir=frontend/dist/browser

# Production deploy (Netlify)
netlify deploy --prod --dir=frontend/dist/browser

# Coolify: push to main branch → auto-deploy via webhook
# Or trigger manually from Coolify dashboard

# Health check
curl https://api.aesthetica.com/health
curl https://aesthetica.com/sitemap.xml
```

## Post-Deploy Checklist

- [ ] Health endpoint responds: `GET /health`
- [ ] API CORS allows frontend origin
- [ ] SSR renders meta tags (curl the page, check `<title>`)
- [ ] Sitemap accessible and submitted to Search Console
- [ ] Images serve from CDN with correct Cache-Control
- [ ] JWT auth flow works (login → token → protected route)
- [ ] MongoDB connected and queries working
- [ ] Rate limiting active (test with repeated requests)
