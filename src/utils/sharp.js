const sharp = require('sharp');

module.exports = {
    isPortrait: async (imagePath) => {
        try {
            const metadata = await sharp(imagePath).metadata();
            return metadata.height > metadata.width;
        } catch (error) {
            console.error('Error:', error);
            return false;
        }
    }
}