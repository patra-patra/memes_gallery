// JavaScript source code

function searchMemes(query) {
    if (!query) {
        return memes;
    }

    query = query.toLowerCase();
    return memes.filter(meme => {
        const titleMatch = meme.title.toLowerCase().includes(query);
        const descriptionMatch = meme.description.toLowerCase().includes(query);
        const tagsMatch = meme.tags.some(tag => tag.toLowerCase().includes(query));
        
        return titleMatch || descriptionMatch || tagsMatch;
    });
}

function renderSearchResults(results) {
    const grid = document.getElementById("allMemesGrid");
    grid.innerHTML = ''; // Clear current content

    if (results.length === 0) {
        grid.innerHTML = '<div class="no-results">Мемы не найдены 😢</div>';
        return;
    }

    results.forEach((meme) => {
        const card = document.createElement("div");
        card.className = "card";

        card.innerHTML = `
            <img src="${meme.src}" alt="${meme.title}">
            <div class="rating" data-id="${meme.id}">
                <button class="minus">−</button>
                <span class="value star">${meme.rating}</span>
                <button class="plus">+</button>
            </div>
            <h3>${meme.title}</h3>
        `;

        card.addEventListener("click", () => {
            openModal(meme);
        });

        grid.appendChild(card);
    });

    // Reinitialize rating buttons
    initializeRatingButtons();
}

function initializeRatingButtons() {
    const grid = document.getElementById("allMemesGrid");
    grid.querySelectorAll(".rating").forEach((ratingDiv) => {
        const id = ratingDiv.getAttribute("data-id");
        const valueSpan = ratingDiv.querySelector(".value");
        const plusBtn = ratingDiv.querySelector(".plus");
        const minusBtn = ratingDiv.querySelector(".minus");

        plusBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            const meme = memes.find((m) => m.id == id);
            meme.rating++;
            valueSpan.textContent = meme.rating;
            localStorage.setItem(`memeRating_${id}`, meme.rating);
        });

        minusBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            const meme = memes.find((m) => m.id == id);
            meme.rating--;
            valueSpan.textContent = meme.rating;
            localStorage.setItem(`memeRating_${id}`, meme.rating);
        });
    });
}

// Initialize search functionality
document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("searchInput");
    const searchButton = document.getElementById("searchButton");

    // Search on button click
    searchButton.addEventListener("click", () => {
        const query = searchInput.value.trim();
        const results = searchMemes(query);
        renderSearchResults(results);
    });

    // Search on Enter key press
    searchInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            const query = searchInput.value.trim();
            const results = searchMemes(query);
            renderSearchResults(results);
        }
    });

    // Live search with debounce
    let debounceTimer;
    searchInput.addEventListener("input", () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            const query = searchInput.value.trim();
            const results = searchMemes(query);
            renderSearchResults(results);
        }, 300);
    });
});
