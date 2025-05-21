// Meme templates
const memeTemplates = [
    { id: 'template1', src: 'img/cow.jpg', name: 'Корова думает' },
    { id: 'template2', src: 'img/spring.jpg', name: 'Весна 2028' },
    { id: 'template3', src: 'img/lion.jpg', name: 'Лев в тачке' },
    { id: 'template4', src: 'img/dog_fish.jpg', name: 'Сон собаки' },
    { id: 'template5', src: 'img/tarhun.jpg', name: 'Тархун-комната' },
    { id: 'template6', src: 'img/yagami_lite.jpg', name: 'Тест' },
    { id: 'template7', src: 'img/anime_humor.jpg', name: 'Аниме юмор' },
    { id: 'template8', src: 'img/cat_shrimp.jpg', name: 'Кот креветка' }
];

// DOM Elements
const canvas = document.getElementById('memeCanvas');
const ctx = canvas.getContext('2d');
const templateGrid = document.getElementById('templateGrid');
const topTextInput = document.getElementById('topText');
const bottomTextInput = document.getElementById('bottomText');
const fontSizeInput = document.getElementById('fontSize');
const fontFamilySelect = document.getElementById('fontFamily');
const textColorInput = document.getElementById('textColor');
const strokeColorInput = document.getElementById('strokeColor');
const downloadBtn = document.getElementById('downloadBtn');
const imageUpload = document.getElementById('imageUpload');

let currentImage = null;
let selectedTemplate = null;

// Initialize canvas size
canvas.width = 600;
canvas.height = 600;

// Load templates
function loadTemplates() {
    templateGrid.innerHTML = '';
    memeTemplates.forEach(template => {
        const templateItem = document.createElement('div');
        templateItem.className = 'template-item';
        templateItem.innerHTML = `<img src="${template.src}" alt="${template.name}">`;
        
        templateItem.addEventListener('click', () => {
            document.querySelectorAll('.template-item').forEach(item => item.classList.remove('selected'));
            templateItem.classList.add('selected');
            loadImage(template);
        });
        
        templateGrid.appendChild(templateItem);
    });
}

// Handle custom image upload
imageUpload.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        // Deselect any selected template
        document.querySelectorAll('.template-item').forEach(item => item.classList.remove('selected'));
        
        // Create a custom template object
        const customTemplate = {
            id: 'custom',
            src: URL.createObjectURL(file),
            name: 'Пользовательское изображение'
        };
        
        loadImage(customTemplate);
    }
});

// Load image into canvas
function loadImage(template) {
    selectedTemplate = template;
    currentImage = new Image();
    currentImage.onload = () => {
        drawMeme();
    };
    currentImage.src = template.src;
}

// Draw meme on canvas
function drawMeme() {
    if (!currentImage) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Calculate image dimensions while maintaining aspect ratio
    const ratio = Math.min(canvas.width / currentImage.width, canvas.height / currentImage.height);
    const width = currentImage.width * ratio;
    const height = currentImage.height * ratio;
    const x = (canvas.width - width) / 2;
    const y = (canvas.height - height) / 2;

    // Draw image
    ctx.drawImage(currentImage, x, y, width, height);

    // Set text style
    const fontSize = parseInt(fontSizeInput.value);
    const fontFamily = fontFamilySelect.value;
    ctx.font = `bold ${fontSize}px ${fontFamily}`;
    ctx.textAlign = 'center';
    ctx.strokeStyle = strokeColorInput.value;
    ctx.fillStyle = textColorInput.value;
    ctx.lineWidth = fontSize / 15;

    // Draw top text
    const topText = topTextInput.value.toUpperCase();
    drawText(topText, canvas.width / 2, y + fontSize + 10);

    // Draw bottom text
    const bottomText = bottomTextInput.value.toUpperCase();
    drawText(bottomText, canvas.width / 2, y + height - 10);
}

// Draw text with stroke
function drawText(text, x, y) {
    ctx.strokeText(text, x, y);
    ctx.fillText(text, x, y);
}

// Event listeners
[topTextInput, bottomTextInput, fontSizeInput, fontFamilySelect, textColorInput, strokeColorInput].forEach(input => {
    input.addEventListener('input', drawMeme);
});

// Download functionality
downloadBtn.addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = 'meme.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
});

// Initialize
loadTemplates(); 