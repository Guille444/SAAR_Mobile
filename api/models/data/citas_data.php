<?php
// Se incluye la clase para validar los datos de entrada.
require_once('../../helpers/validator.php');
// Se incluye la clase padre.
require_once('../../models/handler/citas_handler.php');

/*
 *	Clase para manejar el encapsulamiento de los datos de la tabla citas.
 */
class CitasData extends CitasHandler
{
    /*
     *  Atributos adicionales.
     */
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
            $this->data_error = 'El identificador de la cita es incorrecto';
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

    public function setIdVehiculo($value)
    {
        if (Validator::validateNaturalNumber($value)) {
            $this->id_vehiculo = $value;
            return true;
        } else {
            $this->data_error = 'El identificador del vehículo es incorrecto';
            return false;
        }
    }

    public function setIdServicio($value)
    {
        if (Validator::validateNaturalNumber($value)) {
            $this->id_servicio = $value;
            return true;
        } else {
            $this->data_error = 'El identificador del servicio es incorrecto';
            return false;
        }
    }

    public function setFechaCita($value)
    {
        if (Validator::validateDate($value)) {
            $this->fecha_cita = $value;
            return true;
        } else {
            $this->data_error = 'Formato de fecha incorrecto';
            return false;
        }
    }

    public function setEstado($value, $min = 2, $max = 50)
    {
        if (!Validator::validateAlphabetic($value)) {
            $this->data_error = 'El estado debe ser un valor alfabético';
            return false;
        } elseif (Validator::validateLength($value, $min, $max)) {
            $this->estado_cita = $value;
            return true;
        } else {
            $this->data_error = 'El estado debe tener una longitud entre ' . $min . ' y ' . $max;
            return false;
        }
    }

    public function setHoraCita($value)
    {
        // Validar el formato de la hora (24 horas) - HH:MM
        if (preg_match('/^(?:[01]\d|2[0-3]):[0-5]\d$/', $value)) {
            $this->hora_cita = $value;
            return true;
        } else {
            $this->data_error = 'Formato de hora incorrecto. Debe ser HH:MM en formato de 24 horas.';
            return false;
        }
    }

    /*
     *  Métodos para obtener los atributos adicionales.
     */
    public function getDataError()
    {
        return $this->data_error;
    }
}
