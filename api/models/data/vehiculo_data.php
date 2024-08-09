<?php
// Se incluye la clase para validar los datos de entrada.
require_once('../../helpers/validator.php');
// Se incluye la clase padre.
require_once('../../models/handler/vehiculo_handler.php');

/*
* Clase para manejar el encapsulamiento de los datos de la tabla VEHICULO.
*/
class VehiculoData extends VehiculoHandler
{
    // Atributo genérico para manejo de errores.
    private $data_error = null;

    /*
    * Métodos para validar y establecer los datos.
    */
    public function setId($value)
    {
        if (Validator::validateNaturalNumber($value)) {
            $this->id = $value;
            return true;
        } else {
            $this->data_error = 'El identificador del vehículo es incorrecto';
            return false;
        }
    }

    public function setIdCliente($value)
    {
        if (Validator::validateNaturalNumber($value)) {
            $this->id_cliente = $value;
            return true;
        } else {
            $this->data_error = 'El identificador del cliente es incorrecto';
            return false;
        }
    }

    public function setIdMarca($value)
    {
        if (Validator::validateNaturalNumber($value)) {
            $this->id_marca = $value;
            return true;
        } else {
            $this->data_error = 'El identificador de la marca es incorrecto';
            return false;
        }
    }

    public function setIdModelo($value)
    {
        if (Validator::validateNaturalNumber($value)) {
            $this->id_modelo = $value;
            return true;
        } else {
            $this->data_error = 'El identificador del modelo es incorrecto';
            return false;
        }
    }

    public function setPlaca($value, $min = 2, $max = 50)
    {
        if (Validator::validateAlphanumeric($value) && Validator::validateLength($value, $min, $max)) {
            $this->placa = $value;
            return true;
        } else {
            $this->data_error = 'La placa debe tener una longitud entre ' . $min . ' y ' . $max . ' caracteres y puede contener letras y números';
            return false;
        }
    }

    public function setColor($value, $min = 2, $max = 50)
    {
        if (Validator::validateString($value) && Validator::validateLength($value, $min, $max)) {
            $this->color = $value;
            return true;
        } else {
            $this->data_error = 'El color debe tener una longitud entre ' . $min . ' y ' . $max . ' caracteres y puede contener letras y espacios';
            return false;
        }
    }

    public function setVin($value, $min = 2, $max = 50)
    {
        if (Validator::validateAlphanumeric($value) && Validator::validateLength($value, $min, $max)) {
            $this->vin = $value;
            return true;
        } else {
            $this->data_error = 'El VIN debe tener una longitud entre ' . $min . ' y ' . $max . ' caracteres y puede contener letras y números';
            return false;
        }
    }

    public function setAño($value, $min = 4, $max = 4)
    {
        if (Validator::validateNaturalNumber($value) && Validator::validateLength($value, $min, $max)) {
            $this->año = $value;
            return true;
        } else {
            $this->data_error = 'El año debe tener una longitud de ' . $min . ' caracteres y debe ser un número válido';
            return false;
        }
    }

    // Método para obtener el error de los datos.
    public function getDataError()
    {
        return $this->data_error;
    }
}