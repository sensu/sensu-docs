// This is messy, because docs content isn't nested in <section>s. Instead, we:
//   1. Detect the ToC anchors (links)
//   2. Query the <article> for these headings
//   3. Split the <article>'s childNodes into <section>s with these headings as boundaries
//   4. Use the new parent <sections> as IntersectionObserver entries
(function () {
  // 1
  const $tocElements = document.querySelectorAll('#TableOfContents li');
  const tocLinks = Array.from($tocElements).map($li => (
    `#${CSS.escape($li.querySelector('a').getAttribute('href').replace('#', ''))}`
  ));

  // 2
  const $headings = Array.from(document.querySelectorAll(tocLinks.join(',')));

  // 3
  const $article = document.querySelector('main article h1').parentElement;
  const $articleNodes = Array.from($article.childNodes);
  // Use Set for unique indices
  const articleSectionBoundaries = [...new Set([
      0,
      ...$headings.map($heading => $articleNodes.indexOf($heading)),
      $articleNodes.length - 1
    ])];
  for (let i=1; i < articleSectionBoundaries.length; i++) {
    const $section = document.createElement('section');
    $article.appendChild($section);
    $articleNodes.slice(articleSectionBoundaries[i-1], articleSectionBoundaries[i]).map($child => $section.appendChild($child));
  }

  // 4
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      const id = CSS.escape(entry.target.firstChild.getAttribute('id'));
      const $li = document.querySelector(`#TableOfContents a[href="#${id}"]`).parentElement;
      if (entry.intersectionRatio > 0) {
        $li.classList.add('active');
      } else {
        $li.classList.remove('active');
      }
    });
  }, { rootMargin: '-125px 0px -60px' });
  $headings.forEach(heading => observer.observe(heading.parentElement));
})();
