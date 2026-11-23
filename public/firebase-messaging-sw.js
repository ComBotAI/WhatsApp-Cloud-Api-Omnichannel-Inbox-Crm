/* Firebase Messaging service worker: shows push notifications while the web app
 * is closed or in a background tab. Clicks open webpush.fcmOptions.link, which
 * the CPaaS sets. Config mirrors src/config/firebase.ts; keep the SDK version in
 * step with the `firebase` package. */
importScripts('https://www.gstatic.com/firebasejs/13.1.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/13.1.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: 'AIzaSyCRmM3JoEoPZrxhSDQgvkb-l_behuN5BTc',
  authDomain: 'team-inbox-cf6af.firebaseapp.com',
  projectId: 'team-inbox-cf6af',
  storageBucket: 'team-inbox-cf6af.firebasestorage.app',
  messagingSenderId: '282238246056',
  appId: '1:282238246056:web:83e69a3c956268cca3369d',
});

firebase.messaging();
