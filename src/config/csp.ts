const DEV_CSP_POLICY = {
  'default-src': ["*", "'unsafe-inline'", "'unsafe-eval'"],
  'script-src': ["*", "'unsafe-inline'", "'unsafe-eval'"],
  'style-src': ["*", "'unsafe-inline'"],
  'img-src': [
    "'self'", 
    'data:', 
    'blob:', 
    'https://gcqowih89q0rcl2g.public.blob.vercel-storage.com/'
  ],
  'font-src': ["*"],
  'connect-src': ["*"],
  'worker-src': ["*", 'blob:'],
  'frame-src': ["*"],
  'object-src': ["*"]
};

const PROD_CSP_POLICY = {
  // Production CSP will be stricter
  'default-src': ["'self'", "https://*.onrender.com"],
  'script-src': ["'self'", "'unsafe-inline'"],
  'style-src': ["'self'", "'unsafe-inline'"],
  'connect-src': [
    "'self'", 
    "https://*.onrender.com",
    "https://fibserver.onrender.com"
  ],
  'img-src': [
    "'self'", 
    'data:', 
    'blob:', 
    'https://gcqowih89q0rcl2g.public.blob.vercel-storage.com/'
  ],
  'frame-src': ["'none'"],
  'object-src': ["'none'"]
};

export const getCSPString = (isDev: boolean) => {
  const policy = isDev ? DEV_CSP_POLICY : PROD_CSP_POLICY;
  return Object.entries(policy)
    .map(([key, values]) => `${key} ${values.join(' ')}`)
    .join('; ');
};

export const cspRules = {
  directives: {
    // existing directives...
    "img-src": ["'self'", "data:", "blob:"],
    "default-src": ["'self'", "mailto:"],
  }
}; 