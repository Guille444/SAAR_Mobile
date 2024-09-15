<?php
// Se incluye la clase para trabajar con la base de datos.
require_once('../../helpers/database.php');
date_default_timezone_set('America/El_Salvador'); // Ajusta a tu zona horaria
/*
*	Clase para manejar el comportamiento de los datos de la tabla CITAS.
*/
class CitasHandler
{
    /*
    *   Declaración de atributos para el manejo de datos.
    */
    protected $id = null;
    protected $id_cliente = null;
    protected $id_vehiculo = null;
    protected $id_servicio = null;
    protected $fecha_cita = null;
    protected $estado_cita = null;
    protected $hora_cita = null;


    /*
    *   Métodos para realizar las operaciones SCRUD (search, create, read, update, and delete).
    */

    public function searchRows()
    {
        $value = '%' . Validator::getSearchValue() . '%';
        $sql = 'SELECT c.id_cita,
                   CONCAT(cl.nombre_cliente, " ", cl.apellido_cliente) AS cliente,
                   DATE_FORMAT(c.fecha_cita, "%d-%m-%Y") AS fecha,
                   c.estado_cita,
                   v.placa_vehiculo,
                   s.nombre_servicio
            FROM citas c
            INNER JOIN clientes cl ON c.id_cliente = cl.id_cliente
            INNER JOIN vehiculos v ON c.id_vehiculo = v.id_vehiculo
            INNER JOIN servicios s ON c.id_servicio = s.id_servicio
            WHERE cl.nombre_cliente LIKE ?
               OR CONCAT(cl.nombre_cliente, " ", cl.apellido_cliente) LIKE ?
            ORDER BY c.fecha_cita DESC';
        $params = array($value, $value);
        return Database::getRows($sql, $params);
    }


    public function readAll()
    {
        $sql = 'SELECT c.id_cita,
                   CONCAT(cl.nombre_cliente, " ", cl.apellido_cliente) AS cliente,
                   DATE_FORMAT(c.fecha_cita, "%d-%m-%Y") AS fecha,
                   c.estado_cita,
                   v.placa_vehiculo,
                   s.nombre_servicio
            FROM citas c
            INNER JOIN clientes cl ON c.id_cliente = cl.id_cliente
            INNER JOIN vehiculos v ON c.id_vehiculo = v.id_vehiculo
            INNER JOIN servicios s ON c.id_servicio = s.id_servicio
            ORDER BY c.fecha_cita DESC, c.estado_cita DESC;';
        return Database::getRows($sql);
    }

    public function readOne()
    {
        $sql = 'SELECT c.id_cita,
                   CONCAT(cl.nombre_cliente, " ", cl.apellido_cliente) AS cliente,
                   DATE_FORMAT(c.fecha_cita, "%d-%m-%Y") AS fecha,
                   c.estado_cita,
                   v.placa_vehiculo,
                   s.nombre_servicio
            FROM citas c
            INNER JOIN clientes cl ON c.id_cliente = cl.id_cliente
            INNER JOIN vehiculos v ON c.id_vehiculo = v.id_vehiculo
            INNER JOIN servicios s ON c.id_servicio = s.id_servicio
            WHERE c.id_cita = ?';
        $params = array($this->id);
        $data = Database::getRow($sql, $params);

        return $data;
    }

    /*
    *  Métodos para gestionar las operaciones CRUD.
    */

    
    public function createRow($services)
    {
        try {
            // Log de los servicios recibidos
            file_put_contents('php://stderr', "Servicios recibidos: " . json_encode($services) . "\n", FILE_APPEND);

            // Verificar y formatear la hora correctamente
            if ($this->hora_cita !== null) {
                $this->hora_cita = date("H:i:s", strtotime($this->hora_cita));
                // Ajustar a la zona horaria local si es necesario
                $this->hora_cita = date("H:i:s", strtotime($this->hora_cita . ' UTC'));
            } else {
                file_put_contents('php://stderr', "La hora de la cita no está establecida correctamente\n", FILE_APPEND);
                return false;
            }

            // Log de la consulta y parámetros
            file_put_contents('php://stderr', "Intentando ejecutar SQL: INSERT INTO citas(id_cliente, id_vehiculo, fecha_cita, hora_cita)\n", FILE_APPEND);
            file_put_contents('php://stderr', "Parámetros: " . json_encode(array($_SESSION['idCliente'], $this->id_vehiculo, $this->fecha_cita, $this->hora_cita)) . "\n", FILE_APPEND);

            // Insertar la cita
            $sql = 'INSERT INTO citas(id_cliente, id_vehiculo, fecha_cita, hora_cita) VALUES(?, ?, ?, ?)';
            $params = array($_SESSION['idCliente'], $this->id_vehiculo, $this->fecha_cita, $this->hora_cita);
            $citaId = Database::getLastRow($sql, $params);

            if ($citaId) {
                file_put_contents('php://stderr', "Cita creada con ID: $citaId\n", FILE_APPEND);

                // Insertar los servicios asociados
                $sql = 'INSERT INTO cita_servicios(id_cita, id_servicio) VALUES(?, ?)';
                foreach ($services as $serviceId) {
                    file_put_contents('php://stderr', "Insertando servicio con ID: $serviceId en la cita ID: $citaId\n", FILE_APPEND);
                    $result = Database::executeRow($sql, array($citaId, $serviceId));
                    if (!$result) {
                        file_put_contents('php://stderr', "Error al insertar el servicio con ID: $serviceId\n", FILE_APPEND);
                        return false;
                    }
                }
                return true;
            } else {
                file_put_contents('php://stderr', "Error al crear la cita\n", FILE_APPEND);
            }
        } catch (Exception $e) {
            file_put_contents('php://stderr', "Excepción capturada en createRow: " . $e->getMessage() . "\n", FILE_APPEND);
            return false;
        }
        return false;
    }


    public function updateRow($services)
    {
        // Actualizar la cita
        $sql = 'UPDATE citas 
            SET id_vehiculo = ?, fecha_cita = ?, estado_cita = ?
            WHERE id_cita = ?';
        $params = array($this->id_vehiculo, $this->fecha_cita, $this->estado_cita, $this->id);
        $updated = Database::executeRow($sql, $params);

        if ($updated) {
            // Eliminar servicios existentes
            $sql = 'DELETE FROM citas_servicios WHERE id_cita = ?';
            Database::executeRow($sql, array($this->id));

            // Insertar los nuevos servicios asociados
            $sql = 'INSERT INTO citas_servicios(id_cita, id_servicio) VALUES(?, ?)';
            foreach ($services as $serviceId) {
                Database::executeRow($sql, array($this->id, $serviceId));
            }
            return true;
        }
        return false;
    }

    public function deleteRow()
    {
        // Eliminar los servicios asociados
        $sql = 'DELETE FROM citas_servicios WHERE id_cita = ?';
        Database::executeRow($sql, array($this->id));

        // Eliminar la cita
        $sql = 'DELETE FROM citas WHERE id_cita = ?';
        $params = array($this->id);
        return Database::executeRow($sql, $params);
    }

    public function readServicesByAppointment()
    {
        $sql = 'SELECT s.id_servicio, s.nombre_servicio
            FROM citas_servicios cs
            INNER JOIN servicios s ON cs.id_servicio = s.id_servicio
            WHERE cs.id_cita = ?';
        $params = array($this->id);
        return Database::getRows($sql, $params);
    }

    // Método para obtener todos los servicios
    public function getServices()
    {
        $sql = 'SELECT id_servicio, nombre_servicio 
            FROM servicios 
            ORDER BY nombre_servicio';
        return Database::getRows($sql);
    }

    public function readAllByClient()
    {
        $sql = "SELECT v.id_vehiculo, CONCAT(m.marca_vehiculo, ' ', mo.modelo_vehiculo, ' ', v.año_vehiculo) AS descripcion_vehiculo
        FROM vehiculos v
        INNER JOIN marcas m ON v.id_marca = m.id_marca
        INNER JOIN modelos mo ON v.id_modelo = mo.id_modelo
        WHERE v.id_cliente = ?;";
        return Database::getRows($sql, [$_SESSION['idCliente']]);  // Asegúrate de que esto devuelve un array
    }

    public function readAllByClientMobile()
    {
        $sql = 'SELECT c.fecha_cita, s.nombre_servicio AS "servicios",
        v.id_vehiculo, CONCAT(m.marca_vehiculo, " ", mo.modelo_vehiculo, " ", v.año_vehiculo) AS vehiculo FROM cita_servicios cs 
        INNER JOIN citas c ON c.id_cita = cs.id_cita
        INNER JOIN servicios s ON s.id_servicio = cs.id_servicio
        INNER JOIN vehiculos v ON v.id_vehiculo = c.id_vehiculo
        INNER JOIN marcas m ON v.id_marca = m.id_marca
        INNER JOIN modelos mo ON v.id_modelo = mo.id_modelo
        WHERE v.id_cliente = ?;';
        return Database::getRows($sql, [$_SESSION['idCliente']]);  // Asegúrate de que esto devuelve un array
    }
}
