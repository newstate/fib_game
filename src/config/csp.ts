const DEV_CSP_POLICY = {
  'default-src': ["'self'"],
  'script-src': [
    "'self'",
    "'unsafe-eval'",
    "'unsafe-inline'",
    "'wasm-unsafe-eval'",
    // Vite 6 specific requirements
    "http://localhost:*",
    "ws://localhost:*",
    // Add hash for specific inline scripts
    "'sha256-*'"
  ],
  'style-src': ["'self'", "'unsafe-inline'"],
  'img-src': ["'self'", 'data:', 'blob:'],
  'font-src': ["'self'"],
  'connect-src': [
    "'self'",
    "http://localhost:*",
    "ws://localhost:*"
  ],
  'worker-src': ["'self'", 'blob:'],
  // Remove restrictive policies during development
  'frame-src': ["'self'"],
  'object-src': ["'self'"]
};

const PROD_CSP_POLICY = {
  // Production CSP will be stricter
  'default-src': ["'self'"],
  'script-src': ["'self'"],
  'style-src': ["'self'", "'unsafe-inline'"],
  'connect-src': ["'self'", 'http://localhost:5001'],
  'frame-src': ["'none'"],
  'object-src': ["'none'"]
};

export const getCSPString = (isDev: boolean) => {
  const policy = isDev ? DEV_CSP_POLICY : PROD_CSP_POLICY;
  return Object.entries(policy)
    .map(([key, values]) => `${key} ${values.join(' ')}`)
    .join('; ');
}; 