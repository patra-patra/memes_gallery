// отвечает только за выбор категории и переход на category.html
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
        // для category.html — обработка ниже в category.js
        return;
    }
    // Для index.html скрипт index.js
});
