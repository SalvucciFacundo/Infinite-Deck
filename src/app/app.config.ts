import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { getApp } from 'firebase/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { initializeFirestore, persistentLocalCache } from 'firebase/firestore';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideStorage, getStorage } from '@angular/fire/storage';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { environment } from '../environments/environment';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore((injector) => {
      const platformId = injector.get(PLATFORM_ID);
      if (isPlatformBrowser(platformId)) {
        try {
          return initializeFirestore(getApp(), {
            localCache: persistentLocalCache({}),
          });
        } catch (e) {
          return getFirestore();
        }
      }
      return getFirestore();
    }),
    provideAuth(() => getAuth()),
    provideStorage(() => getStorage()),
  ],
};
