<?php
// Incluye las clases de datos para vehículos, marcas y modelos.
require_once('../../models/data/vehiculo_data.php');
// Verifica si se ha especificado una acción a realizar.
if (isset($_GET['action'])) {
    // Inicia la sesión.
    session_start();
    // Crea instancias de las clases de datos.
    $vehiculo = new VehiculoData;
    // Inicializa un array para almacenar los resultados.
    $result = array('status' => 0, 'session' => 0, 'message' => null, 'error' => null, 'exception' => null);
    // Verifica si el usuario ha iniciado sesión.
    if (isset($_SESSION['idCliente'])) {
        $result['session'] = 1; // Indica que la sesión está activa.
        // Leer el cuerpo de la solicitud JSON
        $data = json_decode(file_get_contents('php://input'), true);
        // Procesa la acción solicitada.
        switch ($_GET['action']) {
                // Acción para buscar vehículos según un criterio.
            case 'searchRows':
                if (!Validator::validateSearch($_POST['search'])) {
                    $result['error'] = Validator::getSearchError(); // Error de validación.
                } elseif ($result['dataset'] = $vehiculo->searchRows()) {
                    $result['status'] = 1; // Éxito en la búsqueda.
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' coincidencias';
                } else {
                    $result['error'] = 'No hay coincidencias'; // No se encontraron resultados.
                }
                break;
                // Acción para crear un nuevo vehículo.
            case 'createRow':
                if (!$data || !isset($data['id_marca']) || !isset($data['id_modelo']) || !isset($data['año']) || !isset($data['placa']) || !isset($data['color']) || !isset($data['vin'])) {
                    $result['error'] = 'Datos incompletos';
                } else {
                    // Asignar los valores a las propiedades del objeto
                    if (
                        !$vehiculo->setIdMarca($data['id_marca']) ||
                        !$vehiculo->setIdModelo($data['id_modelo']) ||
                        !$vehiculo->setPlaca($data['placa']) ||
                        !$vehiculo->setColor($data['color']) ||
                        !$vehiculo->setVin($data['vin']) ||
                        !$vehiculo->setAño($data['año'])
                    ) {
                        $result['error'] = 'Datos incorrectos';
                    } elseif ($vehiculo->createRow()) {
                        $result['status'] = 1;
                        $result['message'] = 'Vehículo registrado correctamente';
                    } else {
                        $result['error'] = 'Ocurrió un problema al registrar el vehículo';
                    }
                }
                break;
                // Acción para leer todos los vehículos.
            case 'readAll':
                if ($result['dataset'] = $vehiculo->readAll()) {
                    $result['status'] = 1; // Éxito en la lectura.
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' vehículos registrados';
                } else {
                    $result['error'] = 'No existen vehículos registrados'; // No hay vehículos.
                }
                break;
                // Acción para leer un vehículo específico por ID.
            case 'readOne':
                header('Content-Type: application/json');

                // Obtener los datos del cuerpo de la solicitud
                $data = json_decode(file_get_contents('php://input'), true);

                if (!isset($data['id_vehiculo'])) {
                    error_log('ID de vehículo no proporcionado');
                    $result['status'] = 0;
                    $result['error'] = 'ID de vehículo no proporcionado';
                    echo json_encode($result);
                    exit;
                }

                $id_vehiculo = $data['id_vehiculo'];
                error_log('ID de vehículo recibido: ' . $id_vehiculo);

                if (!$vehiculo->setId($id_vehiculo)) {
                    $result['status'] = 0;
                    $result['error'] = 'Vehículo incorrecto';
                } elseif ($result['dataset'] = $vehiculo->readOne()) {
                    $result['status'] = 1;
                } else {
                    $result['status'] = 0;
                    $result['error'] = 'Vehículo inexistente';
                }

                echo json_encode($result);
                exit;
                // Acción para actualizar un vehículo existente.
            case 'updateRow':
                // Obtener el contenido de la solicitud JSON
                $input = file_get_contents('php://input');
                $data = json_decode($input, true); // Decodifica el JSON en un array asociativo

                if (
                    !isset($data['id_vehiculo']) ||
                    !isset($data['id_marca']) ||
                    !isset($data['id_modelo']) ||
                    !isset($data['placa']) ||
                    !isset($data['color']) ||
                    !isset($data['vin']) ||
                    !isset($data['año'])
                ) {
                    $result['error'] = 'Datos incorrectos'; // Error en los datos del formulario.
                } else {
                    $vehiculo->setId($data['id_vehiculo']);
                    $vehiculo->setIdMarca($data['id_marca']);
                    $vehiculo->setIdModelo($data['id_modelo']);
                    $vehiculo->setPlaca($data['placa']);
                    $vehiculo->setColor($data['color']);
                    $vehiculo->setVin($data['vin']);
                    $vehiculo->setAño($data['año']);

                    if ($vehiculo->updateRow()) {
                        $result['status'] = 1; // Éxito en la actualización.
                        $result['message'] = 'Vehículo actualizado correctamente';
                    } else {
                        $result['error'] = 'Ocurrió un problema al actualizar el vehículo'; // Error en la actualización.
                    }
                }
                break;
                // Acción para eliminar un vehículo.
            case 'deleteRow':
                header('Content-Type: application/json');
                // Verifica si se ha proporcionado el ID del vehículo.
                if (!isset($_POST['id_vehiculo']) || empty($_POST['id_vehiculo'])) {
                    echo json_encode(['error' => 'ID de vehículo no proporcionado']);
                } else {
                    $id_vehiculo = $_POST['id_vehiculo'];
                    if ($vehiculo->setId($id_vehiculo) && $vehiculo->deleteRow()) {
                        echo json_encode(['status' => 1, 'message' => 'Vehículo eliminado correctamente']);
                    } else {
                        echo json_encode(['error' => $vehiculo->getDataError() ?? 'Ocurrió un problema al eliminar el vehículo']);
                    }
                }
                exit;
                // Acción para obtener todas las marcas.
            case 'getMarcas':
                if ($result['dataset'] = $vehiculo->getAllMarcas()) {
                    $result['status'] = 1; // Éxito en la obtención de marcas.
                    $result['message'] = 'Marcas obtenidas correctamente';
                } else {
                    $result['error'] = 'No se encontraron marcas'; // No se encontraron marcas.
                }
                break;
                // Acción para obtener todos los modelos.
            case 'getModelos':
                if ($result['dataset'] = $vehiculo->getAllModelos()) {
                    $result['status'] = 1; // Éxito en la obtención de modelos.
                    $result['message'] = 'Modelos obtenidos correctamente';
                } else {
                    $result['error'] = 'No se encontraron modelos'; // No se encontraron modelos.
                }
                break;
                // Acción para obtener modelos por marca
            case 'getModelosByMarca':
                if (!isset($_GET['id_marca'])) {
                    $result['error'] = 'Marca no especificada';
                } elseif ($result['dataset'] = $vehiculo->getModelosByMarca($_GET['id_marca'])) {
                    $result['status'] = 1;
                    $result['message'] = 'Modelos obtenidos correctamente';
                } else {
                    $result['error'] = 'No se encontraron modelos';
                }
                break;
            case 'readByCliente':
                if ($result['dataset'] = $vehiculo->readByCliente($_SESSION['idCliente'])) {
                    $result['status'] = 1; // Éxito en la lectura.
                    $result['message'] = 'Vehículos obtenidos correctamente';
                } else {
                    $result['error'] = 'No existen vehículos registrados para este cliente'; // No hay vehículos para este cliente.
                }
                break;
            default:
                $result['error'] = 'Acción no disponible dentro de la sesión'; // Acción no permitida.
        }
    } else {
        $result['error'] = 'Debe iniciar sesión para realizar esta acción'; // El usuario no ha iniciado sesión.
    }
    // Captura cualquier excepción en la base de datos.
    $result['exception'] = Database::getException();
    // Define el tipo de contenido como JSON.
    header('Content-type: application/json; charset=utf-8');
    // Envía la respuesta en formato JSON.
    print(json_encode($result));
} else {
    // Respuesta en caso de que no se especifique ninguna acción.
    print(json_encode('Recurso no disponible'));
}
