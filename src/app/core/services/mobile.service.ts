import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { App } from '@capacitor/app';
import { StatusBar, Style } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';
import { Network } from '@capacitor/network';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root'
})
export class MobileService {
  private isNative = Capacitor.isNativePlatform();

  constructor() {
    this.initializeMobileFeatures();
  }

  /**
   * Verifica si la aplicación está corriendo en una plataforma nativa
   */
  isNativePlatform(): boolean {
    return this.isNative;
  }

  /**
   * Verifica si la aplicación está corriendo en Android
   */
  isAndroid(): boolean {
    return Capacitor.getPlatform() === 'android';
  }

  /**
   * Verifica si la aplicación está corriendo en iOS
   */
  isIOS(): boolean {
    return Capacitor.getPlatform() === 'ios';
  }

  /**
   * Inicializa características específicas de móvil
   */
  private async initializeMobileFeatures(): Promise<void> {
    if (this.isNative) {
      try {
        // Configurar StatusBar
        await StatusBar.setStyle({ style: Style.Dark });
        await StatusBar.setBackgroundColor({ color: '#ffffff' });

        // Ocultar SplashScreen después de 2 segundos
        setTimeout(async () => {
          await SplashScreen.hide();
        }, 2000);

        // Escuchar cambios de conectividad
        Network.addListener('networkStatusChange', (status) => {
          console.log('Network status changed:', status);
        });

        // Escuchar eventos de la aplicación
        App.addListener('appStateChange', ({ isActive }) => {
          console.log('App state changed. Is active?', isActive);
        });

        App.addListener('appUrlOpen', (data) => {
          console.log('App opened with URL:', data);
        });

      } catch (error) {
        console.error('Error initializing mobile features:', error);
      }
    }
  }

  /**
   * Obtiene información de la aplicación
   */
  async getAppInfo() {
    if (this.isNative) {
      try {
        const info = await App.getInfo();
        return info;
      } catch (error) {
        console.error('Error getting app info:', error);
        return null;
      }
    }
    return null;
  }

  /**
   * Guarda datos en el almacenamiento nativo
   */
  async setStorage(key: string, value: any): Promise<void> {
    if (this.isNative) {
      try {
        await Preferences.set({
          key,
          value: JSON.stringify(value)
        });
      } catch (error) {
        console.error('Error saving to storage:', error);
      }
    } else {
      // Fallback para web
      localStorage.setItem(key, JSON.stringify(value));
    }
  }

  /**
   * Obtiene datos del almacenamiento nativo
   */
  async getStorage(key: string): Promise<any> {
    if (this.isNative) {
      try {
        const { value } = await Preferences.get({ key });
        return value ? JSON.parse(value) : null;
      } catch (error) {
        console.error('Error getting from storage:', error);
        return null;
      }
    } else {
      // Fallback para web
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    }
  }

  /**
   * Elimina datos del almacenamiento nativo
   */
  async removeStorage(key: string): Promise<void> {
    if (this.isNative) {
      try {
        await Preferences.remove({ key });
      } catch (error) {
        console.error('Error removing from storage:', error);
      }
    } else {
      // Fallback para web
      localStorage.removeItem(key);
    }
  }

  /**
   * Obtiene el estado de la red
   */
  async getNetworkStatus() {
    if (this.isNative) {
      try {
        const status = await Network.getStatus();
        return status;
      } catch (error) {
        console.error('Error getting network status:', error);
        return null;
      }
    }
    return null;
  }

  /**
   * Sale de la aplicación
   */
  async exitApp(): Promise<void> {
    if (this.isNative) {
      try {
        await App.exitApp();
      } catch (error) {
        console.error('Error exiting app:', error);
      }
    }
  }
} 