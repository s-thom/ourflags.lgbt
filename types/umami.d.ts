declare const umami: Umami.umami | undefined;

// Based on https://umami.is/docs/tracker-functions
declare namespace Umami {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  interface umami {
    (eventValue: string): void;
    trackEvent(
      eventName: string,
      eventData?: unknown,
      url?: string,
      websiteId?: string
    ): void;
    trackView(url: string, referrer?: string, websiteId?: string): void;
  }
}
