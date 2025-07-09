// index.js
// IMPORTANT: This line MUST be the first import/require in your application!
require('./instrumentation'); // Load OpenTelemetry instrumentation first

const express = require('express');
const app = express();
const port = 4000;

// Simulate an asynchronous operation
function simulateDBQuery() {
  return new Promise(resolve => setTimeout(resolve, Math.random() * 100 + 50));
}

app.get('/', async (req, res) => {
  console.log('Received request for /');
  await simulateDBQuery(); // Simulate a database call
  res.send('Hello from my Node.js app!');
});

app.get('/users/:id', async (req, res) => {
  const userId = req.params.id;
  console.log(`Fetching user with ID: ${userId}`);
  // Simulate another async operation, potentially with an error
  try {
    await simulateDBQuery();
    if (Math.random() < 0.2) { // 20% chance of error
      throw new Error('Failed to fetch user data');
    }
    res.json({ id: userId, name: `User ${userId}`, email: `user${userId}@example.com` });
  } catch (error) {
    console.error(`Error fetching user ${userId}: ${error.message}`);
    res.status(500).send(`Error fetching user: ${error.message}`);
  }
});

app.listen(port, () => {
  console.log(`Node.js app listening at http://localhost:${port}`);
});