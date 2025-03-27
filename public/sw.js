const CACHE_NAME = 'finance-app-v1'
const RUNTIME_CACHE = 'runtime-cache'

// Resources to preload
const urlsToCache = [
	'/',
	'/manifest.json',
	'/icons/icon-192x192.png',
	'/icons/icon-512x512.png',
	'/favicon.ico',
]

// CSS and JS files to preload
const assetsToCache = [
	'/_next/static/css/app.css',
	'/_next/static/chunks/main.js',
	'/_next/static/chunks/webpack.js',
	'/_next/static/chunks/pages/_app.js',
	'/_next/static/chunks/pages/index.js',
]

self.addEventListener('install', (event) => {
	event.waitUntil(
		Promise.all([
			caches.open(CACHE_NAME).then((cache) => {
				return cache.addAll(urlsToCache)
			}),
			caches.open(RUNTIME_CACHE).then((cache) => {
				return cache.addAll(assetsToCache)
			}),
		])
	)
	self.skipWaiting()
})

self.addEventListener('activate', (event) => {
	event.waitUntil(
		caches.keys().then((cacheNames) => {
			return Promise.all(
				cacheNames.map((cacheName) => {
					if (cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE) {
						return caches.delete(cacheName)
					}
				})
			)
		})
	)
	self.clients.claim()
})

self.addEventListener('fetch', (event) => {
	// Skip cross-origin requests
	if (!event.request.url.startsWith(self.location.origin)) {
		return
	}

	event.respondWith(
		caches.match(event.request).then((response) => {
			if (response) {
				return response
			}

			return fetch(event.request).then((response) => {
				// Don't cache responses that aren't successful or aren't GET requests
				if (
					!response ||
					response.status !== 200 ||
					response.type !== 'basic' ||
					event.request.method !== 'GET'
				) {
					return response
				}

				const responseToCache = response.clone()
				caches.open(RUNTIME_CACHE).then((cache) => {
					cache.put(event.request, responseToCache)
				})

				return response
			})
		})
	)
})
