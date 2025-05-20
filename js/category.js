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

    title.textContent = `Категория: ${selectedCategory}`;
    const filteredMemes = memes.filter((m) =>
        m.tags.includes(selectedCategory)
    );

    if (filteredMemes.length === 0) {
        grid.innerHTML = `<p>Нет мемов в категории "${selectedCategory}".</p>`;
        return;
    }

    // Рендерим карточки с учётом сохранённого рейтинга
    filteredMemes.forEach((meme, index) => {
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

        // клик по карточке — открываем модалку
        card.addEventListener("click", () => {
            openModal(meme);
        });

        grid.appendChild(card);
    });

    // Обработчики +/- для каждой карточки
    document.querySelectorAll(".rating").forEach((ratingDiv) => {
        const index = parseInt(ratingDiv.getAttribute("data-index"), 10);
        const valueSpan = ratingDiv.querySelector(".value");
        const plusBtn = ratingDiv.querySelector(".plus");
        const minusBtn = ratingDiv.querySelector(".minus");
        const meme = filteredMemes[index];

        function updateRating(newRating) {
            valueSpan.textContent = newRating;
            localStorage.setItem(`rating_${meme.title}`, newRating);
        }

        plusBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            meme.rating++;
            updateRating(meme.rating);
        });

        minusBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            if (meme.rating > 0) {
                meme.rating--;
                updateRating(meme.rating);
            }
        });
    });

    // Функция открытия модалки (повторяем из index.js)
    function openModal(meme) {
        const modal = document.getElementById("memeModal");
        const modalImage = document.getElementById("modalImage");
        const modalInfo = document.getElementById("modalInfo");

        modalImage.src = meme.src;
        modalImage.alt = meme.title;
        modalInfo.innerHTML = `
            <h2>${meme.title}</h2>
            <p><strong>Рейтинг:</strong> ${meme.rating}</p>
            <p><strong>Теги:</strong> ${meme.tags.join(', ')}</p>
            <p><strong>Описание:</strong> ${meme.description || 'Описание отсутствует.'}</p>
        `;

        modal.classList.remove("hidden");
    }

    // Закрытие модалки
    const closeBtn = document.querySelector(".close-button");
    closeBtn.addEventListener("click", () => {
        document.getElementById("memeModal").classList.add("hidden");
    });

    window.addEventListener("click", (e) => {
        const modal = document.getElementById("memeModal");
        if (e.target === modal) {
            modal.classList.add("hidden");
        }
    });
});
