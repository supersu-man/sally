import { provideHttpClient, withInterceptors } from "@angular/common/http";
import { ApplicationConfig } from "@angular/core";
import { provideRouter } from "@angular/router";
import { ConfirmationService, MessageService } from "primeng/api";
import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import Aura from '@primeng/themes/aura';
import { providePrimeNG } from "primeng/config";
import { definePreset } from "@primeng/themes";
import { refreshTokenInterceptor, sendTokenInterceptor, saveTokenInterceptor } from "./service/interceptor.service";

const MyPreset = definePreset(Aura, {
  semantic: {
      primary: {
          50: '{blue.50}',
          100: '{blue.100}',
          200: '{blue.200}',
          300: '{blue.300}',
          400: '{blue.400}',
          500: '{blue.500}',
          600: '{blue.600}',
          700: '{blue.700}',
          800: '{blue.800}',
          900: '{blue.900}',
          950: '{blue.950}'
      }
  }
});

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([sendTokenInterceptor, saveTokenInterceptor, refreshTokenInterceptor])),
    provideAnimations(), 
    providePrimeNG({
      theme: { preset: MyPreset , options: { darkModeSelector: false }} 
    }),
    MessageService,
    ConfirmationService
  ]
};
