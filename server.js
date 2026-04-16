const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const N8N_URL = process.env.N8N_URL || 'http://localhost:5678';

app.use(express.json());

// Proxy /api/* → n8n webhooks
app.use('/api', createProxyMiddleware({
  target: N8N_URL,
  changeOrigin: true,
  pathRewrite: { '^/api': '/webhook' },
}));

// Serve index.html from root
app.use(express.static(__dirname));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`SupportOps running on port ${PORT}`);
  console.log(`Proxying /api/* → ${N8N_URL}/webhook/*`);
});
