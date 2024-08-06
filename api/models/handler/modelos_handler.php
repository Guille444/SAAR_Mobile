<?php
// Se incluye la clase para trabajar con la base de datos.
require_once('../../helpers/database.php');
/*
*	Clase para manejar el comportamiento de los datos de la tabla PRODUCTO.
*/
class ModeloHandler
{
    /*
    *   Declaración de atributos para el manejo de datos.
    */
    protected $id = null;
    protected $nombre = null;
    protected $marca = null;

    /*
    *   Métodos para realizar las operaciones SCRUD (search, create, read, update, and delete).
    */
    public function searchRows()
    {
        $value = '%' . Validator::getSearchValue() . '%';
        $sql = 'SELECT id_modelo, modelo_vehiculo, marca_vehiculo
                FROM modelos
                INNER JOIN marcas USING(id_marca)
                WHERE modelo_vehiculo LIKE ?
                ORDER BY modelo_vehiculo';
        $params = array($value);
        return Database::getRows($sql, $params);
    }

    public function createRow()
    {
        $sql = 'INSERT INTO modelos(modelo_vehiculo, id_marca)
                VALUES(?, ?)';
        $params = array($this->nombre, $this->marca);
        return Database::executeRow($sql, $params);
    }

    public function readAll()
    {
        $sql = 'SELECT id_modelo, modelo_vehiculo, id_marca
                FROM modelos
                INNER JOIN marcas USING(id_marca)
                ORDER BY modelo_vehiculo';
        return Database::getRows($sql);
    }

    public function readOne()
    {
        $sql = 'SELECT id_modelo, modelo_vehiculo, id_marca
                FROM modelos
                WHERE id_modelo = ?';
        $params = array($this->id);
        return Database::getRow($sql, $params);
    }

    public function updateRow()
    {
        $sql = 'UPDATE modelos
                SET modelo_vehiculo = ?, id_marca = ?
                WHERE id_modelo = ?';
        $params = array($this->nombre, $this->marca, $this->id);
        return Database::executeRow($sql, $params);
    }

    public function deleteRow()
    {
        $sql = 'DELETE FROM modelos
                WHERE id_modelo = ?';
        $params = array($this->id);
        return Database::executeRow($sql, $params);
    }
}