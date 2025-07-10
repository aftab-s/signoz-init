require('./instrumentation');

const express = require('express');
const { metrics } = require('@opentelemetry/api');

const app = express();

// --- Metrics Setup ---
// Use the SDK's global meter instead of creating a separate MeterProvider
const meter = metrics.getMeter('demo-app', '1.0.0');

// Create a counter metric for the /slow route
const slowRequestCounter = meter.createCounter('slow_requests_count', {
  description: 'Counts requests to the /slow endpoint',
});

// Create a counter for the / route too (optional)
const rootRequestCounter = meter.createCounter('root_requests_count', {
  description: 'Counts requests to the root (/) endpoint',
});

// --- Routes ---

app.get('/', (req, res) => {
  rootRequestCounter.add(1);
  res.send('Hello from the observable world!');
});

app.get('/slow', (req, res) => {
  slowRequestCounter.add(1);
  setTimeout(() => {
    res.send('This was a slow request!');
  }, 2000);
});

app.listen(3000, () => {
  console.log('App listening on port 3000');
});
