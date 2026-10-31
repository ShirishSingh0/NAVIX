import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.navix.companion',
  appName: 'NAVIX Moto',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
};

export default config;
