const COLORS = ['#A855F7', '#8B5CF6', '#9B7BE0', '#7C8B5E'];

let lastRipple = 0;

document.addEventListener('mousemove', (e) => {
    const now = Date.now();
    if (now - lastRipple < 150) return;  
    lastRipple = now;

    const ripple = document.createElement('div');
    ripple.className = 'ripple';
    ripple.style.left = e.clientX + 'px';
    ripple.style.top = e.clientY + 'px';

    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    ripple.style.borderColor = color;

    document.body.appendChild(ripple);

    setTimeout(() => ripple.remove(), 1500);
});

document.addEventListener('click', (e) => {
    for (let i = 0; i < 3; i++) {
        setTimeout(() => {
            const ripple = document.createElement('div');
            ripple.className = 'ripple ripple-strong';
            ripple.style.left = e.clientX + 'px';
            ripple.style.top = e.clientY + 'px';

            const color = COLORS[Math.floor(Math.random() * COLORS.length)];
            ripple.style.borderColor = color;

            document.body.appendChild(ripple);
            setTimeout(() => ripple.remove(), 1800);
        }, i * 120);
    }
});

// МОДАЛЬНЫЕ ОКНА
const modal = document.getElementById('modal');
const modalTitle = modal ? modal.querySelector('.modal-title') : null;
const modalBody = modal ? modal.querySelector('.modal-body') : null;
const modalClose = modal ? modal.querySelector('.modal-close') : null;
const modalBackdrop = modal ? modal.querySelector('.modal-backdrop') : null;
const cards = document.querySelectorAll('.card');

const MODAL_CONTENT = {
    devs: {
        title: 'Разработчики',
        body: `
            <p>Здесь будет текст о команде разработчиков. Пока что это пробный текст, чтобы посмотреть, как выглядит блок.</p>
            <img src="https://picsum.photos/600/300?random=1" alt="Пример картинки">
            <p>Мы — небольшая команда энтузиастов, которая создаёт Мир Грёз. Каждый вкладывает частичку себя в этот проект.</p>
            <p>Ещё один абзац пробного текста, чтобы посмотреть, как ведёт себя скролл внутри модального окна.</p>
        `
    },
    game: {
        title: 'Об игре',
        body: `
            <p>Это пробный текст об игре. Здесь будет информация о нашем проекте, какой у него жанр, сюжет и особенности.</p>
            <img src="https://picsum.photos/600/300?random=2" alt="Пример картинки">
            <p>Мир Грёз — это пространство, где реальность переплетается с фантазией. Каждый найдёт здесь свою историю.</p>
            <p>Ещё один абзац для проверки скролла.</p>
        `
    },
    specs: {
        title: 'Системные требования',
        body: `
            <p>Здесь будут системные требования. Пока что пробный текст.</p>
            <img src="https://picsum.photos/600/300?random=3" alt="Пример картинки">
            <p><strong>Минимальные:</strong> Windows 10, 8 ГБ ОЗУ, GTX 1050, 20 ГБ на диске.</p>
            <p><strong>Рекомендуемые:</strong> Windows 11, 16 ГБ ОЗУ, RTX 3060, 40 ГБ на диске.</p>
        `
    }
};

cards.forEach((card) => {
    card.addEventListener('click', () => {
        const target = card.getAttribute('data-target');
        const data = MODAL_CONTENT[target];
        if (!data || !modal) return;

        modalTitle.textContent = data.title;
        modalBody.innerHTML = data.body;

        modal.classList.add('open');
    });
});

function closeModal() {
    if (modal) modal.classList.remove('open');
}

if (modalClose) modalClose.addEventListener('click', closeModal);
if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('open')) {
        closeModal();
    }
});