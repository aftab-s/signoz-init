// instrumentation.js
const opentelemetry = require('@opentelemetry/sdk-node');
const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node');
const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-http');
const { resources } = require('@opentelemetry/sdk-node');
const { SEMRESATTRS_SERVICE_NAME } = require('@opentelemetry/semantic-conventions');

const resource = resources.resourceFromAttributes({
  [SEMRESATTRS_SERVICE_NAME]: 'nodejs-app',
});

// Configure the OTLP HTTP Exporter to send traces to SigNoz OTel Collector
// SigNoz OTel Collector listens on port 4318 for HTTP OTLP traces.
const traceExporter = new OTLPTraceExporter({
  url: 'http://localhost:4318/v1/traces', // Default SigNoz OTel Collector endpoint
});

const sdk = new opentelemetry.NodeSDK({
  resource: resource,
  traceExporter: traceExporter,
  instrumentations: [getNodeAutoInstrumentations()], // Enable all automatic instrumentations
});

// Initialize the SDK and register with the OpenTelemetry API
sdk.start();
console.log('Tracing initialized');

// Gracefully shut down the SDK on process exit
process.on('SIGTERM', () => {
  sdk.shutdown()
    .then(() => console.log('Tracing terminated'))
    .catch((error) => console.error('Error terminating tracing', error))
    .finally(() => process.exit(0));
});