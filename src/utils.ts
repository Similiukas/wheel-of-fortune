export function randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function convertPositionToAngle(position: { POSITION: number }) {
    const randomAddition = randomInt(5, 85);
    return { end: position.POSITION * 90 + randomAddition, randomAddition };
}

export async function getWheelPosition(): Promise<{ end: number, randomAddition: number }> {
    return new Promise(resolve => setTimeout(() => resolve(convertPositionToAngle({ POSITION: 1 })), 100)); // Simulate API delay
}
