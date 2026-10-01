// ============================================================
// Joule*Bert — CAP Static File Server
// Serves the React build output (app/dist) as the root.
// No CDS entities — this is purely a static file host.
// ============================================================

const cds = require('@sap/cds');
const express = require('express');
const path = require('path');

const app = express();

// Serve the React build output as static files
const staticDir = path.join(__dirname, 'app', 'dist');
app.use(express.static(staticDir));

// SPA fallback — all unknown routes return index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(staticDir, 'index.html'));
});

const PORT = process.env.PORT || 4004;
app.listen(PORT, () => {
  console.log(`Joule*Bert is running at http://localhost:${PORT}`);
});
