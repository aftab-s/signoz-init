'use strict';

const { NodeSDK } = require('@opentelemetry/sdk-node');
const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node');
const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-http');
const { OTLPLogExporter } = require('@opentelemetry/exporter-logs-otlp-http');
const { resources } = require('@opentelemetry/sdk-node');
const { SEMRESATTRS_SERVICE_NAME, SEMRESATTRS_SERVICE_VERSION } = require('@opentelemetry/semantic-conventions');
const { OTLPMetricExporter } = require('@opentelemetry/exporter-metrics-otlp-http');
const { PeriodicExportingMetricReader } = require('@opentelemetry/sdk-metrics');
const { BatchLogRecordProcessor } = require('@opentelemetry/sdk-logs');

const resource = resources.resourceFromAttributes({
  [SEMRESATTRS_SERVICE_NAME]: 'demo-app',
  [SEMRESATTRS_SERVICE_VERSION]: '1.0.0',
});

// Point to SigNoz OTLP endpoints
const traceExporter = new OTLPTraceExporter({
  url: 'http://localhost:4318/v1/traces',
});

const metricExporter = new OTLPMetricExporter({
  url: 'http://localhost:4318/v1/metrics',
});

const logExporter = new OTLPLogExporter({
  url: 'http://localhost:4317/v1/logs',
});

// Create a metric reader that exports metrics every 5 seconds
const metricReader = new PeriodicExportingMetricReader({
  exporter: metricExporter,
  exportIntervalMillis: 5000, // Export every 5 seconds
});

// Create a log processor
const logProcessor = new BatchLogRecordProcessor(logExporter);

const sdk = new NodeSDK({
  resource,
  traceExporter,
  metricReader,
  logRecordProcessor: logProcessor,
  instrumentations: [getNodeAutoInstrumentations()],
});

// Initialize the SDK before the app starts
sdk.start();

console.log('OpenTelemetry instrumentation initialized: Traces, Metrics, and Logs!');