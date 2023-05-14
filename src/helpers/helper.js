export function transformCoordinates(x, y, axisLength, imgSize) {
    const xTransform = (x / 100) * (axisLength - imgSize)
    const yTransform = (y / 100) * (axisLength - imgSize) 
    return [xTransform, yTransform]
}

export function findBounds(popularity, danceability, axisLength, imageSize) {
    const bounds = {}
    for (var key in popularity) {
        if (key in danceability) {
            const lowX = transformCoordinates(popularity[key], danceability[key], axisLength, imageSize)[0]
            const highX = transformCoordinates(popularity[key], danceability[key], axisLength, imageSize)[0] + imageSize
            const lowY = transformCoordinates(popularity[key], danceability[key], axisLength, imageSize)[1]
            const highY = transformCoordinates(popularity[key], danceability[key], axisLength, imageSize)[1] + imageSize
            bounds[key] = [lowX, highX, lowY, highY]
        }
    }
    return bounds
}