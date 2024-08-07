<?php
// Se incluye la clase para validar los datos de entrada.
require_once('../../helpers/validator.php');
// Se incluye la clase padre.
require_once('../../models/handler/vehiculo_handler.php');
/*
*	Clase para manejar el encapsulamiento de los datos de la tabla CLIENTE.
*/
class VehiculoData extends VehiculoHandler
{
    // Atributo genérico para manejo de errores.
    private $data_error = null;

    /*
    *   Métodos para validar y establecer los datos.
    */
    public function setId($value)
    {
        if (Validator::validateNaturalNumber($value)) {
            $this->id = $value;
            return true;
        } else {
            $this->data_error = 'El identificador del vehiculo es incorrecto';
            return false;
        }
    }

    public function setModelo($value)
    {
        if (Validator::validateNaturalNumber($value)) {
            $this->modelo = $value;
            return true;
        } else {
            $this->data_error = 'El identificador del modelo es incorrecto';
            return false;
        }
    }

    public function setAño($value)
    {
        if (Validator::validateNaturalNumber($value)) {
            $this->existencias = $value;
            return true;
        } else {
            $this->data_error = 'El año debe ser numérico entero';
            return false;
        }
    }

    public function setCliente($value)
    {
        if (Validator::validateNaturalNumber($value)) {
            $this->cliente = $value;
            return true;
        } else {
            $this->data_error = 'El identificador del cliente es incorrecto';
            return false;
        }
    }

    public function setPlaca($value, $min = 2, $max = 50)
    {
        if (!Validator::validateAlphanumeric($value)) {
            $this->data_error = 'La placa debe ser un valor alfanumérico';
            return false;
        } elseif (Validator::validateLength($value, $min, $max)) {
            $this->placa = $value;
            return true;
        } else {
            $this->data_error = 'La placa debe tener una longitud entre ' . $min . ' y ' . $max;
            return false;
        }
    }

    public function setColor($value, $min = 2, $max = 50)
    {
        if (!Validator::validateAlphanumeric($value)) {
            $this->data_error = 'El nombre del color debe ser un valor alfanumérico';
            return false;
        } elseif (Validator::validateLength($value, $min, $max)) {
            $this->color = $value;
            return true;
        } else {
            $this->data_error = 'El nombre del color debe tener una longitud entre ' . $min . ' y ' . $max;
            return false;
        }
    }

    public function setVim($value, $min = 2, $max = 50)
    {
        if (!Validator::validateAlphanumeric($value)) {
            $this->data_error = 'El vim debe ser un valor alfanumérico';
            return false;
        } elseif (Validator::validateLength($value, $min, $max)) {
            $this->vim = $value;
            return true;
        } else {
            $this->data_error = 'El vim debe tener una longitud entre ' . $min . ' y ' . $max;
            return false;
        }
    }

    public function setMarca($value)
    {
        if (Validator::validateNaturalNumber($value)) {
            $this->marca = $value;
            return true;
        } else {
            $this->data_error = 'El identificador de la marca es incorrecto';
            return false;
        }
    }    

    public function getDataError()
    {
        return $this->data_error;
    }
    
}
