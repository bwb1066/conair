/**
 * Cards — Conair category tiles. Each row is one card: an optional image plus
 * a link (the card's label and destination). Rows without an image render as
 * solid color tiles so text-only authoring still looks intentional; any other
 * text in the row becomes the card body.
 */
export default function init(el) {
  const list = document.createElement('ul');
  list.className = 'cards-list';

  for (const row of [...el.querySelectorAll(':scope > div')]) {
    const li = document.createElement('li');
    li.className = 'cards-card';
    const picture = row.querySelector('picture');
    const link = row.querySelector('a');

    const media = document.createElement('div');
    media.className = 'cards-card-media';
    if (picture) {
      media.append(picture);
    } else {
      li.classList.add('no-image');
    }

    const body = document.createElement('div');
    body.className = 'cards-card-body';
    for (const cell of row.children) {
      for (const node of [...cell.children]) {
        if (!node.querySelector('picture') && !node.contains(link)) body.append(node);
      }
    }

    const title = document.createElement('p');
    title.className = 'cards-card-title';
    title.textContent = link ? link.textContent.trim() : row.textContent.trim();

    if (link) {
      const a = document.createElement('a');
      a.href = link.href;
      a.className = 'cards-card-link';
      if (!picture) media.append(title.cloneNode(true));
      a.append(media, title);
      li.append(a);
    } else {
      li.append(media, title);
    }
    if (body.children.length) li.append(body);
    list.append(li);
  }

  el.replaceChildren(list);
}
