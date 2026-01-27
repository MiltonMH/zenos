import { useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';

export function useNativeApp() {
  useEffect(() => {
    const initNativeApp = async () => {
      if (Capacitor.isNativePlatform()) {
        // Configure status bar for native platforms
        try {
          await StatusBar.setStyle({ style: Style.Dark });
          
          if (Capacitor.getPlatform() === 'android') {
            await StatusBar.setBackgroundColor({ color: '#a8d4cf' });
          }
        } catch (error) {
          console.log('StatusBar not available:', error);
        }

        // Hide splash screen after app is ready
        try {
          await SplashScreen.hide();
        } catch (error) {
          console.log('SplashScreen not available:', error);
        }
      }
    };

    initNativeApp();
  }, []);

  return {
    isNative: Capacitor.isNativePlatform(),
    platform: Capacitor.getPlatform()
  };
}
