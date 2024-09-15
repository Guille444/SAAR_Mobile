<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\SMTP;

require_once('../helpers/database.php');
require_once('./PHPMailer/src/Exception.php');
require_once('./PHPMailer/src/PHPMailer.php');
require_once('./PHPMailer/src/SMTP.php');

header('Content-type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method, Authorization");
header("Access-Control-Allow-Methods: GET,PUT,POST,DELETE,PATCH,OPTIONS");
header("Allow: GET, POST, OPTIONS, PUT, DELETE");

$method = $_SERVER['REQUEST_METHOD'];
if ($method == "OPTIONS") {
    die();
}

// Verificación de datos
$pin = isset($_POST['codigo_recuperacion']) ? trim($_POST['codigo_recuperacion']) : '';
$alias = isset($_POST['alias_cliente']) ? trim($_POST['alias_cliente']) : '';
$email = isset($_POST['correo_cliente']) ? trim($_POST['correo_cliente']) : '';

error_log("Datos recibidos en PHP:");
error_log("PIN: '" . $pin . "'");
error_log("Alias: '" . $alias . "'");
error_log("Email: '" . $email . "'");

// Validación de datos
if (empty($pin) || empty($alias) || empty($email)) {
    echo json_encode(['status' => false, 'message' => 'Datos incompletos']);
    exit();
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['status' => false, 'message' => 'Correo electrónico inválido']);
    exit();
}

try {
    // Guardar el código de recuperación en la base de datos
    $query = "UPDATE clientes SET codigo_recuperacion = ? WHERE correo_cliente = ?";
    $values = [$pin, $email];
    $result = Database::executeRow($query, $values);

    if (!$result) {
        echo json_encode(['status' => false, 'message' => 'Error al guardar el código de recuperación']);
        exit();
    }

    // Configuración y envío del correo electrónico
    $mail = new PHPMailer(true);
    $mail->isSMTP();
    $mail->SMTPDebug = 0;
    $mail->Debugoutput = 'html';

    $mail->setFrom("soportesaar@gmail.com");
    $mail->SMTPAuth = true;
    $mail->SMTPSecure = 'ssl';
    $mail->Host = "smtp.gmail.com";
    $mail->Port = 465;
    $mail->Username = "soportesaar@gmail.com";
    $mail->Password = "grmhcnhakxcqfggk";

    $mail->addAddress($email);
    $mail->Subject = 'Recuperación de contraseña';

    $mail->isHTML(true);
    $mail->CharSet = 'utf-8';
    $html = "<html>
        <head>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #000;
                    color: #fff;
                    text-align: center;
                    padding: 50px;
                }
                .container {
                    background-color: #000;
                    padding: 20px;
                    color: #fff;
                    border-radius: 10px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                    max-width: 400px;
                    margin: auto;
                }
                .header {
                    font-size: 24px;
                    margin-bottom: 20px;
                    color: #fff;
                }
                .pin {
                    font-size: 30px;
                    letter-spacing: 10px;
                    font-weight: bold;
                    margin: 20px 0;
                    color: #fff;
                }
                .message {
                    font-size: 18px;
                    margin-top: 20px;
                    color: #fff;
                }
                .footer {
                    font-size: 14px;
                    color: #888;
                    margin-top: 30px;
                }
            </style>
        </head>
        <body>
            <div class='container'>
                <div class='header'>Código de recuperación</div>
                <p>Hola, <strong>$alias</strong>.</p>
                <p>Este es tu código de recuperación: <strong class='pin'>$pin</strong></p>
                <p class='message'>Si no solicitó este código, ignore este mensaje.</p>
                <div class='footer'><strong>SAAR - Sistema de Administración Automotriz Rodríguez</strong></div>
            </div>
        </body>
        </html>";
    $mail->Body = $html;
    $mail->send();

    echo json_encode(['status' => true, 'message' => 'Correo enviado correctamente']);
} catch (Exception $e) {
    echo json_encode(['status' => false, 'message' => 'Error al enviar el correo: ' . $e->getMessage()]);
}