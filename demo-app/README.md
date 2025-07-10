# Demo App - OpenTelemetry with SigNoz

A Node.js Express application demonstrating OpenTelemetry integration with SigNoz for observability (tracing and metrics).

## Features
- **Tracing**: Automatic HTTP request tracing
- **Custom Metrics**: 
  - `root_requests_count` - Counts requests to `/` endpoint
  - `slow_requests_count` - Counts requests to `/slow` endpoint
- **Two Endpoints**:
  - `GET /` - Fast response
  - `GET /slow` - 2-second delayed response

## Prerequisites
- Node.js installed
- SigNoz running on `http://localhost:4318`

## Setup
```bash
npm install
npm start
```

## Testing Endpoints
```bash
# Fast endpoint
curl http://localhost:3000/

# Slow endpoint  
curl http://localhost:3000/slow
```

## Generate Traffic for Testing
```bash
# Multiple requests to root
for ($i=1; $i -le 10; $i++) { curl http://localhost:3000/; Start-Sleep 1 }

# Multiple requests to slow endpoint
for ($i=1; $i -le 3; $i++) { curl http://localhost:3000/slow; Start-Sleep 3 }
```

## Observability
- **Traces**: Available in SigNoz traces dashboard
- **Metrics**: Custom counters exported every 5 seconds to SigNoz
- **Service Name**: `demo-app`