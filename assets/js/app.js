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


// Contact form handling (Modificado para enviar al backend)
const contactForm = document.getElementById('contactForm');
const successMessage = document.getElementById('successMessage');
const submitButton = contactForm.querySelector('.submit-btn'); // Obtenemos el botón de envío

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
        // --- PETICIÓN AL BACKEND ---
        // ¡IMPORTANTE! Reemplaza la URL si tu servidor se ejecuta en otro lugar/puerto
        const response = await fetch('http://localhost:3000/send-email', {
            method: 'POST',
            headers: {
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
            // Error en la respuesta del servidor (ej. error de Nodemailer)
            alert('¡Ocurrió un error al procesar tu solicitud! Por favor, revisa la consola para más detalles.');
            console.error('Error del servidor:', await response.text());
        }

    } catch (error) {
        // Error de red (ej. el servidor no está corriendo)
        alert('¡Error de conexión! No se pudo contactar al servidor. Asegúrate de que el backend esté iniciado.');
        console.error('Error de red al enviar el formulario:', error);
    } finally {
        // Restaurar el botón en cualquier caso
        submitButton.textContent = originalButtonText;
        submitButton.disabled = false;
    }
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