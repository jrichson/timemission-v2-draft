/* Preview-only (GitHub Pages lives under /timemission-v2-draft/): keep venue-scoped links working.
   The real site reads the venue from the first path segment; here that segment is the repo name. */
(function () {
    var PREFIX = '/timemission-v2-draft';
    function scopedPaths() {
        var c = window.__TM_SITE_CONTRACT__ || {};
        return ((c.runtime || {}).locationScopedPaths) || [];
    }
    function venueFromPath() {
        var rest = location.pathname.slice(PREFIX.length).replace(/^\/+/, '').split('/')[0].replace(/\.html$/, '');
        var tm = window.TM;
        if (!rest || !tm || !tm.locations) return '';
        var hit = tm.locations.find(function (l) { return (l.slug || l.id) === rest; });
        return hit ? (hit.slug || hit.id) : '';
    }
    function apply() {
        var tm = window.TM;
        var slug = venueFromPath() || (tm && tm.current && !tm.current.externalUrl ? (tm.current.slug || tm.current.id) : '');
        if (!slug) return;
        if (tm && (!tm.current || (tm.current.slug || tm.current.id) !== slug) && typeof tm.select === 'function') tm.select(slug);
        var paths = scopedPaths();
        document.querySelectorAll('a[href^="' + PREFIX + '/"]').forEach(function (a) {
            if (a.hasAttribute('data-tm-location-slug') || a.closest('.footer-location-list, .location-dropdown')) return;
            var base = a.getAttribute('data-preview-base') || a.getAttribute('href');
            var u = new URL(base, location.origin);
            var rest = u.pathname.slice(PREFIX.length) || '/';
            rest = rest.replace(/\/+$/, '') || '/';
            if (rest.split('/')[1] === slug) return;
            if (rest !== '/' && paths.indexOf(rest) === -1) return;
            a.setAttribute('data-preview-base', base);
            a.setAttribute('href', PREFIX + '/' + slug + (rest === '/' ? '' : rest) + u.search + u.hash);
        });
    }
    function start() {
        var tm = window.TM;
        var ready = tm && tm.ready && tm.ready.then ? tm.ready : Promise.resolve();
        ready.then(function () { apply(); setTimeout(apply, 600); });
        document.addEventListener('tm:location-changed', function () { setTimeout(apply, 0); });
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
