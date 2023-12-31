let Globals = require('Globals');

cc.Class({
    extends: cc.Component,

    properties: {
        scoreLabel: {
            default: null,
            type: cc.Label,
        },
    },

    start() {
        this.scoreLabel.string = `Score: ${Globals.score.toString()}`;
        this.node.on(cc.Node.EventType.TOUCH_END, () => {
            cc.director.loadScene('game');
        });
    },
});
