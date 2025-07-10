# Demo App - Complete OpenTelemetry Observability with SigNoz

A comprehensive Node.js Express application demonstrating the three pillars of observability (Traces, Metrics, and Logs) using OpenTelemetry and SigNoz.

## 🚀 Features

### **Observability Stack**
- **📊 Distributed Tracing**: Automatic HTTP request/response tracing
- **📈 Custom Metrics**: Business logic counters and gauges  
- **📝 Structured Logging**: Multi-level logs with OpenTelemetry correlation

### **Application Endpoints**
- **`GET /`** - Fast response with INFO logging + request counter
- **`GET /slow`** - 2-second delayed response with WARN logging + slow counter
- **`GET /error`** - Error simulation with ERROR logging + stack traces

### **Custom Metrics**
- `root_requests_count` - Counts requests to `/` endpoint
- `slow_requests_count` - Counts requests to `/slow` endpoint

### **Logging Levels**
- **INFO**: Normal operations and request tracking
- **WARN**: Slow operations and performance warnings  
- **ERROR**: Error conditions with detailed stack traces

## 📋 Prerequisites

- **Node.js** (v16+ recommended)
- **SigNoz** running locally:
  - Traces: `http://localhost:4318/v1/traces`
  - Metrics: `http://localhost:4318/v1/metrics`  
  - Logs: `http://localhost:4317/v1/logs` (gRPC)

## 🛠️ Installation & Setup

```bash
# Install dependencies
npm install

# Start the application (loads .env automatically)
npm start

# Alternative: Start with explicit environment variables
OTEL_EXPORTER_OTLP_LOGS_ENDPOINT=http://localhost:4317/v1/logs OTEL_RESOURCE_ATTRIBUTES="service.name=demo-app,service.version=1.0.0" npm start
```

## 🧪 Testing & Traffic Generation

### **Basic Endpoint Testing**
```bash
# Test root endpoint (fast response)
curl http://localhost:3000/

# Test slow endpoint (2-second delay)
curl http://localhost:3000/slow

# Test error endpoint (500 error with logs)
curl http://localhost:3000/error
```

### **Generate Load for Observability**
```powershell
# Windows PowerShell - Multiple fast requests
for ($i=1; $i -le 10; $i++) { 
    curl http://localhost:3000/
    Start-Sleep 1 
}

# Multiple slow requests
for ($i=1; $i -le 5; $i++) { 
    curl http://localhost:3000/slow
    Start-Sleep 3 
}

# Generate some errors
for ($i=1; $i -le 3; $i++) { 
    curl http://localhost:3000/error 2>$null
    Start-Sleep 1 
}
```

```bash
# Linux/Mac - Generate mixed traffic
for i in {1..10}; do curl http://localhost:3000/; sleep 1; done
for i in {1..5}; do curl http://localhost:3000/slow; sleep 2; done  
for i in {1..3}; do curl http://localhost:3000/error; sleep 1; done
```

## 📊 Observability in SigNoz

### **Traces Dashboard**
- View HTTP request spans and timing
- Analyze request/response patterns
- Track service dependencies

### **Metrics Dashboard**  
- Monitor `root_requests_count` and `slow_requests_count`
- Create alerts on request volume
- Build custom dashboards

### **Logs Dashboard**
- Filter by log level (INFO, WARN, ERROR)
- Search log messages and error patterns
- Correlate logs with traces using trace IDs

## 🔧 Configuration Files

### **Environment Variables (.env)**
```properties
OTEL_EXPORTER_OTLP_LOGS_ENDPOINT=http://localhost:4317/v1/logs
OTEL_RESOURCE_ATTRIBUTES=service.name=demo-app,service.version=1.0.0
```

### **Service Configuration**
- **Service Name**: `demo-app`
- **Service Version**: `1.0.0`
- **Metric Export Interval**: 5 seconds
- **Log Level**: All levels (INFO, WARN, ERROR)

### **✅ Recent Fixes Applied**
- **Metrics Integration**: Fixed to use OpenTelemetry API global meter (connected to SDK)
- **Environment Loading**: Enabled `dotenv` to automatically load `.env` file
- **Log Configuration**: Properly configured Pino with OpenTelemetry transport

## 🛡️ Troubleshooting

### **Common Issues**

1. **Metrics not appearing in SigNoz:**
   - ✅ **FIXED**: Metrics now use the global OpenTelemetry API meter
   - Wait 5-10 seconds for metrics to be exported (5-second interval)
   - Check SigNoz metrics dashboard for `demo-app` service
   - Verify SigNoz collector endpoint: `http://localhost:4318/v1/metrics`

2. **Logs not appearing:**
   - ✅ **FIXED**: `.env` file now loads automatically with dotenv
   - Ensure `pino-opentelemetry-transport` is properly configured
   - Check gRPC endpoint `http://localhost:4317/v1/logs`
   - Verify environment variables are set correctly

3. **Traces missing:**
   - Verify SigNoz collector is running on port 4318
   - Check auto-instrumentation is enabled
   - Ensure requests are being made to instrumented endpoints

### **Development Commands**
```bash
# Start with debug logging
DEBUG=* npm start

# Check OpenTelemetry SDK status  
node -e "console.log(require('@opentelemetry/api').trace.getActiveSpan())"

# Validate SigNoz connectivity
curl http://localhost:4318/v1/traces -X POST -H "Content-Type: application/json" -d "{}"
```

## 📈 Monitoring Recommendations

1. **Set up alerts** for error rate > 5%
2. **Monitor slow requests** (>2 seconds)
3. **Track request volume** trends
4. **Create dashboards** for key business metrics
5. **Use log correlation** to debug issues efficiently

---

**Note**: This demo showcases production-ready observability patterns. Adapt the configuration for your specific monitoring needs.