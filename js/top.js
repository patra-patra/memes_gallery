document.addEventListener("DOMContentLoaded", () => {
    const topMemesGrid = document.querySelector(".top-memes-grid");
    if (!topMemesGrid || typeof memes === "undefined") return;

    // Загружаем рейтинги из localStorage
    memes.forEach((meme) => {
        const savedRating = localStorage.getItem(`memeRating_${meme.id}`);
        if (savedRating !== null) {
            meme.rating = parseInt(savedRating, 10);
        }
    });

    // Функция для обновления топ-3 мемов
    function updateTopMemes() {
        // Сортируем мемы по рейтингу (по убыванию) и берём первые 3
        const topMemes = memes
            .slice()
            .sort((a, b) => b.rating - a.rating)
            .slice(0, 3);

        // Меняем местами первый и второй мем (теперь второй становится первым)
        if (topMemes.length > 1) {
            [topMemes[0], topMemes[1]] = [topMemes[1], topMemes[0]];
        }

        // Очищаем контейнер
        topMemesGrid.innerHTML = "";

        // Создаём карточки для топ-3 мемов с указанием позиций
        topMemes.forEach((meme, index) => {
            const card = document.createElement("div");
            // Присваиваем классы в зависимости от ранга
            card.className = `card top-${index + 1}`;
            
            // Добавляем специальный класс для центральной карточки (новый первый мем)
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
        });

        // Добавляем обработчики для кнопок рейтинга
        topMemesGrid.querySelectorAll(".rating").forEach((ratingDiv) => {
            const id = ratingDiv.getAttribute("data-id");
            const valueSpan = ratingDiv.querySelector(".value");
            const plusBtn = ratingDiv.querySelector(".plus");
            const minusBtn = ratingDiv.querySelector(".minus");

            plusBtn.addEventListener("click", () => {
                const meme = memes.find((m) => m.id == id);
                meme.rating++;
                valueSpan.textContent = meme.rating;
                localStorage.setItem(`memeRating_${id}`, meme.rating);
                updateTopMemes();
            });

            minusBtn.addEventListener("click", () => {
                const meme = memes.find((m) => m.id == id);
                meme.rating--;
                valueSpan.textContent = meme.rating;
                localStorage.setItem(`memeRating_${id}`, meme.rating);
                updateTopMemes();
            });
        });
    }

    // Первоначальная загрузка топ-3
    updateTopMemes();
});