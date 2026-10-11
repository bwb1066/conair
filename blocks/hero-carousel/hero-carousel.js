/**
 * Hero carousel — full-width slides, each authored as a row of
 * [image | heading + text + CTA]. Swipeable scroll-snap track, pill dot
 * indicators, and autoplay that pauses on hover/focus and respects
 * prefers-reduced-motion.
 */
const AUTOPLAY_MS = 6000;

function buildSlide(row, idx) {
  const slide = document.createElement('li');
  slide.className = 'hero-carousel-slide';
  slide.id = `hero-carousel-slide-${idx}`;
  slide.setAttribute('role', 'group');
  slide.setAttribute('aria-roledescription', 'slide');

  const [imageCell, textCell] = row.children;
  const picture = row.querySelector('picture');
  if (picture) {
    const media = document.createElement('div');
    media.className = 'hero-carousel-media';
    media.append(picture);
    slide.append(media);
  }
  const content = document.createElement('div');
  content.className = 'hero-carousel-content';
  const source = textCell || (imageCell && !imageCell.querySelector('picture') ? imageCell : null);
  if (source) content.append(...source.childNodes);
  slide.append(content);

  // Only the first slide's image is LCP-critical.
  const img = slide.querySelector('img');
  if (img && idx > 0) img.loading = 'lazy';
  return slide;
}

export default function init(el) {
  const rows = [...el.querySelectorAll(':scope > div')];
  const track = document.createElement('ul');
  track.className = 'hero-carousel-track';
  rows.forEach((row, idx) => track.append(buildSlide(row, idx)));
  const slides = [...track.children];

  el.setAttribute('role', 'region');
  el.setAttribute('aria-roledescription', 'carousel');
  el.ariaLabel = 'Featured products';
  el.replaceChildren(track);
  if (slides.length < 2) return;

  slides.forEach((slide, idx) => slide.setAttribute('aria-label', `${idx + 1} of ${slides.length}`));

  const dots = document.createElement('div');
  dots.className = 'hero-carousel-dots';
  const buttons = slides.map((slide, idx) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.ariaLabel = `Show slide ${idx + 1}`;
    btn.setAttribute('aria-controls', slide.id);
    btn.addEventListener('click', () => {
      // eslint-disable-next-line no-use-before-define
      goTo(idx);
    });
    dots.append(btn);
    return btn;
  });
  el.append(dots);

  let current = 0;
  const setActive = (idx) => {
    current = idx;
    buttons.forEach((btn, i) => btn.setAttribute('aria-current', String(i === idx)));
    slides.forEach((slide, i) => { slide.inert = i !== idx; });
  };
  function goTo(idx) {
    const next = (idx + slides.length) % slides.length;
    track.scrollTo({ left: slides[next].offsetLeft, behavior: 'smooth' });
    setActive(next);
  }
  setActive(0);

  // Keep dots in sync with swipes.
  let scrollTimer;
  track.addEventListener('scroll', () => {
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(() => {
      const idx = Math.round(track.scrollLeft / track.clientWidth);
      if (idx !== current) setActive(idx);
    }, 80);
  }, { passive: true });

  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  let timer;
  const play = () => {
    clearInterval(timer);
    timer = setInterval(() => goTo(current + 1), AUTOPLAY_MS);
  };
  const pause = () => clearInterval(timer);
  el.addEventListener('mouseenter', pause);
  el.addEventListener('mouseleave', play);
  el.addEventListener('focusin', pause);
  el.addEventListener('focusout', play);
  play();
}
