import { getConfig, getMetadata } from '../ak.js';

// Conair favicons (from conair.com): 32px tab icon, 96px touch icon.
(async function loadFavicon() {
  const { codeBase } = getConfig();
  const name = getMetadata('favicon') || 'favicon';
  const favBase = `${codeBase}/img/favicons/${name}`;

  // Load before setting the main icon to prevent icon re-evaluation
  document.head.insertAdjacentHTML('beforeend', `<link rel="apple-touch-icon" href="${favBase}-96.png">`);

  const favicon = document.head.querySelector('link[href="data:,"]');
  if (favicon) {
    favicon.type = 'image/png';
    favicon.href = `${favBase}-32.png`;
  }
}());
