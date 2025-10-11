// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});


// Add scroll effect to navbar
let lastScroll = 0;
window.addEventListener('scroll', () => {
    const nav = document.querySelector('nav');
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        nav.style.background = 'rgba(26, 26, 46, 0.95)';
        nav.style.backdropFilter = 'blur(10px)';
    } else {
        nav.style.background = 'var(--primary)';
        nav.style.backdropFilter = 'none';
    }
    
    lastScroll = currentScroll;
});

// Animate elements on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
                     // **AÑADIR ESTO:**
            observer.unobserve(entry.target); // Dejar de observar una vez que el elemento es visible
        }

    });
}, observerOptions);

// Observe all cards and steps
document.querySelectorAll('.step, .service-card, .case-card, .value-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

(function () {
const BREAKPOINT = 992; // cámbialo aquí y en tu CSS
const btn   = document.querySelector('.nav-toggle');
const panel = document.getElementById('nav-menu');

if (!btn || !panel) return;

const close = () => {
    btn.setAttribute('aria-expanded', 'false');
    panel.classList.remove('is-open');
};

btn.addEventListener('click', () => {
    const expanded = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', String(!expanded));
    panel.classList.toggle('is-open', !expanded);
});

panel.addEventListener('click', (e) => {
    if (e.target.closest('a')) close();
});

const mq = window.matchMedia(`(min-width: ${BREAKPOINT}px)`);
const handleMQ = () => { if (mq.matches) close(); };
mq.addEventListener ? mq.addEventListener('change', handleMQ) : mq.addListener(handleMQ);
handleMQ();

window.addEventListener('hashchange', close);
})();
document.addEventListener('DOMContentLoaded', function () {
  const buttons = document.querySelectorAll('.toggle-solution-btn');

  const openPanel = (panel) => {
    // Medir altura real
    panel.style.maxHeight = panel.scrollHeight + 'px';
    panel.classList.add('open');
  };

  const closePanel = (panel) => {
    // Asegurar valor numérico actual para animar hacia 0
    panel.style.maxHeight = panel.scrollHeight + 'px';
    // forzar reflow para que el cambio a 0 transicione
    panel.offsetHeight; 
    panel.style.maxHeight = '0px';
    panel.classList.remove('open');
  };

  buttons.forEach(btn => {
    btn.addEventListener('click', function () {
      const targetId = this.getAttribute('data-target');
      const panel = document.getElementById(targetId);
      if (!panel) return;

      const isOpen = panel.classList.contains('open');
      if (isOpen) {
        closePanel(panel);
        this.textContent = 'Ver Solución Completa';
        this.classList.remove('active');
        this.setAttribute('aria-expanded', 'false');
      } else {
        openPanel(panel);
        this.textContent = 'Ocultar Solución';
        this.classList.add('active');
        this.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // Recalcular altura si cambia el layout (resize / cambio de columnas)
  const recalcOpenHeights = () => {
    document.querySelectorAll('.case-solution.open').forEach(panel => {
      panel.style.maxHeight = 'auto';            // limpiar por si quedó un número viejo
      panel.style.maxHeight = panel.scrollHeight + 'px';
    });
  };
  window.addEventListener('resize', recalcOpenHeights);

  // Si tu contenido dentro cambia dinámicamente, puedes observarlo:
  const ro = new ResizeObserver(recalcOpenHeights);
  document.querySelectorAll('.case-solution').forEach(p => ro.observe(p));
});



// Contact form handling (Modificado para PHP)
const contactForm = document.getElementById('contactForm');
const successMessage = document.getElementById('successMessage');
const submitButton = contactForm.querySelector('.submit-btn');

contactForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Obtener los datos del formulario como un objeto JSON
    const formData = new FormData(contactForm);
    const jsonData = Object.fromEntries(formData.entries());

    // Desactivar el botón y cambiar texto mientras se envía
    const originalButtonText = submitButton.textContent;
    submitButton.textContent = 'Enviando...';
    submitButton.disabled = true;

    try {
        // --- PETICIÓN AL BACKEND PHP ---
        // ¡CAMBIO CLAVE! Apunta directamente al archivo PHP en el mismo dominio.
        const response = await fetch('send_email.php', { 
            method: 'POST',
            headers: {
                // Sigue enviando JSON, ya que el script PHP lo procesa con file_get_contents("php://input")
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify(jsonData)
        });
        // --------------------------

        if (response.ok) {
            // Éxito: Muestra el mensaje de éxito
            successMessage.classList.add('show');
            
            // Reset form
            contactForm.reset();
            
            // Hide success message after 5 seconds
            setTimeout(() => {
                successMessage.classList.remove('show');
            }, 5000);

            console.log('Solicitud enviada al servidor con éxito.');
        } else {
            // El servidor PHP devolvió un error (400, 500, etc.)
            const errorData = await response.json();
            alert(`Error al procesar la solicitud: ${errorData.message}`);
            console.error('Error del servidor:', errorData);
        }

    } catch (error) {
        // Error de red (el archivo PHP no se encontró o el servidor está caído)
        alert('¡Error de conexión! No se pudo contactar al servidor o el archivo no existe.');
        console.error('Error de red al enviar el formulario:', error);
    } finally {
        // Restaurar el botón en cualquier caso
        submitButton.textContent = originalButtonText;
        submitButton.disabled = false;
    }
});



