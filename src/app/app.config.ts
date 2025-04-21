import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

//comment for testing the right github connection

/**
 * Configuration for the Angular application, including various providers for routing, Firebase services, and client-side hydration.
 *
 * This configuration is used to initialize Angular services, set up routing, and integrate Firebase services for authentication and Firestore.
 * 
 * @constant {ApplicationConfig} appConfig
 */
export const appConfig: ApplicationConfig = {
  providers: [
    /**
     * Provides Zone.js change detection, which ensures automatic change detection in Angular when asynchronous events occur.
     * 
     * @param {object} options - Configuration options for zone change detection.
     * @param {boolean} options.eventCoalescing - Flag to enable or disable event coalescing.
     */
    provideZoneChangeDetection({ eventCoalescing: true }),

    /**
     * Provides routing configuration for the Angular application.
     * 
     * @see {@link routes} for the list of routes defined in the application.
     */
    provideRouter(routes),

    /**
     * Provides client-side hydration for better performance during initial page load.
     * It also enables event replaying for smooth user interaction on the client side.
     * 
     * @see {@link withEventReplay} for more details on how event replay works.
     */
    provideClientHydration(withEventReplay()),

    /**
     * Initializes Firebase with the specified configuration and provides Firebase services.
     * 
     * @param {Function} initializeApp - Function to initialize Firebase app with the provided configuration.
     * @param {object} config - Firebase configuration object.
     * @param {string} config.projectId - Firebase project ID.
     * @param {string} config.appId - Firebase app ID.
     * @param {string} config.storageBucket - Firebase storage bucket.
     * @param {string} config.apiKey - Firebase API key.
     * @param {string} config.authDomain - Firebase auth domain.
     * @param {string} config.messagingSenderId - Firebase messaging sender ID.
     */
    provideFirebaseApp(() => initializeApp({
      //here comes the new apiKey and other data
      
    })),

    /**
     * Provides Firebase Authentication service for user authentication.
     * 
     * @see {@link getAuth} for Firebase Authentication methods.
     */
    provideAuth(() => getAuth()),

    /**
     * Provides Firebase Firestore service to interact with the Firestore database.
     * 
     * @see {@link getFirestore} for Firebase Firestore methods.
     */
    provideFirestore(() => getFirestore()), provideFirebaseApp(() => initializeApp({   apiKey: "AIzaSyDoF5QmVmCD4wdFmefpvF8tPU8myeK2XFk",
      //here comes the new ApiKey and other data
      })), provideAuth(() => getAuth()), provideFirestore(() => getFirestore()), provideFirebaseApp(() => initializeApp({ projectId: "join-64d68", appId: "1:1011040682800:web:caaf1a77ff1027816d7ef5", storageBucket: "join-64d68.firebasestorage.app", apiKey: "AIzaSyDoF5QmVmCD4wdFmefpvF8tPU8myeK2XFk", authDomain: "join-64d68.firebaseapp.com", messagingSenderId: "1011040682800" })), provideAuth(() => getAuth()), provideFirestore(() => getFirestore())
  ]
};

//test commit
