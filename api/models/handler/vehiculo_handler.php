<?php
// Se incluye la clase para trabajar con la base de datos.
require_once('../../helpers/database.php');

/*
*	Clase para manejar el comportamiento de los datos de la tabla CITAS.
*/
class VehiculoHandler
{

    /*
    *   Métodos para realizar las operaciones SCRUD (search, create, read, update, and delete).
    */

    protected $id = null;
    protected $modelo = null;
    protected $placa = null;
    protected $color = null;
    protected $año = null;
    protected $vim = null;
    protected $marca = null;

    public function searchRows()
    {
        $value = '%' . Validator::getSearchValue() . '%';
        $sql = 'SELECT v.id_vehiculo, v.placa_vehiculo, v.color_vehiculo, v.vim_motor, m.modelo_vehiculo, 
            CONCAT(c.nombre_cliente, " ", c.apellido_cliente) AS nombre_completo, ma.marca_vehiculo
            FROM vehiculos v
            INNER JOIN modelos m ON v.id_modelo = m.id_modelo
            INNER JOIN clientes c ON v.id_cliente = c.id_cliente
            INNER JOIN marcas ma ON v.id_marca = ma.id_marca
            WHERE CONCAT(c.nombre_cliente, " ", c.apellido_cliente) LIKE ?
            ORDER BY m.modelo_vehiculo';
        $params = array($value);
        return Database::getRows($sql, $params);
    }



    public function readAll()
    {
        $sql = 'SELECT v.id_vehiculo, v.placa_vehiculo, v.color_vehiculo, v.vim_motor, m.modelo_vehiculo, 
            CONCAT(c.nombre_cliente, " ", c.apellido_cliente) AS nombre_completo, ma.marca_vehiculo
                FROM vehiculos v
                INNER JOIN modelos m ON v.id_modelo = m.id_modelo
                INNER JOIN clientes c ON v.id_cliente = c.id_cliente
                INNER JOIN marcas ma ON v.id_marca = ma.id_marca
                ORDER BY m.modelo_vehiculo;';
        return Database::getRows($sql);
    }

    public function createRow()
    {
        $sql = 'INSERT INTO vehiculos(id_modelo,id_cliente, anio_vehiculo, placa_vehiculo,color_vehiculo,vim_motor,id_marca) 
                VALUES (?,?,?,?,?,?)';
        $params = array($this->modelo, $_SESSION['idCliente'], $this->año, $this->placa, $this->color, $this->vim, $this->marca);
        return Database::getRows($sql, $params);
    }
}
