declare global {
  interface Window {
    dataLayer: any[];
  }
}

export const initGoogleAnalytics = (): void => {
  if (process.env.NODE_ENV === 'production') {
    // Tạo thẻ script và thêm Google Analytics vào head
    const gtagScript = document.createElement('script');
    gtagScript.async = true;
    gtagScript.src = 'https://www.googletagmanager.com/gtag/js?id=G-BEFGVCT4S7';
    document.head.appendChild(gtagScript);

    // Thiết lập Google Analytics
    window.dataLayer = window.dataLayer || [];
    const gtag = (...args: any[]): void => {
      window.dataLayer.push(args);
    };

    gtag('js', new Date());
    gtag('config', 'G-BEFGVCT4S7');
  }
};
