
require('dotenv').config();
require('./instrumentation');

const express = require('express');
const pino = require('pino');
const { metrics } = require('@opentelemetry/api');

const transport = pino.transport({
  target: 'pino-opentelemetry-transport'
});

const logger = pino(transport);

// Use the SDK's global meter instead of creating a separate MeterProvider
const meter = metrics.getMeter('demo-app', '1.0.0');

const slowRequestCounter = meter.createCounter('slow_requests_count', {
  description: 'Counts requests to the /slow endpoint',
});

const rootRequestCounter = meter.createCounter('root_requests_count', {
  description: 'Counts requests to the root (/) endpoint',
});

const app = express();

app.get('/', (req, res) => {
  rootRequestCounter.add(1);
  logger.info('Hit / route');
  res.send('Hello from the observable world!');
});

app.get('/slow', (req, res) => {
  slowRequestCounter.add(1);
  logger.warn('Hit /slow route — simulating slow response');
  setTimeout(() => {
    res.send('This was a slow request!');
  }, 2000);
});

app.get('/error', (req, res) => {
  logger.error({
    msg: 'An error occurred!',
    error: 'Simulated error',
    stack: new Error('Simulated error').stack
  });
  res.status(500).send('Something went wrong!');
});

app.listen(3000, () => {
  logger.info('App listening on port 3000');
});
