"use client";

import { useEffect, useState } from "react";
import { MessageSquare, Phone } from "lucide-react";

export function MobileContactBar({ phone, phoneE164, projectName }: { phone: string; phoneE164: string; projectName: string }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const form = document.getElementById("inquire");
      const formTop = form?.getBoundingClientRect().top ?? Infinity;
      setVisible(window.scrollY > 300 && formTop > window.innerHeight * 0.6);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const sms = `sms:${phoneE164}?&body=${encodeURIComponent(`Hi, I'm interested in ${projectName}.`)}`;

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-sand-200 bg-white/95 px-3 pt-2.5 pb-[calc(0.625rem+env(safe-area-inset-bottom))] shadow-[0_-8px_30px_rgba(12,31,53,0.12)] backdrop-blur transition-transform duration-500 ease-luxe lg:hidden ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="grid grid-cols-[1fr_1fr_1.6fr] gap-2">
        <a
          href={`tel:${phoneE164}`}
          aria-label={`Call ${phone}`}
          className="flex h-12 items-center justify-center gap-1.5 rounded-sm border border-navy-800 text-xs font-semibold tracking-[0.14em] text-navy-900 uppercase"
        >
          <Phone className="size-4" strokeWidth={1.5} /> Call
        </a>
        <a
          href={sms}
          aria-label={`Text ${phone}`}
          className="flex h-12 items-center justify-center gap-1.5 rounded-sm border border-navy-800 text-xs font-semibold tracking-[0.14em] text-navy-900 uppercase"
        >
          <MessageSquare className="size-4" strokeWidth={1.5} /> Text
        </a>
        <a href="#inquire" className="btn-gold h-12 !px-3">
          Request Info
        </a>
      </div>
    </div>
  );
}
