// index.js
document.addEventListener("DOMContentLoaded", () => {
    const grid = document.getElementById("allMemesGrid");
    if (!grid || typeof memes === "undefined") return;

    // Загружаем рейтинги из localStorage
    memes.forEach((meme) => {
        const savedRating = localStorage.getItem(`memeRating_${meme.id}`);
        if (savedRating !== null) {
            meme.rating = parseInt(savedRating, 10);
        }
    });

    // Рендерим карточки
    memes.forEach((meme) => {
        const card = document.createElement("div");
        card.className = "card";

        card.innerHTML = `
            <img src="${meme.src}" alt="${meme.title}">
            <div class="rating" data-id="${meme.id}">
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

    // Обработчики кнопок +/- внутри сетки
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
});

// Функция открытия модалки
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
document.addEventListener("DOMContentLoaded", () => {
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
