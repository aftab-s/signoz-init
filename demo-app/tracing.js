'use strict';

const { NodeSDK } = require('@opentelemetry/sdk-node');
const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node');
const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-http');
const { resources } = require('@opentelemetry/sdk-node');
const { SEMRESATTRS_SERVICE_NAME } = require('@opentelemetry/semantic-conventions');

const resource = resources.resourceFromAttributes({
  [SEMRESATTRS_SERVICE_NAME]: 'demo-app',
});


// Point to SigNoz OTLP endpoint
const traceExporter = new OTLPTraceExporter({
  url: 'http://localhost:4318/v1/traces',
});

const sdk = new NodeSDK({
  resource,
  traceExporter,
  instrumentations: [getNodeAutoInstrumentations()],
});

// Initialize the SDK before the app starts
sdk.start()

console.log('Tracing initialized');