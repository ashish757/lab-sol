# Deployment Documentation

The application relies on Docker multi-stage builds and Azure Container Apps for modern, scale-to-zero serverless deployments.

## 1. Dockerization
The NestJS backend uses a multi-stage `Dockerfile` (`server/Dockerfile`):
- **Stage 1 (Builder)**: Installs all dependencies, generates the Prisma client, copies the `shared/` and `server/` directories, and runs `npm run build`.
- **Stage 2 (Production)**: Copies the compiled `dist/` and `package.json`, installs only production dependencies (`npm ci --only=production`), and runs the optimized Node process.

## 2. GitHub Container Registry (GHCR)
Docker images are built and pushed to GitHub Container Registry using Personal Access Tokens (PAT).
```bash
docker login ghcr.io -u <username>
docker build --platform linux/amd64 -f server/Dockerfile -t ghcr.io/<username>/labsol-server:init .
docker push ghcr.io/<username>/labsol-server:init
```

## 3. Azure Container Apps
The backend is deployed to Azure Container Apps, pulling the image from GHCR.

**Deployment Command**:
```bash
az containerapp create \
  --name labsol-api \
  --resource-group labsol-rg \
  --environment labsol-env \
  --image ghcr.io/<username>/labsol-server:init \
  --target-port 3000 \
  --ingress external \
  --registry-server ghcr.io \
  --registry-username <username> \
  --registry-password <ghcr_pat> \
  --env-vars \
    DATABASE_URL="postgresql://..." \
    RESEND_API_KEY="..." \
    JWT_SECRET="..." \
    FRONTEND_URL="..."
```

## 4. Azure DB for PostgreSQL
The application connects to a managed Azure Flexible Server running PostgreSQL. 
Migrations must be deployed against the remote database using the Container Apps exec command:
```bash
az containerapp exec \
  --name labsol-api \
  --resource-group labsol-rg \
  --command "npx prisma migrate deploy"
```

## 5. Frontend Deployment
The React/Vite frontend relies on environment variables (`.env.production`) to locate the backend. During the Vite build step, `VITE_API_URL` is statically injected into the bundle, removing hardcoded `localhost` references.
