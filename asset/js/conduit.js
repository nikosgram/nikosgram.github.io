/*!
 *  Conduit by @nikosgram17 - http://nikosgram13.github.io/ - @nikosgram13
 *  License - http://nikosgram13.github.io/LICENSE
 */
(function () {
    window.addHash = (function (key, value) {
        var hashs = allHash();

        hashs[key] = value;

        setHash(hashs);
    });

    window.remHash = (function (key) {
        if (exsHash(key)) {
            var hashs = allHash();

            delete hashs[key];

            setHash(hashs);
        }
    });

    window.clrHash = (function () {
        window.location.hash = '#';
    });

    window.exsHash = (function (key) {
        var hashs = allHash();

        return hashs[key] != undefined;
    });

    window.getHash = (function (key) {
        if (exsHash(key)) {
            var hashs = allHash();

            return hashs[key];
        }
    });

    window.setHash = (function (hashs) {
        var hash = '#';

        for (var vare in hashs) {
            hash = hash + vare + '=' + hashs[vare] + '&';
        }

        window.location.hash = hash.replace(/&$/, '');
    });

    window.allHash = (function () {
        var hashs = [];

        if (window.location.hash) {
            var hash = window.location.hash.replace(/#/g, '').split('&');
            hash.forEach(function (h) {
                var splited = h.split('=');
                if (splited.length >= 2) {
                    hashs[splited[0].toLowerCase()] = splited[1];
                }
            });
        }
        return hashs;
    });

    window.onReady = (function (query, func) {
        var elem = document.querySelector(query);
        if (elem) {
            func(elem);
        } else {
            setTimeout(function () {
                window.onReady(query, func);
            }, 1);
        }
    });
})();