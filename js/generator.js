// Meme templates
const memeTemplates = [
    { id: 'template1', src: 'img/gen/gr.jpg', name: 'Корова думает' },
    { id: 'template2', src: 'img/gen/fnaf.jpg"', name: 'Девочка' },
    { id: 'template3', src: 'img/gen/girl.jpg', name: 'Лев в тачке' },
    { id: 'template4', src: 'img/gen/travel.jpg', name: 'Сон собаки' },
    { id: 'template5', src: 'img/gen/turt.jpg', name: 'Тархун-комната' }
 
];

// DOM Elements
const canvas = document.getElementById('memeCanvas');
const ctx = canvas.getContext('2d');
const templateGrid = document.getElementById('templateGrid');
const topTextInput = document.getElementById('topText');
const bottomTextInput = document.getElementById('bottomText');
const topTextPosition = document.getElementById('topTextPosition');
const bottomTextPosition = document.getElementById('bottomTextPosition');
const fontSizeInput = document.getElementById('fontSize');
const fontFamilySelect = document.getElementById('fontFamily');
const textColorInput = document.getElementById('textColor');
const strokeColorInput = document.getElementById('strokeColor');
const strokeWidthInput = document.getElementById('strokeWidth');
const enableStrokeCheckbox = document.getElementById('enableStroke');
const downloadBtn = document.getElementById('downloadBtn');
const imageUpload = document.getElementById('imageUpload');

let currentImage = null;
let selectedTemplate = null;

// Draw meme on canvas
function drawMeme() {
    if (!currentImage) return;

    // Adjust canvas size to match image aspect ratio
    const maxWidth = 600;
    const maxHeight = 600;
    const ratio = Math.min(maxWidth / currentImage.width, maxHeight / currentImage.height);
    
    canvas.width = currentImage.width * ratio;
    canvas.height = currentImage.height * ratio;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw image to fill the entire canvas
    ctx.drawImage(currentImage, 0, 0, canvas.width, canvas.height);

    // Set text style
    const fontSize = parseInt(fontSizeInput.value);
    const fontFamily = fontFamilySelect.value;
    ctx.font = `bold ${fontSize}px ${fontFamily}`;
    ctx.textAlign = 'center';
    ctx.fillStyle = textColorInput.value;
    
    if (enableStrokeCheckbox.checked) {
        ctx.strokeStyle = strokeColorInput.value;
        ctx.lineWidth = parseInt(strokeWidthInput.value);
    }

    // Calculate text positions based on slider values (convert from percentage to pixels)
    const topY = (parseInt(topTextPosition.value) / 100) * canvas.height;
    const bottomY = (parseInt(bottomTextPosition.value) / 100) * canvas.height;

    // Draw top text
    const topText = topTextInput.value;
    drawText(topText, canvas.width / 2, topY);

    // Draw bottom text
    const bottomText = bottomTextInput.value;
    drawText(bottomText, canvas.width / 2, bottomY);
}

// Draw text with optional stroke
function drawText(text, x, y) {
    if (enableStrokeCheckbox.checked) {
        ctx.strokeText(text, x, y);
    }
    ctx.fillText(text, x, y);
}

// Event listeners
[
    topTextInput, 
    bottomTextInput,
    topTextPosition,
    bottomTextPosition,
    fontSizeInput, 
    fontFamilySelect, 
    textColorInput, 
    strokeColorInput,
    strokeWidthInput,
    enableStrokeCheckbox
].forEach(input => {
    input.addEventListener('input', drawMeme);
});

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

// Download functionality
downloadBtn.addEventListener('click', () => {
    try {
        // Create download link
        const link = document.createElement('a');
        link.download = 'meme.png';
        
        // Convert to blob for better compatibility
        canvas.toBlob((blob) => {
            link.href = URL.createObjectURL(blob);
            link.click();
            
            // Clean up
            URL.revokeObjectURL(link.href);
        }, 'image/png');
    } catch (error) {
        console.error('Ошибка при сохранении:', error);
        alert('Произошла ошибка при сохранении мема. Попробуйте еще раз.');
    }
});

// Initialize
loadTemplates(); 