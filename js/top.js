document.addEventListener("DOMContentLoaded", async () => {
    const topMemesGrid = document.querySelector(".top-memes-grid");
    if (!topMemesGrid || typeof memes === "undefined") return;

    // Initialize ratings from database
    await RatingService.initializeMemeRatings(memes);

    // Function to update top-3 memes
    function updateTopMemes() {
        // Sort memes by rating (descending) and take first 3
        const topMemes = memes
            .slice()
            .sort((a, b) => b.rating - a.rating)
            .slice(0, 3);

        // Swap first and second meme (second becomes first)
        if (topMemes.length > 1) {
            [topMemes[0], topMemes[1]] = [topMemes[1], topMemes[0]];
        }

        // Clear container
        topMemesGrid.innerHTML = "";

        // Create cards for top-3 memes with positions
        topMemes.forEach((meme, index) => {
            const card = document.createElement("div");
            card.className = `card top-${index + 1}`;
            
            if (index === 0) {
                card.classList.add("center-card");
            }

            card.innerHTML = `
                <div class="badge">#${index + 1}</div>
                <img src="${meme.src}" alt="${meme.title}">
                <div class="rating" data-id="${meme.id}">
                    <button class="minus">−</button>
                    <span class="value">${meme.rating}</span>
                    <button class="plus">+</button>
                </div>
                <h3>${meme.title}</h3>
            `;

            topMemesGrid.appendChild(card);

            // Subscribe to rating changes
            RatingService.onRatingChange(meme.id, (newRating) => {
                const ratingSpan = card.querySelector('.value');
                if (ratingSpan) {
                    ratingSpan.textContent = newRating;
                    meme.rating = newRating;
                    // Update top memes when rating changes
                    updateTopMemes();
                }
            });
        });

        // Add rating button handlers
        topMemesGrid.querySelectorAll(".rating").forEach((ratingDiv) => {
            const id = ratingDiv.getAttribute("data-id");
            const valueSpan = ratingDiv.querySelector(".value");
            const plusBtn = ratingDiv.querySelector(".plus");
            const minusBtn = ratingDiv.querySelector(".minus");

            plusBtn.addEventListener("click", async () => {
                const meme = memes.find((m) => m.id === id);
                if (meme) {
                    const newRating = meme.rating + 1;
                    const success = await RatingService.updateRating(id, newRating);
                    if (success) {
                        meme.rating = newRating;
                        valueSpan.textContent = newRating;
                        updateTopMemes();
                    }
                }
            });

            minusBtn.addEventListener("click", async () => {
                const meme = memes.find((m) => m.id === id);
                if (meme) {
                    const newRating = meme.rating - 1;
                    const success = await RatingService.updateRating(id, newRating);
                    if (success) {
                        meme.rating = newRating;
                        valueSpan.textContent = newRating;
                        updateTopMemes();
                    }
                }
            });
        });
    }

    // Initial load of top-3
    updateTopMemes();
});