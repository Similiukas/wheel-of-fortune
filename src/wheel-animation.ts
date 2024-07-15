import { Application, Assets, Sprite, Ticker } from 'pixi.js';
import { getWheelPosition, randomInt } from './utils';

let app: Application;
let wheel: Sprite;
let isSpinning = false;

export async function setUpWheel() {
    app = new Application();
    const wheelContainer = document.querySelector<HTMLImageElement>('#wheel-container')!;
    await app.init({ backgroundAlpha: 0, resizeTo: wheelContainer });
    wheelContainer.appendChild(app.canvas);

    await Assets.load('./assets/wheel.png');
    wheel = new Sprite(Assets.get('./assets/wheel.png'));
    wheel.anchor.set(0.5);
    app.stage.addChild(wheel);

    function updateSpritePositionsAndScales() {
        const scaleFactor = window.innerHeight / 1080; // Assuming 1920 is the base width for scaling
        wheel.scale.set(0.75 * scaleFactor);
        wheel.x = window.innerWidth / 2;
        wheel.y = app.renderer.height / 2;
    }
    updateSpritePositionsAndScales();
    window.addEventListener('resize', updateSpritePositionsAndScales);
}

// Calculate the needed deceleration to ensure the wheel stops at the final rotation
function calculateNeededDeceleration(currentRotation: number, finalRotation: number, currentSpeed: number) {
    const distanceRemaining = finalRotation - currentRotation;
    const timeRemaining = Math.abs(distanceRemaining / currentSpeed);
    const neededDeceleration = 1 - (0.95 / timeRemaining); // Arbitrary formula
    return neededDeceleration;
}

export async function spinWheel() {
    // Allow to spin only once
    if (isSpinning) return;
    isSpinning = true;

    const endingPositionDegrees = await getWheelPosition();

    let currentSpeed = 0.5; // Initial speed of the spin
    const totalRotations = randomInt(5, 9); // Minimum total rotations for randomness

    // Calculate the final rotation angle in radians, including total rotations and the ending position
    const finalRotationRadians = (totalRotations * 360 + endingPositionDegrees.end) * (Math.PI / 180);

    const animation = (ticker: Ticker) => {
        wheel.rotation += currentSpeed * ticker.deltaTime;

        // Adjust deceleration dynamically to ensure the wheel stops at the final rotation
        const neededDeceleration = calculateNeededDeceleration(wheel.rotation, finalRotationRadians, currentSpeed);
        currentSpeed *= neededDeceleration;

        // Stop the animation when the wheel reaches the final rotation
        if (wheel.rotation >= finalRotationRadians - 0.01 || currentSpeed < 0.0005) {
            wheel.rotation = finalRotationRadians - (endingPositionDegrees.randomAddition - 45) * (Math.PI / 180); // Adjust for any overshoot
            isSpinning = false;
            ticker.remove(animation);
        }
    };

    wheel.rotation = 0; // Reset wheel rotation before starting
    app.ticker.maxFPS = 60; // Cap the FPS to ensure consistent speed
    app.ticker.add(animation);
}
