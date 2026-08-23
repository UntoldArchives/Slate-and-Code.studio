/* The contact form opens from several places (navbar pill, the orange CTA)
   that live in different trees. A window event keeps the wiring flat: any
   button can call openContact(), and the one modal in the layout listens. */

export const CONTACT_EVENT = "sc:open-contact";

export function openContact() {
  window.dispatchEvent(new Event(CONTACT_EVENT));
}
