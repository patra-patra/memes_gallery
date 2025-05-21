// category.js

// Функция для определения категории и подкатегории по тегу
function getCategoryAndSubcategory(tag) {
    const categoryMap = {
        'Коты': { category: 'animals', subcategory: 'cats' },
        'Кошки': { category: 'animals', subcategory: 'cats' },
        'Собаки': { category: 'animals', subcategory: 'dogs' },
        'Другие': { category: 'animals', subcategory: 'other' },
        'Ирония': { category: 'abstract', subcategory: 'irony' },
        'Постирония': { category: 'abstract', subcategory: 'postirony' },
        'Абсурд': { category: 'abstract', subcategory: 'absurd' },
        'Аниме': { category: 'local', subcategory: 'anime' },
        'Игры': { category: 'local', subcategory: 'games' },
        'IT-мемы': { category: 'local', subcategory: 'it' },
        'Студенческие': { category: 'life', subcategory: 'student' },
        'Бытовые': { category: 'life', subcategory: 'household' },
        'Офисные': { category: 'life', subcategory: 'office' },
        'Региональные': { category: 'life', subcategory: 'regional' },
        'Животные': { category: 'animals' }
    };

    return categoryMap[tag] || null;
}

document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');
    const subcategory = urlParams.get('subcategory');

    // Объект с названиями категорий
    const categoryNames = {
        animals: {
            name: 'Животные',
            subcategories: {
                cats: 'Коты',
                dogs: 'Собаки',
                other: 'Другие'
            }
        },
        abstract: {
            name: 'Абстрактные',
            subcategories: {
                irony: 'Ирония',
                postirony: 'Постирония',
                absurd: 'Абсурд'
            }
        },
        local: {
            name: 'Локальные',
            subcategories: {
                anime: 'Аниме',
                games: 'Игры',
                it: 'IT-мемы'
            }
        },
        life: {
            name: 'Жизненные',
            subcategories: {
                student: 'Студенческие',
                household: 'Бытовые',
                office: 'Офисные',
                regional: 'Региональные'
            }
        }
    };

    // Обновляем заголовок страницы и хлебные крошки
    const categoryTitle = document.getElementById('categoryTitle');
    const categoryBreadcrumb = document.getElementById('categoryBreadcrumb');

    if (category && categoryNames[category]) {
        if (subcategory && categoryNames[category].subcategories[subcategory]) {
            // Если есть подкатегория
            categoryTitle.textContent = categoryNames[category].subcategories[subcategory];
            categoryBreadcrumb.innerHTML = `
                <a href="category.html?category=${category}" class="breadcrumb-category">${categoryNames[category].name}</a>
                <span class="breadcrumb-separator">›</span>
                <span class="breadcrumb-current">${categoryNames[category].subcategories[subcategory]}</span>
            `;
        } else {
            // Если только основная категория
            categoryTitle.textContent = categoryNames[category].name;
            categoryBreadcrumb.innerHTML = `
                <span class="breadcrumb-current">${categoryNames[category].name}</span>
            `;
        }
    } else {
        categoryTitle.textContent = 'Категория не найдена';
        categoryBreadcrumb.innerHTML = `
            <span class="breadcrumb-current">Категория не найдена</span>
        `;
    }

    // Фильтруем мемы по категории и подкатегории
    function filterMemesByCategory(memes) {
        if (!category || !categoryNames[category]) return [];

        const categoryName = categoryNames[category].name;
        const subcategoryName = subcategory ? categoryNames[category].subcategories[subcategory] : null;

        // Объект с альтернативными названиями тегов
        const tagAliases = {
            'cats': ['Коты', 'Кошки']
        };

        return memes.filter(meme => {
            if (!meme.tags) return false;
            
            if (subcategoryName) {
                // Если выбрана подкатегория
                if (subcategory === 'cats') {
                    // Для котов проверяем оба варианта тегов
                    return tagAliases.cats.some(tag => meme.tags.includes(tag));
                }
                // Для остальных подкатегорий
                return meme.tags.includes(subcategoryName);
            } else {
                // Если выбрана основная категория
                const subcategoryNames = Object.values(categoryNames[category].subcategories);
                
                // Проверяем основную категорию
                if (meme.tags.includes(categoryName)) return true;
                
                // Проверяем подкатегории с учетом альтернативных названий
                return subcategoryNames.some(subcat => {
                    if (subcat === 'Коты') {
                        return tagAliases.cats.some(tag => meme.tags.includes(tag));
                    }
                    return meme.tags.includes(subcat);
                });
            }
        });
    }

    // Отображаем мемы
    const grid = document.getElementById('memeGrid');
    const filteredMemes = filterMemesByCategory(memes);

    if (filteredMemes.length === 0) {
        grid.innerHTML = '<div class="no-results">В этой категории пока нет мемов</div>';
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

    // Инициализируем обработчики рейтинга
    if (typeof initializeEasterEgg === 'function') {
        document.querySelectorAll('.rating').forEach(initializeEasterEgg);
    }
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
    
    const tagsHtml = meme.tags.map(tag => {
        const categoryInfo = getCategoryAndSubcategory(tag);
        if (categoryInfo) {
            const url = categoryInfo.subcategory 
                ? `category.html?category=${categoryInfo.category}&subcategory=${categoryInfo.subcategory}`
                : `category.html?category=${categoryInfo.category}`;
            return `<a href="${url}" class="modal-tag"><span>${tag}</span></a>`;
        }
        return `<span class="modal-tag"><span>${tag}</span></span>`;
    }).join('');
    
    modalInfo.innerHTML = `
        <div class='title_rating'>
            <h2>${meme.title}</h2>
            <p class="star">${meme.rating}</p>
        </div>
        <p><strong>Год:</strong> ${meme.year || 'Не указано'}</p>
        <div class="modal-tags">${tagsHtml}</div>
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
