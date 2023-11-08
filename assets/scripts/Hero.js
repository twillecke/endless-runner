cc.Class({
    extends: cc.Component,

    properties: {
        jumpSpeed: cc.v2({ x: 0, y: 300 }),
        maxJumpDistance: 300,
        jumpSprite: {
            default: null,
            type: cc.SpriteFrame,
        },
    },

    onLoad() {
        this.animation = this.node.getComponent(cc.Animation);
        this.sprite = this.node.getComponent(cc.Sprite);

        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, (event) => {
            switch (event.keyCode) {
                case cc.macro.KEY.space:
                    this.jumpKeyPressed = true;
                    break;
            }
        });
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, (event) => {
            switch (event.keyCode) {
                case cc.macro.KEY.space:
                    this.jumpKeyPressed = false;
                    this.isJumping = false;
                    break;
            }
        });

        this.node.parent.on(cc.Node.EventType.TOUCH_START, () => {
            this.jumpKeyPressed = true;
        });
        this.node.parent.on(cc.Node.EventType.TOUCH_END, () => {
            this.jumpKeyPressed = false;
            this.isJumping = false;
        });
    },

    start() {
        this.body = this.getComponent(cc.RigidBody);
        this.isJumping = false;
        this.jumpKeyPressed = false;
        this.touching = false;
        this.startJumpY = false;
    },

    onBeginContact() {
        this.touching = true;
    },

    onEndContact() {
        this.touching = false;
    },

    onCollisionEnter(other, self) {
        if (other.node.name === 'diamond') {
            other.node.destroy();
            this.node.emit('score');
        }
    },

    animate() {
        if (this.touching) {
            if (!this.animation.getAnimationState('running').isPlaying) {
                this.animation.start('running');
            }
        } else {
            if (this.animation.getAnimationState('running').isPlaying) {
                this.animation.stop();
                this.sprite.spriteFrame = this.jumpSprite;
            }
        }
    },

    update(dt) {
        if (this.jumpKeyPressed) {
            this.jump();
        }
        this.animate();

        if (this.node.y < -cc.winSize.height / 2) {
            this.node.emit('die');
        }
    },

    jump() {
        if (this.touching) {
            this.startJumpY = this.node.y;
            this.jumpFinished = false;
            this.isJumping = true;
            this.body.linearVelocity = this.jumpSpeed;
        } else if (this.isJumping && !this.jumpFinished) {
            const jumpDistance = this.node.y - this.startJumpY;
            if (jumpDistance < this.maxJumpDistance) {
                this.body.linearVelocity = this.jumpSpeed;
            } else {
                this.jumpFinished = true;
            }
        }
    },
});
