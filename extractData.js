const fs = require('fs');
const path = require('path');

const imgDir = path.join(process.cwd(), 'public', 'img');
const dataDir = path.join(process.cwd(), 'src', 'data');
const outputFile = path.join(dataDir, 'portfolioData.json');

// Ensure data directory exists
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

const colors = [
    { color: '#C4B5A8', accent: '#8B7A6F' },
    { color: '#B8A99A', accent: '#7A6B5F' },
    { color: '#A89888', accent: '#6B5C50' },
    { color: '#968880', accent: '#5E5048' },
    { color: '#847770', accent: '#4E4540' },
    { color: '#735E53', accent: '#4A3B33' },
    { color: '#6A7B82', accent: '#3F4E54' },
    { color: '#7E8A7A', accent: '#4B5748' },
    { color: '#8E7B7B', accent: '#5B4A4A' }
];

try {
    const folders = fs.readdirSync(imgDir, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);

    const portfolioData = folders.map((folder, index) => {
        const folderPath = path.join(imgDir, folder);

        let files = [];
        try {
            files = fs.readdirSync(folderPath)
                .filter(file => /\.(jpg|jpeg|png|webp|gif)$/i.test(file));
        } catch (e) {
            console.error(`Could not read directory ${folderPath}`);
        }

        const title = folder.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        const colorScheme = colors[index % colors.length];

        // For demo purposes, we assign default tags based on the title
        let software = ['3ds Max', 'Corona Renderer'];
        if (title.toLowerCase().includes('animate') || title.toLowerCase().includes('unreal')) {
            software = ['Unreal Engine', 'Lumen'];
        }

        return {
            id: index + 1,
            title: title,
            category: 'Architecture / Interior',
            software: software,
            desc: `A stunning collection of renders for the ${title}. Featuring detailed modeling, realistic lighting, and premium materials carefully selected to create an immersive photorealistic environment.`,
            color: colorScheme.color,
            accent: colorScheme.accent,
            images: files.map(file => `/img/${folder}/${file}`),
            folder: folder
        };
    });

    // Sort by id or title if needed. We'll leave as is.
    fs.writeFileSync(outputFile, JSON.stringify(portfolioData, null, 2));
    console.log(`Successfully generated portfolioData.json with ${portfolioData.length} projects.`);

} catch (err) {
    console.error('Error generating portfolio data:', err);
}
