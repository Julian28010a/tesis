// Inicialización cuando el DOM está listo
document.addEventListener('DOMContentLoaded', function() {
    // Crear sistema de partículas
    createParticles();
    
    // Inicializar animaciones de contador
    initCounters();
    
    // Configurar scroll reveal
    window.addEventListener('scroll', revealOnScroll);
    
    // Trigger inicial para elementos ya visibles
    revealOnScroll();
    
    // Smooth scroll para enlaces de navegación
    initSmoothScroll();
});

// Sistema de partículas flotantes
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    if (!particlesContainer) return;
    
    // Limpiar partículas existentes
    particlesContainer.innerHTML = '';
    
    // Crear 50 partículas
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 15 + 's';
        particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
        particlesContainer.appendChild(particle);
    }
}

// Animación de contadores
function animateCounter(element, target, suffix = '') {
    let current = 0;
    const increment = target / 100;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current) + suffix;
    }, 30);
}

// Inicializar contadores con observer
function initCounters() {
    const counters = [
        { id: 'stat1', target: 340, suffix: '' },
        { id: 'stat2', target: 15, suffix: '' },
        { id: 'stat3', target: 150, suffix: '' }
    ];
    
    // Usar Intersection Observer para activar contadores
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = counters.find(c => c.id === entry.target.id);
                if (counter && !entry.target.dataset.animated) {
                    animateCounter(entry.target, counter.target, counter.suffix);
                    entry.target.dataset.animated = 'true';
                }
            }
        });
    }, { threshold: 0.5 });
    
    // Observar cada contador
    counters.forEach(counter => {
        const element = document.getElementById(counter.id);
        if (element) {
            observer.observe(element);
        }
    });
}

// Animaciones de scroll reveal
function revealOnScroll() {
    const reveals = document.querySelectorAll('.scroll-reveal');
    const windowHeight = window.innerHeight;
    const elementVisible = 150;
    
    reveals.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        
        if (elementTop < windowHeight - elementVisible) {
            element.classList.add('active');
        }
    });
}

// Smooth scroll para navegación
function initSmoothScroll() {
    const navLinks = document.querySelectorAll('nav a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80; // Ajuste para navbar fijo
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Funciones para el simulador de sensores (si se implementa)
function setScenario(type) {
    // Actualizar botón activo
    document.querySelectorAll('.demo-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    const scenarios = {
        normal: {
            temp: { value: '22°C', status: 'NORMAL', color: '#2ecc71' },
            smoke: { value: '0.05 ppm', status: 'LIMPIO', color: '#2ecc71' },
            humidity: { value: '65%', status: 'ÓPTIMO', color: '#2ecc71' },
            wind: { value: '12 km/h', status: 'CALMO', color: '#2ecc71' },
            co2: { value: '410 ppm', status: 'NORMAL', color: '#2ecc71' },
            risk: { value: 'BAJO', status: 'SEGURO', color: '#2ecc71' }
        },
        warning: {
            temp: { value: '35°C', status: 'ELEVADA', color: '#f39c12' },
            smoke: { value: '0.12 ppm', status: 'DETECTADO', color: '#f39c12' },
            humidity: { value: '25%', status: 'BAJA', color: '#f39c12' },
            wind: { value: '28 km/h', status: 'FUERTE', color: '#f39c12' },
            co2: { value: '450 ppm', status: 'ELEVADO', color: '#f39c12' },
            risk: { value: 'MEDIO', status: 'PRECAUCIÓN', color: '#f39c12' }
        },
        danger: {
            temp: { value: '48°C', status: 'CRÍTICA', color: '#e74c3c' },
            smoke: { value: '0.35 ppm', status: 'PELIGROSO', color: '#e74c3c' },
            humidity: { value: '15%', status: 'CRÍTICA', color: '#e74c3c' },
            wind: { value: '45 km/h', status: 'EXTREMO', color: '#e74c3c' },
            co2: { value: '520 ppm', status: 'CRÍTICO', color: '#e74c3c' },
            risk: { value: 'ALTO', status: 'EVACUACIÓN', color: '#e74c3c' }
        },
        fire: {
            temp: { value: '85°C', status: '🔥 FUEGO', color: '#ff4757' },
            smoke: { value: '1.2 ppm', status: '🔥 INCENDIO', color: '#ff4757' },
            humidity: { value: '8%', status: '🔥 EXTREMA', color: '#ff4757' },
            wind: { value: '65 km/h', status: '🔥 HURACÁN', color: '#ff4757' },
            co2: { value: '850 ppm', status: '🔥 TÓXICO', color: '#ff4757' },
            risk: { value: 'MÁXIMO', status: '🔥 EMERGENCIA', color: '#ff4757' }
        }
    };

    const scenario = scenarios[type];
    if (!scenario) return;

    // Actualizar cada sensor
    Object.keys(scenario).forEach(sensorType => {
        updateSensorCard(sensorType, scenario[sensorType]);
    });
}

// Actualizar tarjeta de sensor individual
function updateSensorCard(sensorType, data) {
    const card = document.querySelector(`[data-sensor="${sensorType}"]`);
    if (!card) return;

    const valueElement = card.querySelector('.sensor-value');
    const statusElement = card.querySelector('.sensor-status');

    if (valueElement) {
        valueElement.textContent = data.value;
        valueElement.style.color = data.color;
    }

    if (statusElement) {
        statusElement.textContent = data.status;
        statusElement.style.color = data.color;
    }

    // Añadir efecto de pulso para cambios críticos
    if (data.color === '#e74c3c' || data.color === '#ff4757') {
        card.style.animation = 'pulse 1s ease-in-out 3';
        setTimeout(() => {
            card.style.animation = '';
        }, 3000);
    }
}

// Efectos adicionales de interactividad
function addInteractiveEffects() {
    // Efecto parallax en hero
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        if (hero) {
            hero.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    });

    // Efecto hover en cards con cursor personalizado
    const cards = document.querySelectorAll('.stat-card, .info-card, .fire-info-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.cursor = 'pointer';
        });
    });

    // Animación de la estaca 3D en hover
    const stake = document.querySelector('.stake-3d');
    if (stake) {
        stake.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1) rotateY(15deg)';
        });
        
        stake.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1) rotateY(0deg)';
        });
    }
}

// Detectar preferencias del usuario para animaciones
function respectMotionPreferences() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    if (prefersReducedMotion.matches) {
        // Desactivar animaciones complejas si el usuario prefiere movimiento reducido
        document.documentElement.style.setProperty('--animation-duration', '0.1s');
        
        // Eliminar partículas
        const particles = document.getElementById('particles');
        if (particles) {
            particles.style.display = 'none';
        }
    }
}

// Funciones de utilidad para performance
function throttle(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Optimizar scroll listener
const optimizedScrollHandler = throttle(revealOnScroll, 100);
window.addEventListener('scroll', optimizedScrollHandler);

// Inicializar efectos adicionales cuando esté listo
document.addEventListener('DOMContentLoaded', function() {
    addInteractiveEffects();
    respectMotionPreferences();
});

// Funciones para manejo de errores
function handleError(error, context) {
    console.error(`Error en ${context}:`, error);
    // En producción, aquí enviarías el error a un servicio de logging
}

// Wrapper seguro para funciones que pueden fallar
function safeExecute(func, context) {
    try {
        func();
    } catch (error) {
        handleError(error, context);
    }
}

// Exportar funciones para uso externo si es necesario
window.FireGuardApp = {
    setScenario,
    createParticles,
    revealOnScroll,
    animateCounter
};