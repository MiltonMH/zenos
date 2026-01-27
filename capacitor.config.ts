import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.7d197faec69247439b0d349aff34651e',
  appName: 'ZenOS',
  webDir: 'dist',
  server: {
    url: 'https://7d197fae-c692-4743-9b0d-349aff34651e.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  ios: {
    contentInset: 'automatic',
    preferredContentMode: 'mobile',
    backgroundColor: '#a8d4cf'
  },
  android: {
    backgroundColor: '#a8d4cf'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: '#a8d4cf',
      showSpinner: false,
      androidScaleType: 'CENTER_CROP',
      splashFullScreen: true,
      splashImmersive: true
    },
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#a8d4cf'
    }
  }
};

export default config;
