import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.app', // Reemplaza con tu ID de aplicación
  appName: 'Simple Inventario',
  webDir: 'www',
  // bundledWebRuntime: false,
  plugins: {
    AdMob: {
      appId: 'ca-app-pub-6814093303248086~3115272985', // Reemplaza con tu App ID de AdMob
    },
  },
};

export default config;