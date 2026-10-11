import { getConfig, getMetadata } from '../../scripts/ak.js';
import { loadFragment } from '../fragment/fragment.js';

const FOOTER_PATH = '/fragments/nav/footer';

// Social link text → icon file in /img/icons (Twitter is X now).
const SOCIAL = {
  instagram: 'instagram',
  facebook: 'facebook',
  youtube: 'youtube',
  tiktok: 'tiktok',
  twitter: 'x',
  x: 'x',
  pinterest: 'pinterest',
};

function decorateSocial(list) {
  list.classList.add('footer-social');
  for (const a of list.querySelectorAll('a')) {
    const name = SOCIAL[a.textContent.trim().toLowerCase()];
    if (name) {
      const img = document.createElement('img');
      img.src = `/img/icons/social-${name}.svg`;
      img.alt = '';
      img.width = 24;
      img.height = 24;
      a.ariaLabel = a.textContent.trim();
      a.replaceChildren(img);
    }
  }
}

function isExternal(a) {
  try {
    return !new URL(a.href).hostname.endsWith('conair.com');
  } catch {
    return false;
  }
}

/**
 * The authored footer is one section of heading + list pairs, then a
 * copyright paragraph and a legal list. Regroup it into link columns and a
 * bottom bar.
 */
function buildFooter(content) {
  const columns = document.createElement('div');
  columns.className = 'footer-columns';
  const bottom = document.createElement('div');
  bottom.className = 'footer-bottom';

  let column = null;
  for (const el of [...content.children]) {
    if (/^H[1-6]$/.test(el.tagName)) {
      column = document.createElement('div');
      column.className = 'footer-column';
      column.append(el);
      columns.append(column);
    } else if (el.tagName === 'UL' && column) {
      if (/social/i.test(column.textContent)) decorateSocial(el);
      for (const a of el.querySelectorAll('a')) {
        if (isExternal(a) && !el.classList.contains('footer-social')) a.classList.add('external');
      }
      column.append(el);
      column = null;
    } else {
      el.classList.add(el.tagName === 'UL' ? 'footer-legal' : 'footer-copyright');
      bottom.append(el);
    }
  }
  content.replaceChildren(columns, bottom);
}

/**
 * loads and decorates the footer
 * @param {Element} el The footer element
 */
export default async function init(el) {
  const { locale } = getConfig();
  const footerMeta = getMetadata('footer-source');
  const path = footerMeta || FOOTER_PATH;
  try {
    const fragment = await loadFragment(`${locale.prefix}${path}`);
    fragment.classList.add('footer-content');

    const sections = [...fragment.querySelectorAll('.section')];
    if (sections.length === 1) {
      const content = sections[0].querySelector('.default-content');
      if (content) buildFooter(content);
    } else if (sections.length > 1) {
      const copyright = sections.pop();
      copyright.classList.add('section-copyright');
      const legal = sections.pop();
      legal?.classList.add('section-legal');
    }

    el.append(fragment);
  } catch (e) {
    throw Error(e);
  }
}
