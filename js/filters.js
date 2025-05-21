// Состояние фильтров и сортировки
const filterState = {
    sort: {
        rating: 'ascending',
        title: 'ascending',
        year: 'ascending'
    },
    filters: {
        year: '',
        rating: ''
    }
};

// Функция фильтрации мемов
function filterMemes(memes) {
    return memes.filter(meme => {
        // Фильтр по году
        if (filterState.filters.year && meme.year.toString() !== filterState.filters.year) {
            return false;
        }
        // Фильтр по минимальному рейтингу
        if (filterState.filters.rating && meme.rating < parseInt(filterState.filters.rating)) {
            return false;
        }
        return true;
    });
}

// Функция сортировки мемов
function sortMemes(memes, sortBy, direction) {
    return [...memes].sort((a, b) => {
        if (sortBy === 'rating') {
            return direction === 'ascending' ? a.rating - b.rating : b.rating - a.rating;
        } else if (sortBy === 'title') {
            return direction === 'ascending' 
                ? a.title.localeCompare(b.title, 'ru') 
                : b.title.localeCompare(a.title, 'ru');
        } else if (sortBy === 'year') {
            return direction === 'ascending' 
                ? a.year - b.year 
                : b.year - a.year;
        }
        return 0;
    });
}

// Функция обновления отображения мемов
function updateMemesDisplay(sortedMemes) {
    const grid = document.querySelector('.grid');
    if (!grid) return;

    // Сохраняем текущую прокрутку
    const scrollPosition = window.pageYOffset;

    // Очищаем грид
    grid.innerHTML = '';

    if (sortedMemes.length === 0) {
        const noResults = document.createElement('div');
        noResults.className = 'no-results';
        noResults.textContent = 'Мемы не найдены';
        grid.appendChild(noResults);
        return;
    }

    // Отрисовываем отсортированные мемы
    sortedMemes.forEach((meme) => {
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

        // Добавляем обработчик клика для открытия модального окна
        card.addEventListener("click", (e) => {
            if (!e.target.closest('.rating')) {
                openModal(meme);
            }
        });

        grid.appendChild(card);
    });

    // Восстанавливаем позицию прокрутки
    window.scrollTo(0, scrollPosition);

    // Переинициализируем обработчики рейтинга
    if (typeof initializeEasterEgg === 'function') {
        document.querySelectorAll(".rating").forEach(initializeEasterEgg);
    }
}

// Функция обновления отображения с учетом всех фильтров и сортировки
function updateDisplay() {
    let filteredMemes = filterMemes(memes);
    const activeSortButton = document.querySelector('.filter-button.active');
    if (activeSortButton) {
        const sortBy = activeSortButton.dataset.sort;
        filteredMemes = sortMemes(filteredMemes, sortBy, filterState.sort[sortBy]);
    }
    updateMemesDisplay(filteredMemes);
}

// Инициализация фильтров
document.addEventListener('DOMContentLoaded', () => {
    // Инициализация кнопок сортировки
    const filterButtons = document.querySelectorAll('.filter-button');
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const sortBy = button.dataset.sort;
            const currentDirection = filterState.sort[sortBy];
            
            // Сбрасываем активное состояние всех кнопок
            filterButtons.forEach(btn => {
                btn.classList.remove('active');
                btn.classList.remove('ascending', 'descending');
            });
            
            // Обновляем состояние текущей кнопки
            button.classList.add('active');
            
            // Переключаем направление сортировки
            filterState.sort[sortBy] = currentDirection === 'ascending' ? 'descending' : 'ascending';
            button.classList.add(filterState.sort[sortBy]);
            
            updateDisplay();
        });
    });

    // Инициализация селектов фильтрации
    const yearFilter = document.getElementById('yearFilter');
    const ratingFilter = document.getElementById('ratingFilter');

    if (yearFilter) {
        yearFilter.addEventListener('change', (e) => {
            filterState.filters.year = e.target.value;
            updateDisplay();
        });
    }

    if (ratingFilter) {
        ratingFilter.addEventListener('change', (e) => {
            filterState.filters.rating = e.target.value;
            updateDisplay();
        });
    }

    // Инициализация кнопки сброса
    const resetButton = document.querySelector('.filter-reset');
    if (resetButton) {
        resetButton.addEventListener('click', () => {
            // Сброс состояния фильтров
            filterState.filters.year = '';
            filterState.filters.rating = '';
            
            // Сброс селектов
            if (yearFilter) yearFilter.value = '';
            if (ratingFilter) ratingFilter.value = '';
            
            // Сброс кнопок сортировки
            filterButtons.forEach(btn => {
                btn.classList.remove('active', 'ascending', 'descending');
            });
            
            // Обновление отображения
            updateDisplay();
        });
    }
}); 