import { SubscriptionManager } from '../subscription/SubscriptionManager';

export class AdManager {
  private static instance: AdManager;
  private subscriptionManager: SubscriptionManager;
  private adSlot: string | null = null;

  private constructor() {
    this.subscriptionManager = SubscriptionManager.getInstance();
    this.initializeAds();
  }

  public static getInstance(): AdManager {
    if (!AdManager.instance) {
      AdManager.instance = new AdManager();
    }
    return AdManager.instance;
  }

  private initializeAds(): void {
    // Initialize Google AdSense
    (window.adsbygoogle = window.adsbygoogle || []).push({});
  }

  async showAd(userId: string, placement: string): Promise<void> {
    // Only show ads for free users
    if (this.subscriptionManager.isFeatureAvailable(userId, 'ad-free')) {
      return;
    }

    // Small, unobtrusive ad in bottom-left corner
    const adContainer = document.createElement('div');
    adContainer.style.cssText = `
      position: fixed;
      bottom: 20px;
      left: 20px;
      width: 300px;
      height: 250px;
      z-index: 1000;
      background: transparent;
    `;

    const adElement = document.createElement('ins');
    adElement.className = 'adsbygoogle';
    adElement.style.cssText = 'display:block';
    adElement.setAttribute('data-ad-client', 'ca-pub-XXXXXXXXXXXXXXXX');
    adElement.setAttribute('data-ad-slot', placement);
    adElement.setAttribute('data-ad-format', 'auto');

    adContainer.appendChild(adElement);
    document.body.appendChild(adContainer);

    (window.adsbygoogle = window.adsbygoogle || []).push({});
  }

  removeAds(): void {
    const ads = document.querySelectorAll('.adsbygoogle');
    ads.forEach(ad => ad.remove());
  }
}