const BACKEND_URL = 'https://mindsphere-backend-9c0u.onrender.com';

async function warmup() {
  try {
    const res = await fetch(`${BACKEND_URL}/health`);
    console.log(`[warmup] ${new Date().toISOString()} — Backend status: ${res.status}`);
  } catch (err) {
    console.error(`[warmup] ${new Date().toISOString()} — Warmup failed:`, err.message);
    process.exitCode = 1;
  }
}

warmup();
