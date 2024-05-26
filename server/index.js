const express = require('express');
const app = express();
const path = require('path');

// Serve up production assets
app.use(express.static('../client/src'));

// Serve up the index.html if the route is not recognized
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/src', 'index.html'));
});

// If not in production, use port 8080 or the environment port
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
