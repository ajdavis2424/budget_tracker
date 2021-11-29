var CACHE = "budget-site-cache";
const DATA_CACHE = "budget-site-data-cache";

// Listing out URLs for service worker to cache
var URLS_TO_CACHE = [
    "/",
	"/index.html",
	"/db.js",
	"/styles.css",
	"/manifest.json",
	"/index.js",
	"/icons/icon-192x192.png",
	"/icons/icon-512x512.png",
];

// install service worker
self.addEventListener("install", function (event) {
	// Perform install steps
	event.waitUntil(
		caches.open(CACHE).then(function (cache) {
			return cache.addAll(URLS_TO_CACHE);
		})
	);
});

self.addEventListener("fetch", function (event) {
	if (event.request.url.includes("/api/")) {
            console.log("[Service Worker] Fetch (data)", event.request.url);
		//  Use cache but update the entry with the latest contents from the server.
            event.respondWith(caches.open(DATA_CACHE).then(function (cache) {
                  // If the request is for API, try the network first, THENfall back to the offline page if unavailable
                  return fetch(event.request).then(function (response) {
                        // If this request works, repeat response
                        cache.put(event.request.url, response.clone());
                        // Returns the 1st response
                        return response;
                    }).catch(err => {
                        // Network request failed, try to get it from the cache.
                        return cache.match(event.request);
                      })
                  }).catch(err => console.log(err)));
                  // If the fetch request is not for the API, serve static assets using the cache.
		return;
                }
                event.respondWith(
                    fetch(event.request).catch(function () {
                          return caches.match(event.request).then(function (response) {
                                if (response) {
                                      return response;
                                } else if (event.request.headers.get("accept").includes("text/html")) {
                                      return caches.match("/");
                                }
                          }
        
              )
        })
        )
        });





