function hexToRgb(hex) {
    hex = hex.startsWith('#') ? hex.slice(1) : hex;

    if (hex.length === 3) {
        hex = hex
            .split('')
            .map((char) => char + char)
            .join('');
    }

    if (hex.length !== 6) {
        throw new Error('Invalid hex color code');
    }

    const bigint = parseInt(hex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;

    return [r, g, b];
}

function fillColors(colors, desiredLength) {
    let filledColors = [];
    for (let i = 0; i < desiredLength; i++) {
        filledColors.push(colors[i % colors.length]);
    }
    return filledColors;
}

function generateRandomColor(reservedColors) {
    function getRandomInt(max) {
        return Math.floor(Math.random() * max);
    }
    let color;
    do {
        color = [getRandomInt(256), getRandomInt(256), getRandomInt(256)];
    } while (reservedColors.has(color));

    return color;
}

module.exports = {
    hexToRgb,
    fillColors,
    generateRandomColor,
};
