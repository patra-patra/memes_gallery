
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

    memes.forEach((meme, index) => {
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

        grid.appendChild(card);
    });

    // Обработчики кнопок +/-
    grid.querySelectorAll(".rating").forEach((ratingDiv) => {
        const id = ratingDiv.getAttribute("data-id");
        const valueSpan = ratingDiv.querySelector(".value");
        const plusBtn = ratingDiv.querySelector(".plus");
        const minusBtn = ratingDiv.querySelector(".minus");

        plusBtn.addEventListener("click", () => {
            const meme = memes.find((m) => m.id == id);
            meme.rating++;
            valueSpan.textContent = meme.rating;
            localStorage.setItem(`memeRating_${id}`, meme.rating);
        });

        minusBtn.addEventListener("click", () => {
            const meme = memes.find((m) => m.id == id);
            meme.rating--;
            valueSpan.textContent = meme.rating;
            localStorage.setItem(`memeRating_${id}`, meme.rating);
        });
    });
});
