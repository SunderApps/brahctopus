brah.unity = brah.unity || {
    init: function () {
        var gameInstance = UnityLoader.instantiate("gameContainer", "Build/1.15.19.json", { onProgress: UnityProgress });
    }
};

$(brah.unity.init);