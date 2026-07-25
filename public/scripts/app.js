// scripts for the whole app

var Library = {lastScrollPosition: 0};

Library.checkScroll = function() {
    // throttling needed?
    if (Library.justScrolled) { return; }
    Library.justScrolled = true;
    setTimeout(function() { Library.justScrolled = false; }, 50);
    
    var scrolltop = $(window).scrollTop();
    var banner = $('#top-banner');
    if (scrolltop > Library.lastScrollPosition) {
        // we scrolled down
        if (scrolltop > 200) { banner.addClass('smaller'); }
    } else {
        // we scrolled up
        if (scrolltop < 50) { banner.removeClass('smaller'); }
    }
    Library.lastScrollPosition = scrolltop;
};

$(function() {
    $(window).scroll(Library.checkScroll);
    $('.bookitem[data-href]').click(function(ev) {
        var target = $(ev.target);
        if (target.closest('a[href]').length) { return; }
        var href = target.closest('.bookitem').attr('data-href');
        if (href && href.indexOf('/') === 0) { location.href = href; }
    });
});
