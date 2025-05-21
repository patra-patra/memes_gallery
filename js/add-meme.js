document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('addMemeForm');
    const imageInput = document.getElementById('memeImage');
    const imagePreview = document.getElementById('imagePreview');
    const previewImg = document.getElementById('previewImg');
    const uploadIcon = document.querySelector('.upload-icon');
    const uploadText = document.querySelector('.upload-text');
    const tagsInput = document.getElementById('memeTags');
    const tagsContainer = document.getElementById('tagsContainer');
    const notification = document.getElementById('notification');
    const notificationMessage = document.querySelector('.notification-message');
    const notificationClose = document.querySelector('.notification-close');

    // Обработка загрузки изображения
    imageInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                previewImg.src = e.target.result;
                previewImg.style.display = 'block';
                uploadIcon.style.display = 'none';
                uploadText.style.display = 'none';
            };
            reader.readAsDataURL(file);
        }
    });

    // Drag and drop для изображения
    imagePreview.addEventListener('dragover', (e) => {
        e.preventDefault();
        imagePreview.style.borderColor = 'var(--primary-color)';
        imagePreview.style.background = 'white';
    });

    imagePreview.addEventListener('dragleave', (e) => {
        e.preventDefault();
        imagePreview.style.borderColor = 'var(--border)';
        imagePreview.style.background = 'var(--bg-light)';
    });

    imagePreview.addEventListener('drop', (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            imageInput.files = e.dataTransfer.files;
            const event = new Event('change');
            imageInput.dispatchEvent(event);
        }
        imagePreview.style.borderColor = 'var(--border)';
        imagePreview.style.background = 'var(--bg-light)';
    });

    // Обработка тегов
    tagsInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            const tag = tagsInput.value.trim();
            if (tag) {
                addTag(tag);
                tagsInput.value = '';
            }
        }
    });

    function addTag(text) {
        const tag = document.createElement('div');
        tag.className = 'tag';
        tag.innerHTML = `
            ${text}
            <span class="tag-remove">&times;</span>
        `;
        
        tag.querySelector('.tag-remove').addEventListener('click', () => {
            tag.remove();
        });
        
        tagsContainer.appendChild(tag);
    }

    // Обработка отправки формы
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Собираем данные формы
        const formData = new FormData(form);
        
        // Добавляем теги
        const tags = Array.from(tagsContainer.querySelectorAll('.tag'))
            .map(tag => tag.textContent.trim().slice(0, -1));
        formData.append('tags', JSON.stringify(tags));

        // Добавляем категории
        const categories = Array.from(form.querySelectorAll('input[name="category"]:checked'))
            .map(input => input.value);
        formData.append('categories', JSON.stringify(categories));

        try {
            // Здесь будет отправка на сервер
            // const response = await fetch('/api/memes', {
            //     method: 'POST',
            //     body: formData
            // });

            // Временная имитация отправки
            await new Promise(resolve => setTimeout(resolve, 1000));

            showNotification('Мем успешно отправлен на модерацию!');
            form.reset();
            previewImg.style.display = 'none';
            uploadIcon.style.display = 'block';
            uploadText.style.display = 'block';
            tagsContainer.innerHTML = '';
        } catch (error) {
            showNotification('Произошла ошибка при отправке. Попробуйте позже.', 'error');
        }
    });

    // Управление уведомлениями
    function showNotification(message, type = 'success') {
        notificationMessage.textContent = message;
        notification.classList.remove('hidden');
        notification.classList.add('show');
        notification.style.backgroundColor = type === 'success' ? '#10B981' : '#EF4444';
        notification.style.color = 'white';

        setTimeout(() => {
            hideNotification();
        }, 5000);
    }

    function hideNotification() {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.classList.add('hidden');
        }, 300);
    }

    notificationClose.addEventListener('click', hideNotification);
});