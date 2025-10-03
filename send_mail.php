<?php
header('Content-Type: application/json');

// 1. Configuración de Seguridad y CORS
// Esto es necesario para permitir que tu JavaScript (frontend) envíe datos a este script.
// *Nota: En un entorno de producción, reemplaza '*' con el dominio de tu sitio web.*
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Verifica si la solicitud es POST
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode(["message" => "Método no permitido. Solo se acepta POST."]);
    exit;
}

// 2. Obtener los datos del formulario (desde el JSON de JavaScript)
$json_data = file_get_contents("php://input");
$data = json_decode($json_data, true);

// 3. Extracción y Limpieza de Variables
$nombre = htmlspecialchars($data['nombre'] ?? '');
$email = filter_var($data['email'] ?? '', FILTER_SANITIZE_EMAIL);
$empresa = htmlspecialchars($data['empresa'] ?? 'N/A');
$telefono = htmlspecialchars($data['telefono'] ?? 'N/A');
$proyecto = htmlspecialchars($data['proyecto'] ?? '');

// 4. Validación básica
if (empty($nombre) || !filter_var($email, FILTER_VALIDATE_EMAIL) || empty($proyecto)) {
    http_response_code(400);
    echo json_encode(["message" => "Faltan campos obligatorios o el email no es válido."]);
    exit;
}

// --- CONFIGURACIÓN DEL CORREO ---
$destinatario = "systemscerberus@gmail.com"; // ⬅️ ¡CAMBIA ESTO!
$asunto = "[Cerberus Lead - PHP] Nueva Solicitud de Proyecto de: " . $nombre;

// 5. Contenido del Correo (HTML)
$mensaje_html = "
    <html>
    <body style='font-family: Arial, sans-serif; line-height: 1.6;'>
        <h2 style='color: #1a1a2e;'>¡Nueva Llamada de Descubrimiento Agendada!</h2>
        <p>Un cliente potencial ha solicitado que lo contactes.</p>
        <hr style='border: 1px solid #e0e0e0;'>

        <h3 style='color: #1a1a2e;'>Datos del Contacto:</h3>
        <ul>
            <li><strong>Nombre:</strong> {$nombre}</li>
            <li><strong>Email:</strong> <a href='mailto:{$email}'>{$email}</a></li>
            <li><strong>Empresa:</strong> {$empresa}</li>
            <li><strong>Teléfono:</strong> {$telefono}</li>
        </ul>
        
        <h3 style='color: #1a1a2e;'>Descripción del Proyecto:</h3>
        <div style='background-color: #f4f4f8; padding: 15px; border-left: 4px solid #007bff; white-space: pre-wrap;'>
            {$proyecto}
        </div>
    </body>
    </html>
";

// Cabeceras (Headers) para enviar correo HTML
$cabeceras = "MIME-Version: 1.0" . "\r\n";
$cabeceras .= "Content-type:text/html;charset=UTF-8" . "\r\n";
$cabeceras .= "From: Cerberus Systems <no-reply@tudominio.com>" . "\r\n"; // ⬅️ ¡CAMBIA ESTO!

// 6. Intento de Envío y Respuesta
if (mail($destinatario, $asunto, $mensaje_html, $cabeceras)) {
    http_response_code(200);
    echo json_encode(["message" => "Mensaje enviado con éxito."]);
} else {
    http_response_code(500);
    echo json_encode(["message" => "Error al enviar el mensaje. La función mail() falló."]);
}

?>