"use client";
import { FormEvent, useEffect, useRef, useState } from "react";

const TELEGRAM_URL = "https://telegram.me/Olga_Venher_bot?start=ZGw6MzM3Njg4";

export default function VideoGate() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showFloating, setShowFloating] = useState(false);
  const deepLinkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", close);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", close); document.body.style.overflow = ""; };
  }, [open]);

  useEffect(() => {
    const check = () => {
      const hero = document.getElementById("hero");
      setShowFloating(Boolean(hero && hero.getBoundingClientRect().bottom < 0));
    };
    check(); window.addEventListener("scroll", check, { passive: true });
    return () => window.removeEventListener("scroll", check);
  }, []);

  useEffect(() => {
    let timer = 0;
    const init = () => {
      const smartWindow = window as typeof window & { ssDeepLink?: (className: string, domain: string, passQuery: boolean, context: object) => void; __ssdlReady?: boolean };
      if (smartWindow.__ssdlReady) {
        document.documentElement.dataset.ssdlReady = "true";
        return;
      }
      if (typeof smartWindow.ssDeepLink === "function") {
        smartWindow.ssDeepLink("deep-link", "explainer", true, {});
        smartWindow.__ssdlReady = true;
        document.documentElement.dataset.ssdlReady = "true";
        return;
      }
      timer = window.setTimeout(init, 100);
    };
    init();
    return () => window.clearTimeout(timer);
  }, []);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setLoading(true); setError("");
    try {
      const response = await fetch("/api/leads", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) });
      if (!response.ok) throw new Error("Не вдалося зберегти email");
      deepLinkRef.current?.click();
    } catch {
      setError("Перевір email і спробуй ще раз.");
      setLoading(false);
    }
  }

  return <section className="videoSection wrap" id="video">
    <div className="videoLabel"><span>Безкоштовне відео</span><b>30 хвилин практики</b></div>
    <button className="video" onClick={() => setOpen(true)} aria-label="Отримати безкоштовне відео">
      <span className="videoTag">VENHER · EDU</span><span className="play">▶</span>
    </button>
    <a ref={deepLinkRef} className="deep-link hiddenDeepLink" href={TELEGRAM_URL} aria-hidden="true" tabIndex={-1}>Telegram</a>
    <button className={`floatingCta ${showFloating ? "visible" : ""}`} onClick={() => setOpen(true)}>Отримати відео безкоштовно <span>↗</span></button>
    {open && <div className="modalBackdrop" onMouseDown={(e) => e.target === e.currentTarget && setOpen(false)}>
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <button className="modalClose" onClick={() => setOpen(false)} aria-label="Закрити">×</button>
        <span className="modalTag">VENHER · EDU</span>
        <h2 id="modal-title">Отримай відео безкоштовно</h2>
        <p>Залиши email — і переходь у Telegram, щоб одразу отримати доступ.</p>
        <form onSubmit={submit}>
          <label htmlFor="lead-email">Твій email</label>
          <input id="lead-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@email.com" required autoFocus />
          {error && <div className="formError">{error}</div>}
          <button className="button" type="submit" disabled={loading}>{loading ? "Зберігаємо…" : "Отримати відео безкоштовно"} <span>↗</span></button>
        </form>
        <small>Натискаючи кнопку, ти погоджуєшся з обробкою email для отримання матеріалу.</small>
      </div>
    </div>}
  </section>;
}
