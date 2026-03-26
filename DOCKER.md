# Docker Build and Run Instructions

## Building the Image

### Option 1: Using default values from Dockerfile
```bash
docker build -t pokemon-region-explorer .
```

### Option 2: Override environment variables at build time
```bash
docker build \
  --build-arg VITE_APP_NAME="My Custom Pokemon App" \
  --build-arg VITE_APP_VERSION="2.0.0" \
  -t pokemon-region-explorer .
```

### Option 3: Using a .env file for build args
```bash
docker build \
  --build-arg VITE_APP_NAME="$(grep VITE_APP_NAME .env | cut -d '=' -f2)" \
  --build-arg VITE_APP_VERSION="$(grep VITE_APP_VERSION .env | cut -d '=' -f2)" \
  -t pokemon-region-explorer .
```

## Running the Container

```bash
# Run on port 8080
docker run -p 8080:80 pokemon-region-explorer

# Run in detached mode
docker run -d -p 8080:80 --name pokemon-app pokemon-region-explorer

# Run with custom port
docker run -p 3000:80 pokemon-region-explorer
```

Access the application at: http://localhost:8080

## Docker Compose (Optional)

Create a `docker-compose.yml`:

```yaml
version: '3.8'

services:
  web:
    build:
      context: .
      args:
        VITE_APP_NAME: ${VITE_APP_NAME:-PokéRegion Explorer}
        VITE_APP_VERSION: ${VITE_APP_VERSION:-1.0.0}
    ports:
      - "8080:80"
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost/"]
      interval: 30s
      timeout: 3s
      retries: 3
```

Then run:
```bash
docker-compose up -d
```

## Important Notes

1. **Environment Variables**: Vite environment variables are embedded at **build time**, not runtime. To change them, you must rebuild the image.

2. **Adding New Environment Variables**: 
   - Add them to `.env.example`
   - Add corresponding ARG and ENV in Dockerfile
   - Pass them via `--build-arg` when building

3. **Health Check**: The container includes a health check at `/health` endpoint

4. **Image Size**: Final image is ~40MB (Alpine-based)

## Troubleshooting

- **Port already in use**: Change the port mapping `-p 8081:80`
- **Build fails**: Ensure you're in the `pokemon-region-explorer` directory
- **App not loading**: Check nginx logs with `docker logs <container-id>`
