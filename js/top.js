document.addEventListener("DOMContentLoaded", () => {
    const topMemesGrid = document.querySelector(".top-memes-grid");
    if (!topMemesGrid || typeof memes === "undefined") return;

    // Load ratings from localStorage
    memes.forEach(meme => {
        const savedRating = localStorage.getItem(`meme_rating_${meme.id}`);
        if (savedRating !== null) {
            meme.rating = parseInt(savedRating);
        }
    });

    function updateTopMemes() {
        // Sort memes by rating (descending) and take first 3
        const topMemes = memes
            .slice()
            .sort((a, b) => b.rating - a.rating)
            .slice(0, 3);

        // Arrange cards: #2, #1, #3
        if (topMemes.length === 3) {
            const [first, second, third] = topMemes;
            topMemes[0] = second; // #2 место слева
            topMemes[1] = first;  // #1 место в центре
            topMemes[2] = third;  // #3 место справа
        }

        // Clear container
        topMemesGrid.innerHTML = "";

        // Create cards for top-3 memes with positions
        topMemes.forEach((meme, index) => {
            const card = document.createElement("div");
            card.className = 'top-card';
            
            // Определяем номер места для бейджа
            const position = index === 0 ? 2 : (index === 1 ? 1 : 3);
            
            card.innerHTML = `
                <div class="badge">#${position}</div>
                <img src="${meme.src}" alt="${meme.title}">
                <div class="rating" data-id="${meme.id}">
                    <button class="minus">−</button>
                    <span class="value">${meme.rating}</span>
                    <button class="plus">+</button>
                </div>
                <h3>${meme.title}</h3>
            `;

            // Click on card - open modal
            card.addEventListener("click", (e) => {
                if (!e.target.closest('.rating')) {
                    openModal(meme);
                }
            });

            topMemesGrid.appendChild(card);
        });

        // Rating button handlers
        topMemesGrid.querySelectorAll(".rating").forEach((ratingDiv) => {
            const id = ratingDiv.getAttribute("data-id");
            const valueSpan = ratingDiv.querySelector(".value");
            const plusBtn = ratingDiv.querySelector(".plus");
            const minusBtn = ratingDiv.querySelector(".minus");

            function updateRating(newRating) {
                const meme = memes.find((m) => m.id === id);
                if (meme) {
                    meme.rating = newRating;
                    localStorage.setItem(`meme_rating_${id}`, newRating);

                    // Update rating in all instances of this meme
                    document.querySelectorAll(`.rating[data-id="${id}"] .value`).forEach(span => {
                        span.textContent = newRating;
                    });

                    // Update rating in modal if it's open
                    const modalInfo = document.getElementById("modalInfo");
                    if (modalInfo && !modalInfo.closest('.hidden')) {
                        const modalRating = modalInfo.querySelector('.star');
                        if (modalRating && modalRating.closest('.title_rating')?.querySelector('h2')?.textContent === meme.title) {
                            modalRating.textContent = newRating;
                        }
                    }

                    // Refresh top memes order
                    updateTopMemes();
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
    }

    // Initial load of top-3
    updateTopMemes();
});