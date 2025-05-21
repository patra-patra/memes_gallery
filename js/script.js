// отвечает только за выбор категории и переход на category.html
document.querySelectorAll(".menu li ul li").forEach((item) => {
    item.addEventListener("click", () => {
        const category = item.textContent.trim();
        localStorage.setItem("selectedCategory", category);
        window.location.href = "category.html";
    });
});

document.addEventListener("DOMContentLoaded", () => {
    const currentPage = window.location.pathname;
    if (currentPage.includes("category.html")) {
        // для category.html — обработка ниже в category.js
        return;
    }
    // Для index.html скрипт index.js
});

function openModal(meme) {
    const modal = document.getElementById("memeModal");
    const modalImage = document.getElementById("modalImage");
    const modalInfo = document.getElementById("modalInfo");

    if (!modal || !modalImage || !modalInfo) {
        console.error("Modal elements not found");
        return;
    }

    modalImage.src = meme.src;
    modalImage.alt = meme.title;
    
    const tagsHtml = meme.tags.map(tag => `
        <a href="category.html" class="modal-tag" onclick="localStorage.setItem('selectedCategory', '${tag}')">
            <span>${tag}</span>
        </a>
    `).join('');
    
    modalInfo.innerHTML = `
        <div class='title_rating'>
            <h2>${meme.title}</h2>
            <p class="star">${meme.rating}</p>
        </div>
        <p><strong>Год:</strong> ${meme.year || 'Не указано'}</p>
        <div class="modal-tags">${tagsHtml}</div>
        <p><strong>Описание:</strong> ${meme.description || 'Описание отсутствует.'}</p>
        <p><strong>Источник:</strong> <a href="${meme.source}" target="_blank">${meme.source}</a></p>
    `;

    modal.classList.remove("hidden");
}

// Easter egg functionality
const clickCounts = {};
const requiredClicks = 10;

function initializeEasterEgg(ratingDiv) {
    const id = ratingDiv.getAttribute("data-id");
    const card = ratingDiv.closest('.card');
    
    if (!clickCounts[id]) {
        clickCounts[id] = 0;
    }

    ratingDiv.addEventListener('click', () => {
        clickCounts[id]++;
        
        if (clickCounts[id] === requiredClicks) {
            // Add dancing animation
            card.classList.add('dancing-container');
            card.querySelector('img').classList.add('dancing');
            
            // Stop after 5 seconds
            setTimeout(() => {
                card.classList.remove('dancing-container');
                card.querySelector('img').classList.remove('dancing');
                clickCounts[id] = 0;
            }, 5000);
        }
    });
}

// Initialize easter egg for all rating divs
document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".rating").forEach(initializeEasterEgg);
});

// Easter egg - Nyan Cat Mode
let lastHoveredCard = null;

document.addEventListener('mouseover', (e) => {
    const card = e.target.closest('.card');
    if (card) {
        lastHoveredCard = card;
    }
});

document.addEventListener('mouseout', (e) => {
    const card = e.target.closest('.card');
    if (card) {
        lastHoveredCard = null;
    }
});

document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && lastHoveredCard) {
        e.preventDefault(); // Prevent page scroll
        
        // Store original image
        const img = lastHoveredCard.querySelector('img');
        const originalSrc = img.src;
        
        // Apply Nyan Cat mode
        lastHoveredCard.classList.add('nyan-mode');
        img.src = 'img/nyan-cat.gif';
        
        // Revert back after 3 seconds
        setTimeout(() => {
            lastHoveredCard.classList.remove('nyan-mode');
            img.src = originalSrc;
        }, 3000);
    }
});

// Disco Mode Easter Egg
let discoMode = false;
let discoBall = null;

document.addEventListener('keydown', (e) => {
    if (e.code === 'KeyD' && !discoMode) {
        discoMode = true;
        
        // Add disco ball
        discoBall = document.createElement('div');
        discoBall.className = 'disco-ball';
        discoBall.textContent = '💿';
        document.body.appendChild(discoBall);
        
        // Add disco mode to grid
        const grid = document.querySelector('.grid');
        if (grid) {
            grid.classList.add('disco-mode');
        }
        
        // Auto-disable after 5 seconds
        setTimeout(() => {
            if (discoBall) {
                discoBall.remove();
                discoBall = null;
            }
            if (grid) {
                grid.classList.remove('disco-mode');
            }
            discoMode = false;
        }, 5000);
    }
});

// Nyan Cat Easter Egg
const searchInput = document.getElementById('searchInput');
let nyanCatTimeout = null;

function createNyanCat() {
    const nyanCat = document.createElement('div');
    nyanCat.className = 'nyan-cat';
    
    const img = document.createElement('img');
    img.src = 'img/nyan-cat.gif';
    img.alt = 'Nyan Cat';
    
    nyanCat.appendChild(img);
    document.body.appendChild(nyanCat);
    
    // Remove the element after animation
    nyanCat.addEventListener('animationend', () => {
        nyanCat.remove();
    });
}

if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        const searchText = e.target.value.toLowerCase().trim();
        
        // Clear previous timeout
        if (nyanCatTimeout) {
            clearTimeout(nyanCatTimeout);
        }
        
        // Check for secret word after a short delay
        nyanCatTimeout = setTimeout(() => {
            if (searchText === 'nyan cat') {
                createNyanCat();
            }
        }, 500);
    });
}
