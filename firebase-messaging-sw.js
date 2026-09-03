// firebase-messaging-sw.js
// QUAN TRỌNG: file này phải được host ở ROOT domain (vd: https://your-app.com/firebase-messaging-sw.js)
// KHÔNG được đặt trong thư mục con, nếu không Firebase sẽ không nhận được push khi tab đã đóng.

importScripts('https://www.gstatic.com/firebasejs/10.13.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.13.0/firebase-messaging-compat.js');

// TODO: điền đúng config Firebase Project của bạn (giống hệt config trong file HTML chính)
firebase.initializeApp({
    apiKey: "AIzaSyBOYZOaqRja62eISje9n-XB3OytNiL3Q1M",
    authDomain: "mahjong-push-notif.firebaseapp.com",
    projectId: "mahjong-push-notif",
    storageBucket: "mahjong-push-notif.firebasestorage.app",
    messagingSenderId: "614740575166",
    appId: "1:614740575166:web:f53e9af5824a27873cefef",
    measurementId: "G-TXQN2M2JBY"
});

const messaging = firebase.messaging();

// Xử lý thông báo khi trình duyệt/tab đã đóng (background)
messaging.onBackgroundMessage((payload) => {
    const title = payload.notification?.title || '🀄 Hội Mạt Chược';
    const options = {
        body: payload.notification?.body || 'Có kèo mới vừa được tạo!',
        icon: '/mahjong/favicon.png',       // TODO: đổi thành icon thật của app (192x192px)
        badge: '/mahjong/favicon.png',    // TODO: icon nhỏ hiện trên thanh thông báo (Android)
        data: payload.data || {},
        tag: 'mahjong-new-game'      // gộp nhiều thông báo cùng loại thành 1, tránh spam
    };
    self.registration.showNotification(title, options);
});

// Khi người dùng bấm vào thông báo -> mở app và focus đúng kèo (nếu có gameId)
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    const gameId = event.notification.data?.gameId;
    const targetUrl = gameId ? `/?gameId=${gameId}` : '/';

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
            for (const client of clientList) {
                if ('focus' in client) {
                    client.navigate(targetUrl);
                    return client.focus();
                }
            }
            if (clients.openWindow) return clients.openWindow(targetUrl);
        })
    );
});