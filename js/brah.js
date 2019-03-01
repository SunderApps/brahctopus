var brah = brah || {
    modals: {

        show: function () {
            $('#octolad').stop().fadeTo(2000, 0.1);
        },

        hide: function () {
            $('#octolad').stop().fadeTo(300, 0);
        },

        events: function () {
            $('#Contact, #Subscribe, #Details')
                .on('show.bs.modal', brah.modals.show)
                .on('hide.bs.modal', brah.modals.hide);
        },

        init: function () {
            brah.modals.events();
        }
    },

    storage: {
        enabled: false,

        set: function (key, item) {
            if (brah.storage.enabled) {
                window.localStorage.setItem(key, item);
            }
        },

        get: function (key) {
            if (brah.storage.enabled) {
                return window.localStorage.getItem(key);
            } else {
                return 'undefined';
            }
        },

        remove: function (key) {
            if (brah.storage.enabled) {
                window.localStorage.removeItem(key);
            }
        },

        clear: function () {
            if (brah.storage.enabled) {
                window.localStorage.clear();
            }
        },

        init: function () {
            if (typeof Storage !== 'undefined') {
                brah.storage.enabled = true;
            }
        }
    },

    close: function () {
        $('.collapse').collapse('hide');
        $('.show:not(.collapse)').removeClass('show');
    },

    isEdge: function() {
        var ua = window.navigator.userAgent;

        var msie = ua.indexOf('MSIE ');
        if (msie > 0) {
            // IE 10 or older => return version number
            return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
        }

        var trident = ua.indexOf('Trident/');
        if (trident > 0) {
            // IE 11 => return version number
            var rv = ua.indexOf('rv:');
            return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
        }

        var edge = ua.indexOf('Edge/');
        if (edge > 0) {
            // Edge (IE 12+) => return version number
            return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
        }

        // other browser
        return false;
    },

    events: function () {
        $(window).on('click', brah.close);
    },

    init: function () {
        brah.events();
        brah.storage.init();
        brah.modals.init();
    }
};

$(brah.init);