// لافتة تثبيت التطبيق — beforeinstallprompt، تُخفى بعد الاختيار أو للجلسة.
import { useEffect, useState } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: string }>;
}

export function InstallBanner() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onPrompt = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
      if (!sessionStorage.getItem('irth.ix')) setOpen(true);
    };
    const onInstalled = () => setOpen(false);
    window.addEventListener('beforeinstallprompt', onPrompt);
    window.addEventListener('appinstalled', onInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  if (!open) return null;
  return (
    <div className="inst">
      <img src="/irth/icons/icon-192.png" alt="" />
      <div className="it">
        <b>ثبّت إرث على جوالك</b>
        <small>يفتح مثل التطبيق من أيقونة على الشاشة</small>
      </div>
      <button
        className="go"
        onClick={async () => {
          setOpen(false);
          if (deferred) {
            await deferred.prompt();
            await deferred.userChoice;
            setDeferred(null);
          }
        }}
      >
        تثبيت
      </button>
      <button
        className="x"
        aria-label="إغلاق"
        onClick={() => {
          setOpen(false);
          sessionStorage.setItem('irth.ix', '1');
        }}
      >
        ×
      </button>
    </div>
  );
}
