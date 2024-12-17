export interface AnalyticsEvent {
  category: string;
  action: string;
  label?: string;
  value?: number;
  timestamp: number;
}

class Analytics {
  private static instance: Analytics;
  private events: AnalyticsEvent[] = [];
  private readonly MAX_EVENTS = 1000;

  private constructor() {
    this.loadEvents();
    window.addEventListener('beforeunload', () => this.saveEvents());
  }

  public static getInstance(): Analytics {
    if (!Analytics.instance) {
      Analytics.instance = new Analytics();
    }
    return Analytics.instance;
  }

  public trackEvent(event: Omit<AnalyticsEvent, 'timestamp'>): void {
    const fullEvent: AnalyticsEvent = {
      ...event,
      timestamp: Date.now()
    };

    this.events.push(fullEvent);
    if (this.events.length > this.MAX_EVENTS) {
      this.events = this.events.slice(-this.MAX_EVENTS);
    }

    this.saveEvents();
  }

  public getEvents(
    category?: string,
    startTime?: number,
    endTime?: number
  ): AnalyticsEvent[] {
    let filteredEvents = this.events;

    if (category) {
      filteredEvents = filteredEvents.filter(e => e.category === category);
    }

    if (startTime) {
      filteredEvents = filteredEvents.filter(e => e.timestamp >= startTime);
    }

    if (endTime) {
      filteredEvents = filteredEvents.filter(e => e.timestamp <= endTime);
    }

    return filteredEvents;
  }

  private loadEvents(): void {
    try {
      const stored = localStorage.getItem('analytics_events');
      if (stored) {
        this.events = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load analytics events:', error);
    }
  }

  private saveEvents(): void {
    try {
      localStorage.setItem('analytics_events', JSON.stringify(this.events));
    } catch (error) {
      console.error('Failed to save analytics events:', error);
    }
  }
}

export const analytics = Analytics.getInstance();