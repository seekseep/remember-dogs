import { useEffect, useRef } from "react";

const CLIENT_ID = import.meta.env.VITE_ADSENSE_CLIENT_ID as string;
const SLOT_ID = import.meta.env.VITE_ADSENSE_SLOT_ID as string;

export function AdSense() {
  const adRef = useRef<HTMLModElement>(null);
  const pushed = useRef(false);

  useEffect(() => {
    if (pushed.current) return;
    try {
      const adsbygoogle = (window as unknown as Record<string, unknown>).adsbygoogle as unknown[];
      if (adsbygoogle && adRef.current) {
        adsbygoogle.push({});
        pushed.current = true;
      }
    } catch {
      // AdSense not loaded
    }
  }, []);

  return (
    <ins
      ref={adRef}
      className="adsbygoogle"
      style={{ display: "block" }}
      data-ad-client={CLIENT_ID}
      data-ad-slot={SLOT_ID}
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  );
}
