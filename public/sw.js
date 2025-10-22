// PaySmile Service Worker for PWA
const CACHE_NAME = "paysmile-v2";
const DYNAMIC_CACHE = "paysmile-dynamic-v2";

// Install event - skip caching in development
self.addEventListener("install", (event) => {
  console.log("[Service Worker] Installing...");
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  console.log("[Service Worker] Activating...");
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== DYNAMIC_CACHE) {
            console.log("[Service Worker] Deleting old cache:", cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - minimal interference in development
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== "GET") {
    return;
  }

  // Skip Chrome extensions and non-http requests
  if (!request.url.startsWith("http")) {
    return;
  }

  // Skip Next.js internal requests (HMR, dev server, etc.)
  if (
    url.pathname.startsWith("/_next/webpack-hmr") ||
    url.pathname.startsWith("/__nextjs_original-stack-frames") ||
    url.pathname.includes("hot-update") ||
    url.hostname === "localhost" ||
    url.hostname === "127.0.0.1"
  ) {
    return; // Let Next.js dev server handle these
  }

  // For API routes, always fetch from network (don't cache in dev)
  if (url.pathname.startsWith("/api/")) {
    return; // Don't intercept API calls
  }

  // For all other requests, just pass through to network
  // Only cache in production builds
  return;
});

// Handle messages from the client
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
