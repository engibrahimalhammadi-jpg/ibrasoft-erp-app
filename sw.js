const CACHE_NAME = 'ibrasoft-erp-v2'; // تحديث رقم الإصدار لتنشيط الذاكرة
const MAIN_FILE = './IBraSoft_ERP.html'; // ⚠️ استبدل هذا باسم ملفك الفعلي تماماً إذا كان مختلفاً

const ASSETS_TO_CACHE = [
  './',
  MAIN_FILE,
  './manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('IbraSoft ERP: جاري حفظ الملفات الأساسية...');
        // حفظ الملفات بشكل منفصل لضمان عدم انهيار التطبيق لو فُقد أي ملف ثنائي
        return Promise.all(
          ASSETS_TO_CACHE.map(asset => {
            return cache.add(asset).catch(err => console.warn(`تنبيه: فشل حفظ الملف ${asset}`, err));
          })
        );
      })
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('IbraSoft ERP: تنظيف الكاش القديم');
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        return response || fetch(event.request);
      }).catch(() => {
        if (event.request.mode === 'navigate') {
          return caches.match(MAIN_FILE);
        }
      })
  );
});
