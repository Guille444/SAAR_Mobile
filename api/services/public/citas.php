<?php
date_default_timezone_set('America/El_Salvador'); // Ajusta a tu zona horaria
// Asegúrate de que $data esté siendo inicializada correctamente
$data = json_decode(file_get_contents('php://input'), true);
// Verifica si $data es null y maneja el error
if (is_null($data)) {
    echo json_encode(['status' => 0, 'session' => 1, 'message' => null, 'error' => 'Datos incompletos o inválidos', 'exception' => null]);
    exit;
}
// Se incluye la clase del modelo.
require_once('../../models/data/citas_data.php');
// Se comprueba si existe una acción a realizar.
if (isset($_GET['action'])) {
    // Se crea una sesión o se reanuda la actual para utilizar variables de sesión en el script.
    session_start();
    // Se instancia la clase correspondiente.
    $citas = new CitasData;
    // Se declara e inicializa un arreglo para guardar el resultado que retorna la API.
    $result = array('status' => 0, 'session' => 0, 'message' => null, 'error' => null, 'exception' => null);
    // Se verifica si existe una sesión iniciada como cliente para realizar las acciones correspondientes.
    if (isset($_SESSION['idCliente'])) {
        $result['session'] = 1;
        // Se compara la acción a realizar cuando un cliente ha iniciado sesión.
        switch ($_GET['action']) {
            case 'searchRows':
                if (!Validator::validateSearch($_POST['search'])) {
                    $result['error'] = Validator::getSearchError();
                } else {
                    $result['dataset'] = $citas->searchRows($_POST['search']);
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' coincidencias';
                }
                break;
            case 'createRow':
                file_put_contents('php://stderr', print_r($data, TRUE)); // Log de los datos recibidos
                if (
                    !isset($data['id_vehiculo']) || !is_numeric($data['id_vehiculo']) ||
                    !isset($data['fecha_cita']) || empty($data['fecha_cita']) ||
                    !isset($data['hora_cita']) || empty($data['hora_cita']) ||
                    !isset($data['id_servicio']) || !is_array($data['id_servicio']) || empty($data['id_servicio'])
                ) {
                    $result['error'] = 'Datos incompletos o inválidos';
                    file_put_contents('php://stderr', "Datos incompletos o inválidos: " . json_encode($data) . "\n", FILE_APPEND);
                } else {
                    $citas->setIdVehiculo((int)$data['id_vehiculo']);
                    $citas->setFechaCita($data['fecha_cita']);
                    $citas->setHoraCita($data['hora_cita']); // Ahora solo pasa la hora tal como está
                    $citas->setIdCliente($_SESSION['idCliente']);
                    $result['status'] = $citas->createRow($data['id_servicio']);
                    if ($result['status']) {
                        $result['message'] = 'Cita creada correctamente';
                    } else {
                        $result['error'] = 'Ocurrió un problema al crear la cita';
                    }
                }
                break;
            case 'readAll':
                if ($result['dataset'] = $citas->readAll()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' registros';
                } else {
                    $result['error'] = 'No existen citas registradas';
                }
                break;
            case 'readOne':
                if (!isset($data['id_cita']) || !is_numeric($data['id_cita'])) {
                    $result['error'] = 'ID de cita inválido';
                } else {
                    $citas->setId($data['id_cita']);
                    $dataset = $citas->readOne();
                    if ($dataset) {
                        $result['status'] = 1;
                        $result['dataset'] = $dataset;
                    } else {
                        $result['error'] = 'Cita inexistente';
                    }
                }
                break;
            case 'updateRow':
                $data = json_decode(file_get_contents('php://input'), true);
                if (
                    !isset($data['id_cita']) || !is_numeric($data['id_cita']) ||
                    !isset($data['fecha_cita']) || empty($data['fecha_cita']) ||
                    !isset($data['hora_cita']) || empty($data['hora_cita'])
                ) {
                    $result['error'] = 'Datos incompletos o inválidos';
                } else {
                    $citas->setId($data['id_cita']);
                    $citas->setFechaCita($data['fecha_cita']);
                    $citas->setHoraCita($data['hora_cita']);

                    if ($citas->updateRow()) {
                        $result['status'] = 1;
                        $result['message'] = 'Cita modificada correctamente';
                    } else {
                        $result['error'] = 'Ocurrió un problema al modificar la cita';
                    }
                }
                break;
            case 'deleteRow':
                header('Content-Type: application/json');
                // Asegúrate de que el contenido sea solo JSON
                $result = array('status' => 0, 'session' => 0, 'message' => null, 'error' => null, 'exception' => null);
                if (!isset($data['id_cita']) || !is_numeric($data['id_cita'])) {
                    $result['status'] = 0;
                    $result['error'] = 'ID de cita inválido.';
                } else {
                    $citas->setId($data['id_cita']);
                    $result['status'] = $citas->deleteRow();
                    if ($result['status']) {
                        $result['message'] = 'Cita eliminada correctamente.';
                    } else {
                        $result['error'] = 'Ocurrió un problema al eliminar la cita.';
                    }
                }
                echo json_encode($result); // Envía una sola respuesta JSON
                exit; // Asegúrate de salir del script después de enviar la respuesta                
            case 'getServices':
                // Obtener todos los servicios
                if ($result['dataset'] = $citas->getServices()) {
                    $result['status'] = 1;
                    $result['message'] = 'Servicios cargados correctamente';
                } else {
                    $result['error'] = 'No existen servicios registrados';
                }
                break;
            case 'readAllByClient':
                if (isset($_SESSION['idCliente'])) {
                    try {
                        $result['dataset'] = $citas->readAllByClient();  // Asegúrate de que es un arreglo
                        $result['status'] = 1;
                        $result['message'] = 'Vehículos cargados correctamente';
                    } catch (Exception $e) {
                        $result['error'] = $e->getMessage();
                    }
                } else {
                    $result['error'] = 'No se ha definido el ID del cliente.';
                }
                break;
            case 'readAllByClientMobile':
                if (isset($_SESSION['idCliente'])) {
                    try {
                        $result['dataset'] = $citas->readAllByClientMobile();  // Asegúrate de que es un arreglo
                        $result['status'] = 1;
                        $result['message'] = 'Citas cargados correctamente';
                    } catch (Exception $e) {
                        $result['error'] = $e->getMessage();
                    }
                } else {
                    $result['error'] = 'No se ha definido el ID del cliente.';
                }
                break;
            default:
                $result['error'] = 'Acción no disponible dentro de la sesión';
        }
    } else {
        // Se compara la acción a realizar cuando el cliente no ha iniciado sesión.
        $result['error'] = 'Debe iniciar sesión para realizar esta acción';
    }

    // Se obtiene la excepción del servidor de base de datos por si ocurrió un problema.
    $result['exception'] = Database::getException();

    // Se indica el tipo de contenido a mostrar y su respectivo conjunto de caracteres.
    header('Content-type: application/json; charset=utf-8');

    // Se imprime el resultado en formato JSON y se retorna al controlador.
    print(json_encode($result));
} else {
    print(json_encode('Recurso no disponible'));
}
