// ==== РЯБЬ ЗА КУРСОРОМ ПРИ ДВИЖЕНИИ ====
const COLORS = ['#A855F7', '#8B5CF6', '#9B7BE0', '#7C8B5E'];

let lastRipple = 0;

document.addEventListener('mousemove', (e) => {
    const now = Date.now();
    if (now - lastRipple < 150) return;   // частота появления ряби
    lastRipple = now;

    const ripple = document.createElement('div');
    ripple.className = 'ripple';
    ripple.style.left = e.clientX + 'px';
    ripple.style.top = e.clientY + 'px';

    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    ripple.style.borderColor = color;

    document.body.appendChild(ripple);

    // Удаляем после окончания анимации
    setTimeout(() => ripple.remove(), 1500);
});

// ==== РЯБЬ ОТ КЛИКА (усиленная, 3 волны) ====
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
