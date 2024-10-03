export const trackEvent = (eventName: string, eventData?: Record<string, any>) => {
  if (typeof window !== 'undefined' && (window as any).umami) {
    (window as any).umami.track(eventName, eventData);
  }
};