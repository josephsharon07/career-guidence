import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.career.guidence',
  appName: 'Empowering Young Minds',
  webDir: 'out',

  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      androidScaleType: 'CENTER_CROP',
      showSpinner: false,
      backgroundColor: '#ffffff',
      splashFullScreen: true,
      splashImmersive: true,
      splashShowOnlyFirstTime: false,
      splashScreen: 'splash',
    },
  },
};

export default config;
