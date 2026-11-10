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
// Локальные затухающие волны смещают реальные пиксели текста и фона.
(() => {
    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    const mouse = matchMedia('(hover: hover) and (pointer: fine)');
    const ns = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(ns, 'svg');
    svg.classList.add('svg-filters');
    svg.setAttribute('aria-hidden', 'true');
    const defs = document.createElementNS(ns, 'defs');
    svg.append(defs);
    document.body.append(svg);
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 112;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const targets = [...document.querySelectorAll('.section, .footer, .modal-content')].map((element, index) => {
        const filter = document.createElementNS(ns, 'filter');
        filter.id = `water-${index}`;
        filter.setAttribute('filterUnits', 'userSpaceOnUse');
        filter.setAttribute('color-interpolation-filters', 'sRGB');
        const map = document.createElementNS(ns, 'feImage');
        map.setAttribute('result', 'waves');
        map.setAttribute('preserveAspectRatio', 'none');
        const displacement = document.createElementNS(ns, 'feDisplacementMap');
        displacement.setAttribute('in', 'SourceGraphic');
        displacement.setAttribute('in2', 'waves');
        displacement.setAttribute('scale', '22');
        displacement.setAttribute('xChannelSelector', 'R');
        displacement.setAttribute('yChannelSelector', 'G');
        filter.append(map, displacement);
        defs.append(filter);
        return { element, filter, map, waves: [] };
    });
    let frame = 0;
    let lastPaint = 0;
    let lastDrop = 0;
    function clear() {
        cancelAnimationFrame(frame);
        frame = 0;
        targets.forEach(t => { t.waves = []; t.element.style.removeProperty('filter'); });
    }
    function animate(now) {
        frame = 0;
        if (motion.matches || !mouse.matches || document.hidden) { clear(); return; }
        if (now - lastPaint < 32) { frame = requestAnimationFrame(animate); return; }
        lastPaint = now;
        let active = false;
        for (const target of targets) {
            target.waves = target.waves.filter(w => now - w.time < 1500);
            const rect = target.element.getBoundingClientRect();
            if (!target.waves.length || rect.bottom <= 100 || rect.top >= innerHeight) {
                target.element.style.removeProperty('filter');
                continue;
            }
            active = true;
            const image = ctx.createImageData(112, 112);
            for (let y = 0; y < 112; y++) {
                for (let x = 0; x < 112; x++) {
                    let dx = 0, dy = 0;
                    for (const wave of target.waves) {
                        const age = (now - wave.time) / 1000;
                        const vx = x / 111 * (rect.width + 32) - 16 - wave.x;
                        const vy = y / 111 * (rect.height + 32) - 16 - wave.y;
                        const distance = Math.hypot(vx, vy);
                        const ring = distance - age * 170;
                        const strength = Math.sin(ring / 13) * Math.exp(-(ring * ring) / 6500)
                            * Math.sin(Math.min(age / 0.12, 1) * Math.PI / 2) * (1 - age / 1.5) * 0.42;
                        dx += vx / (distance || 1) * strength;
                        dy += vy / (distance || 1) * strength;
                    }
                    const i = (y * 112 + x) * 4;
                    image.data[i] = Math.round(128 + Math.max(-0.48, Math.min(0.48, dx)) * 255);
                    image.data[i + 1] = Math.round(128 + Math.max(-0.48, Math.min(0.48, dy)) * 255);
                    image.data[i + 2] = 128;
                    image.data[i + 3] = 255;
                }
            }
            ctx.putImageData(image, 0, 0);
            target.filter.setAttribute('x', '-16');
            target.filter.setAttribute('y', '-16');
            target.filter.setAttribute('width', rect.width + 32);
            target.filter.setAttribute('height', rect.height + 32);
            target.map.setAttribute('x', '-16');
            target.map.setAttribute('y', '-16');
            target.map.setAttribute('width', rect.width + 32);
            target.map.setAttribute('height', rect.height + 32);
            target.map.setAttribute('href', canvas.toDataURL());
            target.element.style.filter = `url(#${target.filter.id})`;
        }
        if (active) frame = requestAnimationFrame(animate);
    }
    document.addEventListener('pointermove', event => {
        if (event.pointerType !== 'mouse' || motion.matches || !mouse.matches || event.target.closest('.header')) return;
        const now = performance.now();
        if (now - lastDrop < 70) return;
        const target = targets.find(t => t.element.contains(event.target));
        if (!target) return;
        const rect = target.element.getBoundingClientRect();
        target.waves.push({ x: event.clientX - rect.left, y: event.clientY - rect.top, time: now });
        target.waves = target.waves.slice(-10);
        lastDrop = now;
        if (!frame) frame = requestAnimationFrame(animate);
    }, { passive: true });
    motion.addEventListener('change', clear);
    document.addEventListener('visibilitychange', () => { if (document.hidden) clear(); });
})();
