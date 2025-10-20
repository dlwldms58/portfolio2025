$(document).ready(function () {


    // ===== Smooth Scroll (document 위임 + "#" 예외 처리) =====
    document.addEventListener('click', (e) => {
        const anchor = e.target.closest('a[href^="#"]');
        if (!anchor) return;

        const href = anchor.getAttribute('href');
        if (href === '#' || href.length === 0) return; // no-op

        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });

    // ===== Intersection Observer (지원 안되면 즉시 표시) =====
    const ioTargets = document.querySelectorAll('.skill-card, .project-card, .contact-item');
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

        ioTargets.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(40px)';
            el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            observer.observe(el);
        });
    } else {
        ioTargets.forEach(el => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        });
    }

    // ===== 부드러운 배경 패럴랙스 =====
    const waterBg = document.querySelector('.water-bg');
    if (waterBg) {
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    waterBg.style.transform = `translateY(${window.scrollY * 0.5}px)`;
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }

    // ===== Ripple 효과 =====
    function createRipple(e) {
        const ripple = document.createElement('div');
        ripple.style.position = 'fixed';
        ripple.style.left = (e.clientX - 10) + 'px';
        ripple.style.top = (e.clientY - 10) + 'px';
        ripple.style.width = '20px';
        ripple.style.height = '20px';
        ripple.style.borderRadius = '50%';
        ripple.style.pointerEvents = 'none';
        ripple.style.background = 'rgba(255, 255, 255, 0.15)';
        ripple.style.transform = 'scale(0)';
        ripple.style.animation = 'ripple 0.6s linear';
        document.body.appendChild(ripple);
        setTimeout(() => ripple.remove(), 650);
    }




})