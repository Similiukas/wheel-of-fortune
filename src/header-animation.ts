import { Application, Assets, Renderer, Sprite, Ticker } from 'pixi.js';
import { randomInt } from './utils';

function showdownAnimation(app: Application<Renderer>, sprites: Sprite[]) {
    let visibilityDelay = 0; // Delay counter
    const delayIncrement = 10; // Number of frames to wait before showing the next sprite
    let currentSpriteIndex = 0; // Start with the first sprite

    const animation = (ticker: Ticker) => {
        if (visibilityDelay <= 0 && currentSpriteIndex < sprites.length) {
            sprites[currentSpriteIndex].visible = true; // Make the current sprite visible
            currentSpriteIndex++; // Move to the next sprite
            visibilityDelay = delayIncrement; // Reset the delay counter
        } else if (currentSpriteIndex === sprites.length) {
            ticker.remove(animation);
        } else {
            visibilityDelay--; // Decrement the delay counter
        }
    };

    app.ticker.add(animation);
}

function flickerAnimation(app: Application<Renderer>, sprites: Sprite[], delay: number) {
    let _delay = delay; // Delay counter
    let visibility = false; // Initial visibility of the slots
    let flickerCount = 2 * 2;

    const animation = (ticker: Ticker) => {
        if (_delay <= 0 && flickerCount > 0) {
            sprites.forEach(sprite => (sprite.visible = visibility)); // Update the slots' visibility
            visibility = !visibility; // Toggle the slots' visibility
            _delay = randomInt(3, 8); // Reset the delay counter
            flickerCount--;
        } else if (flickerCount === 0) {
            ticker.remove(animation);
        } else {
            _delay--; // Decrement the delay counter
        }
    };

    app.ticker.add(animation);
}

function boltAnimation(app: Application<Renderer>, sprite: Sprite) {
    let delay = 30; // Delay counter
    let boltVisible = false; // Initial visibility of the bolt

    app.ticker.add(() => {
        if (delay <= 0) {
            sprite.visible = boltVisible; // Update the bolt's visibility
            boltVisible = !boltVisible; // Toggle the bolt's visibility
            delay = randomInt(1, 8); // Reset the delay counter
        } else {
            delay--; // Decrement the delay counter
        }
    });
}

export async function startAnimation() {
    const app = new Application();
    const header = document.querySelector('header')!;
    await app.init({ backgroundAlpha: 0, resizeTo: header });
    header.appendChild(app.canvas);

    // ----------------- Text -----------------
    const showdownParts = [
        { url: './assets/s@2x.png', x: 575, y: 30, yD: 0 },
        { url: './assets/h@2x.png', x: 655, y: 30, yD: 0 },
        { url: './assets/o-1@2x.png', x: 780, y: 30, yD: 2 },
        { url: './assets/w-1@2x.png', x: 820, y: 30, yD: 2 },
        { url: './assets/d@2x.png', x: 915, y: 30, yD: 2 },
        { url: './assets/o-2@2x.png', x: 985, y: 30, yD: 2 },
        { url: './assets/w-2@2x.png', x: 1060, y: 30, yD: 0 },
        { url: './assets/n@2x.png', x: 1140, y: 30, yD: 0 }
    ];
    // Load the PNG files
    await Promise.all(showdownParts.map(({ url }) => Assets.load(url)));

    const showdownSprites: Sprite[] = [];
    // Create sprites for each part and add them to the stage
    showdownParts.forEach(part => {
        const sprite = new Sprite(Assets.get(part.url));
        sprite.visible = false;
        app.stage.addChild(sprite);
        showdownSprites.push(sprite);
    });

    // ----------------- Slots -----------------
    const slotParts = [{ url: './assets/vegas@2x.png', x: 665, y: 30, yD: -10 }, { url: './assets/slots@2x.png', x: 990, y: 30, yD: -10 }];
    await Promise.all(slotParts.map(({ url }) => Assets.load(url)));
    const slotsSprites = slotParts.map(({ url }) => new Sprite(Assets.get(url)));
    slotsSprites.forEach(sprite => {
        sprite.visible = false;
        app.stage.addChild(sprite);
    });

    // ----------------- Bolt -----------------
    const bolt = { url: './assets/bolt@2x.png', x: 912, y: 30, yD: -43 };
    await Assets.load(bolt.url);
    const boltSprite = new Sprite(Assets.get(bolt.url));
    boltSprite.visible = false;
    app.stage.addChild(boltSprite);

    // ----------------- Must Drop -----------------
    const mustDropText = { url: './assets/must_drop.png', x: 720, y: 30, yD: 170 };
    await Assets.load(mustDropText.url);
    const mustDropSprite = new Sprite(Assets.get(mustDropText.url));
    mustDropSprite.visible = false;
    app.stage.addChild(mustDropSprite);

    // Update the positions and scales of the sprites based on the window size
    function updateSpritePositionsAndScales() {
        const isMobile = window.innerHeight > window.innerWidth;
        const scaleFactor = isMobile ? window.innerWidth / 1920 + 0.15 : window.innerWidth / 1920; // Assuming 1920 is the base width for scaling

        showdownSprites.forEach((sprite, i) => {
            sprite.scale.set(0.85 * scaleFactor); // Update scale based on window size
            sprite.x = showdownParts[i].x * scaleFactor; // Update x position based on window size
            sprite.y = showdownParts[i].y + showdownParts[i].yD * scaleFactor; // Update y position based on window size
            isMobile && (sprite.x -= 150); // Adjust x position for mobile
        });

        slotsSprites.forEach((sprite, i) => {
            sprite.scale.set(0.85 * scaleFactor);
            sprite.x = slotParts[i].x * scaleFactor;
            sprite.y = slotParts[i].y + slotParts[i].yD * scaleFactor;
            isMobile && (sprite.x -= 150); // Adjust x position for mobile
        });

        boltSprite.scale.set(0.85 * scaleFactor);
        boltSprite.x = bolt.x * scaleFactor;
        boltSprite.y = bolt.y + bolt.yD * scaleFactor;
        isMobile && (boltSprite.x -= 150); // Adjust x position for mobile

        mustDropSprite.scale.set(0.5 * scaleFactor);
        mustDropSprite.x = mustDropText.x * scaleFactor;
        mustDropSprite.y = mustDropText.y + mustDropText.yD * scaleFactor;
        isMobile && (mustDropSprite.x -= 150); // Adjust x position for mobile
    }
    updateSpritePositionsAndScales();
    window.addEventListener('resize', updateSpritePositionsAndScales);

    // Start the animations
    showdownAnimation(app, showdownSprites);
    boltAnimation(app, boltSprite);
    flickerAnimation(app, slotsSprites, 0);
    flickerAnimation(app, [mustDropSprite], 60);
}
