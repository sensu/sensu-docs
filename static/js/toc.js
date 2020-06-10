// This is messy, because docs content isn't nested in <section>s. Instead, we:
//   1. Detect the ToC anchors (links)
//   2. Query the <article> for these headings
//   3. Re-format the ToC (in Hugo v0.70.0, the template is not customizable)
//   4. Split the <article>'s childNodes into <section>s with these headings as boundaries
//   5. Use the new parent <sections> as IntersectionObserver entries
(function () {
  // 1
  const $toc = document.getElementById('TableOfContents');
  const $tocElements = $toc.querySelectorAll('li');
  const tocLinks = Array.from($tocElements).map($li => (
    `#${CSS.escape($li.querySelector('a').getAttribute('href').replace('#', ''))}`
  ));

  // 2
  const $headings = Array.from(document.querySelectorAll(tocLinks.join(',')));
  // 3
  $headings.map(($heading, i) => (
    $tocElements[i].classList.add($heading.tagName.toLowerCase())
  ));
  while($toc.firstChild){
    $toc.removeChild($toc.firstChild);
  }
  $tocElements.forEach($el => $toc.appendChild($el));

  // 4
  const $article = document.querySelector('main article h1').parentElement;
  const $articleNodes = Array.from($article.childNodes);
  // Use Set for unique indices
  const sectionBoundaries = [...new Set([
      0,
      ...$headings.map($heading => (
        // $heading.tagName === 'H2' ? $articleNodes.indexOf($heading) : 0
        $articleNodes.indexOf($heading)
      )),
      $articleNodes.length - 1
    ])];
  for (let i=1; i < sectionBoundaries.length; i++) {
    const $section = document.createElement('section');
    $article.appendChild($section);
    $articleNodes.slice(sectionBoundaries[i-1], sectionBoundaries[i]).map($child => $section.appendChild($child));
  }

  // 5
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      const id = CSS.escape(entry.target.firstChild.getAttribute('id'));
      const $li = $toc.querySelector(`a[href="#${id}"]`).parentElement;
      if (entry.intersectionRatio > 0) {
        $li.classList.add('active');
      } else {
        $li.classList.remove('active');
      }
    });
  }, { rootMargin: '-125px 0px -60px' });
  $headings.forEach(heading => observer.observe(heading.parentElement));

  // Related functionality
  $tocElements.forEach($el => {
    $el.addEventListener('click', (e) => {
      $tocElements.forEach($el => $el.classList.remove('active', 'clicked'));
      e.currentTarget.classList.add('active', 'clicked');
      observer.disconnect();
    });
  });
})();
