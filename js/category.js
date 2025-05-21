// category.js
// Обработка клика в меню — уже есть в script.js, дублируется здесь для надёжности
document.querySelectorAll(".menu li ul li").forEach((item) => {
    item.addEventListener("click", () => {
        const category = item.textContent.trim();
        localStorage.setItem("selectedCategory", category);
        window.location.href = "category.html";
    });
});

document.addEventListener("DOMContentLoaded", () => {
    const currentPage = window.location.pathname;
    if (!currentPage.includes("category.html")) return;

    const selectedCategory = localStorage.getItem("selectedCategory");
    const title = document.getElementById("categoryTitle");
    const grid = document.getElementById("memeGrid");
    if (!selectedCategory || !grid || typeof memes === "undefined") return;

    // Load ratings from localStorage
    memes.forEach(meme => {
        const savedRating = localStorage.getItem(`meme_rating_${meme.id}`);
        if (savedRating !== null) {
            meme.rating = parseInt(savedRating);
        }
    });

    title.textContent = `Категория: ${selectedCategory}`;
    const filteredMemes = memes.filter((m) =>
        m.tags.includes(selectedCategory)
    );

    if (filteredMemes.length === 0) {
        grid.innerHTML = `<p>Нет мемов в категории "${selectedCategory}".</p>`;
        return;
    }

    // Clear grid before rendering
    grid.innerHTML = '';

    // Render cards
    filteredMemes.forEach((meme) => {
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

        card.addEventListener("click", (e) => {
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
                const newRating = Math.max(0, meme.rating - 1);
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
const closeBtn = document.querySelector(".close-button");
if (closeBtn) {
    closeBtn.addEventListener("click", () => {
        document.getElementById("memeModal").classList.add("hidden");
    });
}

window.addEventListener("click", (e) => {
    const modal = document.getElementById("memeModal");
    if (e.target === modal) {
        modal.classList.add("hidden");
    }
});
