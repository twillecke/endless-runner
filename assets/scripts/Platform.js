const TILE_SIZE = 64;

cc.Class({
    extends: cc.Component,

    properties: {
        coinOffsetMin: 100,
        coinOffsetMax: 200,
        tile: {
            default: null,
            type: cc.Prefab,
        },
        diamond: {
            default: null,
            type: cc.Prefab,
        },
    },

    start() {},

    init(tilesCount, x, y) {
        this.active = true;
        this.node.removeAllChildren();

        this.node.setPosition(cc.v2(x, y));

        for (let i = 0; i < tilesCount; i++) {
            const tile = cc.instantiate(this.tile);
            this.node.addChild(tile);
            tile.setPosition(i * tile.width, 0);
        }
        this.node.width = TILE_SIZE * tilesCount;
        this.node.height = TILE_SIZE;

        let collider = this.node.getComponent(cc.PhysicsBoxCollider);
        collider.size.width = this.node.width;
        collider.size.height = this.node.height;

        collider.offset.x = this.node.width / 2 - TILE_SIZE / 2;
        collider.apply();

        this.createDiamonds();
    },

    createDiamonds() {
        const y =
            this.coinOffsetMin +
            Math.random() * (this.coinOffsetMax - this.coinOffsetMin);
        this.node.children.forEach((tile) => {
            if (Math.random() <= 0.4) {
                const diamond = cc.instantiate(this.diamond);
                tile.addChild(diamond);
                diamond.setPosition(0, y);
            }
        });
    },

    update(dt) {
        if (this.active) {
            this.node.x -= 150 * dt;
            const platformRight = this.node.x + this.node.width;
            if (platformRight < -cc.winSize.width / 2) {
                this.active = false;
            }
        }
    },
});
