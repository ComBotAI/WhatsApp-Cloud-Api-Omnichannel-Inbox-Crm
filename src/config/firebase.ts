/**
 * Firebase web app config. These are public identifiers (the same ones shipped
 * in google-services.json / GoogleService-Info.plist), not secrets. Keep in
 * sync with public/firebase-messaging-sw.js, which can't import this file.
 */
export const firebaseWebConfig = {
  apiKey: 'AIzaSyCRmM3JoEoPZrxhSDQgvkb-l_behuN5BTc',
  authDomain: 'team-inbox-cf6af.firebaseapp.com',
  projectId: 'team-inbox-cf6af',
  storageBucket: 'team-inbox-cf6af.firebasestorage.app',
  messagingSenderId: '282238246056',
  appId: '1:282238246056:web:83e69a3c956268cca3369d',
} as const;
