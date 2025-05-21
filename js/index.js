// index.js
document.addEventListener("DOMContentLoaded", () => {
    const grid = document.getElementById("allMemesGrid");
    if (!grid || typeof memes === "undefined") {
        console.error("Grid element not found or memes not defined");
        return;
    }

    // Load ratings from localStorage
    memes.forEach(meme => {
        const savedRating = localStorage.getItem(`meme_rating_${meme.id}`);
        if (savedRating !== null) {
            meme.rating = parseInt(savedRating);
        }
    });

    // Clear existing content
    grid.innerHTML = '';

    // Render cards
    memes.forEach((meme) => {
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

        // Click on card - open modal
        card.addEventListener("click", (e) => {
            // Don't open modal if clicking rating buttons
            if (!e.target.closest('.rating')) {
                openModal(meme);
            }
        });

        grid.appendChild(card);
    });

    // Rating button handlers
    grid.querySelectorAll(".rating").forEach((ratingDiv) => {
        const id = ratingDiv.getAttribute("data-id");
        const valueSpan = ratingDiv.querySelector(".value");
        const plusBtn = ratingDiv.querySelector(".plus");
        const minusBtn = ratingDiv.querySelector(".minus");

        function updateRating(newRating) {
            const meme = memes.find((m) => m.id === id);
            if (meme) {
                meme.rating = newRating;
                valueSpan.textContent = newRating;
                localStorage.setItem(`meme_rating_${id}`, newRating);

                // Update rating in all other open cards with the same meme
                document.querySelectorAll(`.rating[data-id="${id}"] .value`).forEach(span => {
                    if (span !== valueSpan) {
                        span.textContent = newRating;
                    }
                });

                // Update rating in modal if it's open
                const modalInfo = document.getElementById("modalInfo");
                if (modalInfo && !modalInfo.closest('.hidden')) {
                    const modalRating = modalInfo.querySelector('.star');
                    if (modalRating && modalRating.closest('.title_rating')?.querySelector('h2')?.textContent === meme.title) {
                        modalRating.textContent = newRating;
                    }
                }
            }
        }

        plusBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            const meme = memes.find((m) => m.id === id);
            if (meme) {
                updateRating(meme.rating + 1);
            }
        });

        minusBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            const meme = memes.find((m) => m.id === id);
            if (meme) {
                const newRating = Math.max(0, meme.rating - 1); // Prevent negative ratings
                updateRating(newRating);
            }
        });
    });
});

// Modal opening function
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
    modalInfo.innerHTML = `
        <div class='title_rating'>
            <h2>${meme.title}</h2>
            <p class="star">${meme.rating}</p>
        </div>
        <p><strong>Год:</strong> ${meme.year || 'Не указано'}</p>
        <p><strong>Теги:</strong> ${meme.tags.join(', ')}</p>
        <p><strong>Описание:</strong> ${meme.description || 'Описание отсутствует.'}</p>
        <p><strong>Источник:</strong> <a href="${meme.source}" target="_blank">${meme.source}</a></p>
    `;

    modal.classList.remove("hidden");
}

// Modal closing
document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("memeModal");
    const closeBtn = document.querySelector(".close-button");

    if (closeBtn) {
        closeBtn.addEventListener("click", () => {
            modal.classList.add("hidden");
        });
    }

    if (modal) {
        window.addEventListener("click", (e) => {
            if (e.target === modal) {
                modal.classList.add("hidden");
            }
        });
    }
});
