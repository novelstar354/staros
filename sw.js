const CACHE="webide-v1";

self.addEventListener("install",e=>{

    e.waitUntil(
        caches.open(CACHE)
    );
});

self.addEventListener("fetch",e=>{

    e.respondWith(

        caches.match(
            e.request
        ).then(res=>{

            return (
                res ||
                fetch(e.request)
            );
        })
    );
});