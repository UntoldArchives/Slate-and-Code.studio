"use client";

import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { AnimatePresence, motion } from "motion/react";
import { cubic, EASE_HOUSE, EASE_OUT } from "@/lib/anim";
import { LINKS } from "@/lib/links";
import { getLenis } from "@/lib/lenis";
import { CONTACT_EVENT } from "@/lib/contact";

/*
  The contact form, in the house dress: a solid panel on a hairline 8% rule,
  Thunder verdict up top, micro labels over underline fields, and the same
  white-wipe accent button as the CTA strip.

  The site is static, so submitting composes the message into the visitor's
  own mail app via mailto: — nothing to host, nothing to leak, and the
  address is printed underneath for anyone whose device has no mail handler.
*/

const FIELD =
  "w-full rounded-none border-0 border-b border-[var(--rule)] bg-transparent py-[0.7em] text-[length:var(--fs-body)] text-[var(--fg)] caret-accent outline-none transition-colors duration-300 placeholder:text-[var(--fg-28)] focus:border-accent";

const LABEL = "micro mb-[0.4em] block text-[var(--fg-70)]";

export default function ContactModal() {
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const onOpen = () => {
      lastFocus.current = document.activeElement as HTMLElement | null;
      setSent(false);
      setOpen(true);
    };
    window.addEventListener(CONTACT_EVENT, onOpen);
    return () => window.removeEventListener(CONTACT_EVENT, onOpen);
  }, []);

  /* while open: page scroll held still, Escape closes, focus returns after */
  useEffect(() => {
    if (!open) return;
    getLenis()?.stop();
    document.documentElement.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
      getLenis()?.start();
      lastFocus.current?.focus();
    };
  }, [open]);

  /* small focus trap: Tab cycles inside the panel instead of escaping it */
  const trapTab = (e: ReactKeyboardEvent) => {
    if (e.key !== "Tab" || !panelRef.current) return;
    const nodes = Array.from(
      panelRef.current.querySelectorAll<HTMLElement>(
        "a[href], button, input, textarea"
      )
    ).filter((n) => !n.hasAttribute("disabled"));
    if (!nodes.length) return;
    const first = nodes[0];
    const last = nodes[nodes.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      last.focus();
      e.preventDefault();
    } else if (!e.shiftKey && document.activeElement === last) {
      first.focus();
      e.preventDefault();
    }
  };

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();
    const subject = `Project inquiry${name ? ` from ${name}` : ""}`;
    const body = `${message}\n\n${name}${email ? `\n${email}` : ""}`;
    window.location.href = `mailto:${LINKS.email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[80]">
          {/* backdrop — the page, dimmed and softened */}
          <motion.div
            aria-hidden
            className="absolute inset-0 bg-[color-mix(in_oklab,var(--bg)_78%,transparent)] backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: [...EASE_OUT] }}
          />

          {/* scroll shell: taller-than-viewport panels stay reachable */}
          <div
            className="absolute inset-0 overflow-y-auto"
            onClick={(e) => {
              if (e.target === e.currentTarget) setOpen(false);
            }}
          >
            <div
              className="flex min-h-full items-center justify-center p-4 sm:p-8"
              onClick={(e) => {
                if (e.target === e.currentTarget) setOpen(false);
              }}
            >
              <motion.div
                ref={panelRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby="contact-title"
                onKeyDown={trapTab}
                className="w-full max-w-[620px] bg-[var(--bg)]"
                style={{
                  border:
                    "1px solid color-mix(in oklab, var(--fg) 8%, transparent)",
                }}
                initial={{ y: 32, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 14, opacity: 0 }}
                transition={{ duration: 0.7, ease: [...EASE_HOUSE] }}
              >
                {/* meta rail */}
                <div className="flex items-center justify-between border-b border-[var(--rule)] px-[clamp(20px,3.2vw,40px)] py-[1em]">
                  <span className="micro text-[var(--fg-70)]">
                    Inquiry, no handoffs
                  </span>
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="micro text-[var(--fg-70)] transition-colors duration-300 hover:text-accent"
                  >
                    Close
                  </button>
                </div>

                <div className="px-[clamp(20px,3.2vw,40px)] py-[clamp(24px,3vw,40px)]">
                  <h2
                    id="contact-title"
                    className="display text-[clamp(52px,9vw,96px)] text-[var(--fg)]"
                  >
                    Contact<span className="text-accent">.</span>
                  </h2>
                  <p className="mt-[0.9em] max-w-[38ch] text-[length:var(--fs-small)] leading-[1.5] text-[var(--fg-70)]">
                    You talk to the person doing the work. Say what you are
                    making and it gets answered the same day.
                  </p>

                  <form onSubmit={submit} className="mt-[clamp(24px,3vw,40px)]">
                    <div className="grid gap-[clamp(20px,2.4vw,32px)] sm:grid-cols-2">
                      <div>
                        <label htmlFor="c-name" className={LABEL}>
                          Name
                        </label>
                        <input
                          id="c-name"
                          name="name"
                          type="text"
                          required
                          autoComplete="name"
                          placeholder="Your name"
                          className={FIELD}
                          autoFocus
                        />
                      </div>
                      <div>
                        <label htmlFor="c-email" className={LABEL}>
                          Email
                        </label>
                        <input
                          id="c-email"
                          name="email"
                          type="email"
                          required
                          autoComplete="email"
                          placeholder="you@company.com"
                          className={FIELD}
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label htmlFor="c-message" className={LABEL}>
                          Project
                        </label>
                        <textarea
                          id="c-message"
                          name="message"
                          required
                          rows={4}
                          placeholder="What are you making, and when does it need to exist?"
                          className={`${FIELD} resize-none`}
                        />
                      </div>
                    </div>

                    <div className="mt-[clamp(24px,3vw,40px)] flex flex-wrap items-center gap-x-[1.6em] gap-y-[1em]">
                      {/* same white-wipe accent button as the CTA strip */}
                      <button
                        type="submit"
                        className="group relative inline-flex overflow-hidden rounded-[3px] bg-accent"
                      >
                        <span className="flex items-center gap-[0.9em] px-[clamp(18px,1.5vw,32px)] py-[clamp(11px,0.85vw,18px)] text-[length:var(--fs-small)] font-medium tracking-[-0.01em] text-white">
                          Send inquiry
                          <span aria-hidden>&#8599;</span>
                        </span>
                        <span
                          className="absolute inset-0 flex items-center gap-[0.9em] bg-white px-[clamp(18px,1.5vw,32px)] py-[clamp(11px,0.85vw,18px)] text-[length:var(--fs-small)] font-medium tracking-[-0.01em] text-ink [clip-path:inset(0_0_100%_0)] group-hover:[clip-path:inset(0_0_0%_0)]"
                          style={{
                            transition: `clip-path 0.5s ${cubic(EASE_OUT)}`,
                          }}
                          aria-hidden
                        >
                          Send inquiry
                          <span>&#8599;</span>
                        </span>
                      </button>

                      <p
                        className="text-[length:var(--fs-micro)] text-[var(--fg-70)]"
                        aria-live="polite"
                      >
                        {sent ? (
                          "Your mail app has the message ready. Hit send there."
                        ) : (
                          <>
                            Or write directly:{" "}
                            <a
                              href={`mailto:${LINKS.email}`}
                              className="text-[var(--fg-70)] underline decoration-[var(--rule)] underline-offset-4 transition-colors duration-300 hover:text-accent"
                            >
                              {LINKS.email}
                            </a>
                          </>
                        )}
                      </p>
                    </div>
                  </form>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
