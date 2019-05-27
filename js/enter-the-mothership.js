brah.ETM = brah.ETM || {
    id: 'enter-the-mothership',
    version: '1.10',
    instance: null,

    fullScreen: function () {
        if (brah.ETM.instance) {
            brah.ETM.instance.SetFullscreen(1);
        }
    },

    update: function () {
        if ($('.container.etm').hasClass('open')) {
            //brah.ETM.instance.SendMessage('AudioPlayer', 'ResumeMusic');
        } else {
            //brah.ETM.instance.SendMessage('AudioPlayer', 'PauseMusic');
        }
    },

    events: function () {
        $('#' + brah.ETM.id + ' + .footer .fullscreen').on('click', brah.ETM.fullScreen);
        $under.$erver.on('$-open-page', brah.ETM.update);
    },

    init: function () {
        brah.ETM.events();
        brah.ETM.instance = UnityLoader.instantiate(brah.ETM.id, '/unityweb/enter-the-mothership/Build/EnterTheMothership' + brah.ETM.version + '.json', { onProgress: UnityProgress });
    }
};

$(brah.ETM.init);

