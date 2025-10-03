const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
const port = 3000; // Puerto donde correrá tu backend. ¡Asegúrate que coincida con tu frontend!

// --- CONFIGURACIÓN DE MIDDLEWARE ---
// 1. Permite solicitudes de otros dominios (CORS)
app.use(cors()); 
// 2. Permite a Express leer datos JSON (datos del formulario)
app.use(express.json()); 
// 3. Permite a Express leer datos de URL codificados
app.use(express.urlencoded({ extended: true }));

// --- CONFIGURACIÓN DE NODEMAILER (¡IMPORTANTE! REEMPLAZA ESTO) ---
const transporter = nodemailer.createTransport({
    // Si usas Gmail, este es el servicio. Para otros, busca su configuración SMTP.
    service: 'gmail', 
    auth: {
        // Tu correo electrónico de envío (el que usas para iniciar sesión)
        user: 'systemscerberus@gmail.com', 
        // La "Contraseña de Aplicación" generada por Gmail o la contraseña de tu SMTP
        pass: 'Cerberus2304' 
    }
});

// --- ENDPOINT PARA EL FORMULARIO DE CONTACTO ---
app.post('/send-email', async (req, res) => {
    
    // Desestructuración de los datos recibidos del frontend
    const { nombre, email, empresa, telefono, proyecto } = req.body;

    // Validación básica
    if (!nombre || !email || !proyecto) {
        return res.status(400).json({ message: 'Faltan campos obligatorios: Nombre, Email y Descripción del Proyecto.' });
    }

    // Estructura del correo electrónico que recibirás
    const mailOptions = {
        // Tu correo electrónico para recibir los mensajes (puede ser el mismo o diferente al 'user' de auth)
        to: 'tucorreo_de_destino@tudominio.com', 
        // Asunto del correo para identificar fácilmente el lead
        subject: `[Cerberus Lead] Nueva Solicitud de Proyecto de: ${nombre}`, 
        
        // Cuerpo del correo en formato HTML
        html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                <h2 style="color: #1a1a2e;">¡Nueva Llamada de Descubrimiento Agendada!</h2>
                <p>Un cliente potencial ha solicitado que lo contactes para discutir su proyecto.</p>
                <hr style="border: 1px solid #e0e0e0;">

                <h3 style="color: #1a1a2e;">Datos del Contacto:</h3>
                <ul>
                    <li><strong>Nombre:</strong> ${nombre}</li>
                    <li><strong>Email:</strong> <a href="mailto:${email}">${email}</a></li>
                    <li><strong>Empresa:</strong> ${empresa || 'N/A'}</li>
                    <li><strong>Teléfono:</strong> ${telefono || 'N/A'}</li>
                </ul>
                
                <h3 style="color: #1a1a2e;">Descripción del Proyecto:</h3>
                <div style="background-color: #f4f4f8; padding: 15px; border-left: 4px solid #007bff; white-space: pre-wrap;">
                    ${proyecto}
                </div>
                
                <p style="margin-top: 20px; font-size: 0.9em; color: #888;">Hora de recepción: ${new Date().toLocaleString()}</p>
            </div>
        `
    };

    // 4. Intento de Envío
    try {
        await transporter.sendMail(mailOptions);
        console.log(`[EXITO] Correo enviado a ${mailOptions.to} desde ${transporter.options.auth.user}`);
        // Respuesta de éxito al frontend
        res.status(200).json({ message: 'Mensaje enviado con éxito.' });
    } catch (error) {
        console.error('[ERROR] Fallo al enviar el correo:', error);
        // Respuesta de error al frontend
        res.status(500).json({ message: 'Error al enviar el mensaje. Revisa la consola del servidor.' });
    }
});

// --- INICIO DEL SERVIDOR ---
app.listen(port, () => {
    console.log(`Servidor backend de Cerberus Systems corriendo en http://localhost:${port}`);
    console.log(`Listo para recibir solicitudes POST en /send-email`);
});