export function randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function convertPositionToAngle(position: { POSITION: number }) {
    const randomAddition = randomInt(5, 85);
    return { end: position.POSITION * 90 + randomAddition, randomAddition };
}

export async function getWheelPosition(): Promise<{ end: number, randomAddition: number }> {
    try {
        const response = await fetch('http://localhost:3000/wheel');
        const position = await response.json();
        return convertPositionToAngle(position);
    } catch (error) {
        console.error('Failed to fetch wheel position, using random position instead\nPlease make sure the server is running');
        return convertPositionToAngle({ POSITION: randomInt(0, 3) });
    }
}
