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
        const selectedCategory = localStorage.getItem("selectedCategory");
        const title = document.getElementById("categoryTitle");
        const grid = document.getElementById("memeGrid");

        if (!selectedCategory || !grid || typeof memes === "undefined") return;

        title.textContent = `Категория: ${selectedCategory}`;
        const filteredMemes = memes.filter((m) =>
            m.tags.includes(selectedCategory)
        );

        if (filteredMemes.length === 0) {
            grid.innerHTML = `<p>Нет мемов в категории "${selectedCategory}".</p>`;
            return;
        }

        filteredMemes.forEach((meme, index) => {
            // Проверяем сохранённый рейтинг в localStorage
            const savedRating = localStorage.getItem(`rating_${meme.title}`);
            if (savedRating !== null) {
                meme.rating = parseInt(savedRating, 10);
            }

            const card = document.createElement("div");
            card.className = "card";

            card.innerHTML = `
                <img src="${meme.src}" alt="${meme.title}">
                <div class="rating" data-index="${index}">
                    <button class="minus">−</button>
                    <span class="value">${meme.rating}</span>
                    <button class="plus">+</button>
                </div>
                <h3>${meme.title}</h3>
            `;
            grid.appendChild(card);
        });

        // Добавляем обработчики кнопок плюса и минуса
        document.querySelectorAll(".rating").forEach((ratingDiv) => {
            const index = ratingDiv.getAttribute("data-index");
            const valueSpan = ratingDiv.querySelector(".value");
            const plusBtn = ratingDiv.querySelector(".plus");
            const minusBtn = ratingDiv.querySelector(".minus");
            const meme = filteredMemes[index];

            function updateRating(newRating) {
                valueSpan.textContent = newRating;
                localStorage.setItem(`rating_${meme.title}`, newRating); // Сохраняем локально
            }

            plusBtn.addEventListener("click", () => {
                meme.rating++;
                updateRating(meme.rating);
            });

            minusBtn.addEventListener("click", () => {
                if (meme.rating > 0) {
                    meme.rating--;
                    updateRating(meme.rating);
                }
            });
        });
    }
});
