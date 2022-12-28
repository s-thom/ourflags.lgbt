export function trackEvent(type: string, name: string, data: {}) {
  if (typeof umami === "undefined") {
    // eslint-disable-next-line no-console
    console.debug("analytics event", { type, name, data });
    return;
  }

  umami.trackEvent(name, { type, ...data });
}
