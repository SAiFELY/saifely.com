// Lets a visitor type their own name into the crash alert on the homepage,
// mirrored into the all-clear message below it.
//
// Served as a real file rather than an Astro <script> because Astro inlines
// small bundled scripts into the HTML, and an inline script would force
// script-src 'unsafe-inline' in the CSP. Keeping it external lets the policy
// stay at script-src 'self'.
(function () {
  var nameEl = document.getElementById('rider-name');
  if (!nameEl) return;

  var okName = document.querySelector('.who-ok');
  var FALLBACK = 'Kirk';
  var MAX = 24;

  var clean = function (s) {
    return (s || '').replace(/\s+/g, ' ').trim().slice(0, MAX);
  };

  nameEl.addEventListener('input', function () {
    var v = clean(nameEl.textContent);
    if (okName) okName.textContent = v || FALLBACK;
  });

  // Single line only: Enter commits rather than inserting a break.
  nameEl.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      nameEl.blur();
    }
  });

  // Paste as plain text so markup cannot be dropped into the message.
  nameEl.addEventListener('paste', function (e) {
    e.preventDefault();
    var text = ((e.clipboardData || window.clipboardData).getData('text/plain') || '')
      .replace(/\s+/g, ' ')
      .slice(0, MAX);
    var sel = window.getSelection();
    if (!sel || !sel.rangeCount) return;
    sel.deleteFromDocument();
    sel.getRangeAt(0).insertNode(document.createTextNode(text));
    sel.collapseToEnd();
    nameEl.dispatchEvent(new Event('input'));
  });
})();
