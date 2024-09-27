
const useLocalhost = process.env.PROXY_USE_LOCALHOST === 'true';

module.exports = {
  "/api/planmonitor-wonen": {
    "target": useLocalhost ? "http://127.0.0.1:8081" : "https://planmonitor-wonen.tailormap.nl",
    "secure": false,
    "logLevel": "info",
    "headers": useLocalhost ? {} : {
      // Send HTTP Host request header for name-based virtual host
      "Host": "planmonitor-wonen.tailormap.nl"
    },
    onProxyRes(proxyRes, req) {
      const host = req.headers.host;
      if(proxyRes.headers['location']) {
        // Rewrite the Location response header for redirects on login/logout (like the Apache ProxyPassReverse directive)
        const hostDestination = 'http://localhost:4200';
        proxyRes.headers['location'] = proxyRes.headers['location'].replace('https://planmonitor-wonen.tailormap.nl', hostDestination);
      }
    },
  },
  "/api": {
    "target": useLocalhost ? "http://127.0.0.1:8080" : "https://planmonitor-wonen.tailormap.nl",
    "secure": false,
    "logLevel": "info",
    "headers": useLocalhost ? {} : {
      // Send HTTP Host request header for name-based virtual host
      "Host": "planmonitor-wonen.tailormap.nl"
    },
    onProxyRes(proxyRes, req) {
      const defaultLocation = 'http://localhost:4200';
      if (proxyRes.headers['location']) {
        // Rewrite the Location response header for redirects on login/logout (like the Apache ProxyPassReverse directive)
        proxyRes.headers['location'] = proxyRes.headers['location'].replace('https://planmonitor-wonen.tailormap.nl', defaultLocation);
      }
      const origin = req.headers.origin || '';
      if (origin.indexOf(defaultLocation) === -1 && origin.indexOf('localhost') !== -1) {
        proxyRes.headers["Access-Control-Allow-Origin"] = req.headers.origin;
        proxyRes.headers["Access-Control-Allow-Credentials"] = "true";
      }
    },
  },
};
