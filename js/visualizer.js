var delay = (function () {
    var timer = 0;
    return function (callback, ms) {
        clearTimeout(timer);
        timer = setTimeout(callback, ms);
    };
})();

function debounce(fn, wait, immediate) {
    var timeout;
    return function () {
        var context = this,
            args = arguments,
            later = function () {
                timeout = null;
                if (!immediate) fn.apply(context, args);
            },
            callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) fn.apply(context, args);
    };
}

brah.vis = brah.vis || {
    first: false,
    lock: false,

    splash: {
        buffer: 5,
        set: function (h1, h4, p) {
            if ($('.splash .header h1').html() !== h1) {
                $('.splash').fadeOut(300, function () {
                    $('.splash .header h1').html(h1);
                    $('.splash .header h4').html(h4);
                    $('.splash p').html(p);
                    $('.splash').fadeIn(1000);
                    brah.vis.sleep();
                });
            }
        }
    },

    play: function () {
        $('video')[0].play();
        $('.fa-play, .fa-pause').removeClass('fa-play').addClass('fa-pause');
    },

    pause: function () {
        $('video')[0].pause();
        $('.fa-play, .fa-pause').removeClass('fa-pause').addClass('fa-play');
    },

    mute: function (muted) {
        $('video')[0].muted = muted;
        if (muted) {
            $('fa-volume-up, fa-volume-mute').removeClass('fa-volume-up').addClass('fa-volume-mute');
        } else {
            $('fa-volume-up, fa-volume-mute').removeClass('fa-volume-mute').addClass('fa-volume-up');
        }
    },

    wake: debounce(function (e) {
        $('.ui').fadeIn(300);
        $('video, .ui').css('cursor', 'pointer');
    }, 250, true),

    sleep: debounce(function (e) {
        delay(brah.vis.hide, 1000);
    }, 1000, false),

    hover: function (e) {
        brah.vis.lock = true;
    },

    unhover: function (e) {
        brah.vis.lock = false;
        brah.vis.sleep();
    },

    hide: function () {
        if (!brah.vis.lock) {
            $('.ui').fadeOut(1000);
            $('video, .ui').css('cursor', 'none');
        }
    },

    toggleVideo: function (e) {
        if ($(this).hasClass('fa-play')) {
            brah.vis.play();
        } else {
            brah.vis.pause();
        }
    },

    toggleAudio: function (e) {
        if ($(this).hasClass('fa-volume-up')) {
            brah.vis.mute(true);
        } else {
            brah.vis.mute(false);
        }
    },

    fullScreen: function (e) {
        var video = $('video')[0];
        if (video.requestFullscreen) {
            video.requestFullscreen();
        } else if (video.mozRequestFullScreen) {
            video.mozRequestFullScreen();
        } else if (video.webkitRequestFullscreen) {
            video.webkitRequestFullscreen();
        }
    },

    setTime: function (e) {
        var video = $('video')[0];
        var time = video.duration * ($(this).val() / 100);
        video.currentTime = time;
    },

    volume: function (e) {
        $('video')[0].volume = $(this).val();
    },

    setResolution: function (e) {
        brah.vis.pause();
        brah.vis.toggleResolution();
        $('.controls').fadeOut(300);
        var $this = $(this),
            video = $('video')[0],
            time = video.currentTime;
        $('video').off('loadeddata').on('loadeddata', function () {
            video.currentTime = time;
            brah.vis.play();
            $('.controls').fadeIn(300);
        });
        $('video').attr('src', 'mp4/Mothership.' + $this.attr('id') + '.mp4');
        $('.resolution > .res')
            .html($this.html())
            .append($('<i class="fas fa-chevron-down"></i>'));
        if (!brah.vis.first) {
            brah.vis.first = true;
            $(window).on('mousemove click', brah.vis.wake).on('mousemove click', brah.vis.sleep);
            $('.ui.hover').on('mouseover', brah.vis.hover).on('mouseleave', brah.vis.unhover);
        }
    },

    toggleResolution: function (e) {
        $('.resolution .collapse').collapse('toggle');
        $('.resolution').toggleClass('show');
        return false;
    },

    update: function (e) {
        var video = $('video')[0];
        var value = (100 / video.duration) * video.currentTime;
        $('.scrubber').val(value);
        switch (true) {
            case video.currentTime > 2439.32:
                brah.vis.splash.set('8. Subconscious Traveling', '', '');
                break;
            case video.currentTime > 2143.66:
                brah.vis.splash.set('7. Eternity', 'Featuring: Zack Shahen, Karli Blotzer, Ryan Yingst', '');
                break;
            case video.currentTime > 1902.21:
                brah.vis.splash.set('6. Just Believe', '', '');
                break;
            case video.currentTime > 1534.90:
                brah.vis.splash.set('5. High Society', '', '');
                break;
            case video.currentTime > 1252.36:
                brah.vis.splash.set('4. The Mothership', '', '');
                break;
            case video.currentTime > 975.23:
                brah.vis.splash.set('3. Don\'t Be Late', '', '');
                break;
            case video.currentTime > 459.91:
                brah.vis.splash.set('2. Gypsy Woman', '', '');
                break;
            case video.currentTime > 0:
                brah.vis.splash.set('1. Lucid', '', '');
                break;
            default:
                break;
        }
    },

    keyPress: function (e) {
        switch (e.keyCode) {
            case 32:
                brah.vis.toggleVideo();
                break;
        }
    },

    events: function () {
        $('.fa-play, .fa-pause').on('click', brah.vis.toggleVideo);
        $('.fa-volume-up, .fa-volume-mute').on('click', brah.vis.toggleAudio);
        $('.fa-expand').on('click', brah.vis.fullScreen);
        $('.scrubber').on('change, input', brah.vis.setTime).on('mousedown', brah.vis.pause).on('mouseup', brah.vis.play);
        $('.volume').on('change, input', brah.vis.volume);
        $('.resolution .collapse .res').on('click', brah.vis.setResolution);
        $('.resolution > .res').on('click', brah.vis.toggleResolution);
        $('video').on('timeupdate', brah.vis.update).on('contextmenu', function () { return false; });
        $(document).on('keydown', brah.vis.keyPress);
    },

    init: function () {
        brah.vis.events();
        $('.controls').fadeOut(0).css('opacity', 1);
        if (brah.isEdge()) {
            $('body').addClass('edge');
        }
    }
};

$(brah.vis.init);