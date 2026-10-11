/**
 * Banner — a single-line promo strip ("Enjoy Free Shipping on All Orders
 * Over $100!"). In the header it's lifted into the top bar by header.js; on a
 * page it renders as a full-width cream strip.
 */
export default function init(el) {
  const text = el.querySelector(':scope > div > div');
  if (text) text.classList.add('banner-text');
}
