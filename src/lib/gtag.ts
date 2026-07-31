export const GOOGLE_ADS_CONVERSION_SEND_TO = "AW-18286115803/nx8cCN3h8dkcENv3v49E";

export const trackGoogleAdsConversion = (sendTo: string = GOOGLE_ADS_CONVERSION_SEND_TO) => {
  if (typeof window !== "undefined" && typeof (window as any).gtag === "function") {
    (window as any).gtag("event", "conversion", {
      send_to: sendTo,
    });
  }
};
