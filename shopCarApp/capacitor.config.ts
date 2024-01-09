import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'Toyousado',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  },
  plugins: {
  
    LocalNotifications: {
      smallIcon: 'ic_stat_icon_config_sample',
      iconColor: '#CE0B24',
      sound: 'beep.wav',
    },
    //   PrivacyScreen: {
  //     enable: true,
  //     imageName: 'SplashScreen',
  //   }
  }
};

export default config;
