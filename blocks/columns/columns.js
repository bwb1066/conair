function decorateCover(col) {
  const children = [...col.children];
  if (children.length === 1 && children[0].nodeName === 'PICTURE') {
    col.classList.add('cover-image');
    col.parentElement.classList.add('cover-row');
  } else {
    col.classList.add('cover-content');
  }
}

function decorateCols(el, cols) {
  const hasCover = el.classList.contains('image-cover');
  for (const [idx, col] of cols.entries()) {
    col.classList.add('col', `col-${idx + 1}`);
    if (hasCover) decorateCover(col);
  }
}

function decorateRows(el, rows) {
  for (const [idx, row] of rows.entries()) {
    row.classList.add('row', `row-${idx + 1}`);
    const cols = [...row.children];
    row.style = `--child-count: ${cols.length}`;
    decorateCols(el, cols);
  }
}

const isPictureOnly = (col) => col.children.length === 1 && !!col.querySelector('picture')
  && !col.textContent.trim();

// [image | text] single-row block. Structural, so it gives the same answer
// whether or not a block has been decorated yet (sections load concurrently).
function isMediaBlock(block) {
  const rows = [...block.children];
  if (rows.length !== 1) return false;
  const cols = [...rows[0].children];
  return cols.length === 2 && cols.some(isPictureOnly);
}

/**
 * Conair layouts: an [image | text] block is a full-bleed "media" split, and
 * media splits alternate sides down the page (first one text-left, as on
 * conair.com). A block with no images is a "text-only" feature row.
 */
function decorateLayout(el) {
  if (!el.querySelector('picture')) {
    el.classList.add('text-only');
    return;
  }
  if (!isMediaBlock(el)) return;
  el.classList.add('media');
  [...el.firstElementChild.children].find(isPictureOnly).classList.add('media-image');
  const all = [...document.querySelectorAll('main .columns')].filter(isMediaBlock);
  if (all.indexOf(el) % 2 === 0) el.classList.add('media-reverse');
}

export default function init(el) {
  const rows = [...el.children];
  decorateRows(el, rows);
  decorateLayout(el);
}
