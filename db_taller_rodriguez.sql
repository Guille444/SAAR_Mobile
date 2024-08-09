DROP DATABASE IF EXISTS db_taller_rodriguez;

CREATE DATABASE db_taller_rodriguez;

USE db_taller_rodriguez;

CREATE TABLE administradores(
    id_administrador INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    nombre_administrador VARCHAR(50) NOT NULL,
    apellido_administrador VARCHAR(50) NOT NULL,
    alias_administrador VARCHAR(50) NOT NULL,
    correo_administrador VARCHAR(100) NOT NULL,
    clave_administrador VARCHAR(64) NOT NULL,
    fecha_registro DATE NOT NULL DEFAULT current_timestamp()
);

ALTER TABLE administradores
ADD CONSTRAINT unique_correo_administrador UNIQUE (correo_administrador);

ALTER TABLE administradores
ADD CONSTRAINT unique_alias_administrador UNIQUE (alias_administrador);

DESCRIBE administradores;

CREATE TABLE marcas(
    id_marca INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    marca_vehiculo VARCHAR(30) NOT NULL
);

ALTER TABLE marcas
ADD CONSTRAINT unique_marca_vehiculo UNIQUE (marca_vehiculo);

DESCRIBE marcas;

CREATE TABLE modelos(
    id_modelo INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    modelo_vehiculo VARCHAR(30) NOT NULL,
    id_marca INT NOT NULL,
    CONSTRAINT fk_modelo_marca
    FOREIGN KEY (id_marca)
    REFERENCES marcas (id_marca) ON DELETE CASCADE
);

ALTER TABLE modelos
ADD CONSTRAINT unique_modelo_vehiculo UNIQUE (modelo_vehiculo, id_marca);

DESCRIBE modelos;

CREATE TABLE clientes(
    id_cliente INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    nombre_cliente VARCHAR(50) NOT NULL,
    apellido_cliente VARCHAR(50) NOT NULL,
    alias_cliente VARCHAR(50) NOT NULL,
    correo_cliente VARCHAR(100) NOT NULL,
    clave_cliente VARCHAR(64) NOT NULL,
    contacto_cliente VARCHAR(9) NOT NULL,
    estado_cliente BOOLEAN NOT NULL,
    codigo_recuperacion VARCHAR(6) NOT NULL
);

ALTER TABLE clientes
ADD CONSTRAINT chk_contacto_cliente_format
CHECK (contacto_cliente REGEXP '^[0-9]{4}-[0-9]{4}$');

ALTER TABLE clientes
ADD CONSTRAINT unique_correo_cliente UNIQUE (correo_cliente);

ALTER TABLE clientes
ADD CONSTRAINT unique_alias_cliente UNIQUE (alias_cliente);

ALTER TABLE clientes
ALTER COLUMN estado_cliente SET DEFAULT 1;

DESCRIBE clientes;

CREATE TABLE vehiculos(
    id_vehiculo INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    id_marca INT NOT NULL,
    id_modelo INT NOT NULL,
    id_cliente INT NOT NULL,
    placa_vehiculo VARCHAR(30) NOT NULL,
    año_vehiculo VARCHAR(4) NOT NULL,
    color_vehiculo VARCHAR(30) NOT NULL,
    vin_motor VARCHAR(50) NOT NULL,
    CONSTRAINT fk_vehiculo_marca
    FOREIGN KEY (id_marca)
    REFERENCES marcas (id_marca) ON DELETE CASCADE,
    CONSTRAINT fk_vehiculo_modelo
    FOREIGN KEY (id_modelo)
    REFERENCES modelos (id_modelo) ON DELETE CASCADE,
    CONSTRAINT fk_vehiculo_cliente
    FOREIGN KEY (id_cliente)
    REFERENCES clientes (id_cliente) ON DELETE CASCADE
);

DESCRIBE vehiculos;

CREATE TABLE servicios(
    id_servicio INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    nombre_servicio VARCHAR(50) NOT NULL,
    descripcion_servicio VARCHAR(250)
);

DESCRIBE servicios;

CREATE TABLE citas(
    id_cita INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    id_cliente INT NOT NULL,
    id_vehiculo INT NOT NULL,
    fecha_cita DATE NOT NULL,
    estado_cita ENUM('Pendiente', 'Completada', 'Cancelada') NOT NULL,
    CONSTRAINT fk_cita_cliente
    FOREIGN KEY (id_cliente)
    REFERENCES clientes (id_cliente) ON DELETE CASCADE,
    CONSTRAINT fk_cita_vehiculo
    FOREIGN KEY (id_vehiculo)
    REFERENCES vehiculos (id_vehiculo) ON DELETE CASCADE
);

ALTER TABLE citas
ALTER COLUMN estado_cita SET DEFAULT 'Pendiente';

DESCRIBE citas;

CREATE TABLE cita_servicios(
    id_cita_servicio INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    id_cita INT NOT NULL,
    id_servicio INT NOT NULL,
    CONSTRAINT fk_cita_servicio_cita
    FOREIGN KEY (id_cita)
    REFERENCES citas (id_cita) ON DELETE CASCADE,
    CONSTRAINT fk_cita_servicio_servicio
    FOREIGN KEY (id_servicio)
    REFERENCES servicios (id_servicio) ON DELETE CASCADE
);

DESCRIBE cita_servicios;

CREATE TABLE piezas(
    id_pieza INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    id_cliente INT NOT NULL,
    nombre_pieza VARCHAR(30) NOT NULL,
    descripcion_pieza VARCHAR(250) NOT NULL,
    precio_unitario DECIMAL(10, 2) NOT NULL,
    CONSTRAINT fk_pieza_vehiculo
    FOREIGN KEY (id_cliente)
    REFERENCES clientes (id_cliente) ON DELETE CASCADE
);

ALTER TABLE piezas
ADD CONSTRAINT unique_nombre_pieza UNIQUE (nombre_pieza);

ALTER TABLE piezas
ADD CONSTRAINT chk_precio_unitario_positive CHECK (precio_unitario > 0);

DESCRIBE piezas;

CREATE TABLE inventario (
    id_inventario INT AUTO_INCREMENT PRIMARY KEY,
    id_pieza INT NOT NULL,
    cantidad_disponible INT NOT NULL,
    proveedor VARCHAR(100) NOT NULL,
    fecha_ingreso DATE NOT NULL,
    CONSTRAINT fk_inventario_pieza
    FOREIGN KEY (id_pieza)
    REFERENCES piezas (id_pieza) ON DELETE CASCADE
);

DESCRIBE inventario;

/* Vehículos que pertenecen a un cliente específico
SELECT 
    v.id_vehiculo, 
    v.placa_vehiculo, 
    v.año_vehiculo, 
    v.color_vehiculo, 
    v.vin_motor, 
    m.marca_vehiculo, 
    mo.modelo_vehiculo 
FROM 
    vehiculos v
INNER JOIN 
    marcas m ON v.id_marca = m.id_marca
INNER JOIN 
    modelos mo ON v.id_modelo = mo.id_modelo
WHERE 
    v.id_cliente = 1; */
    
-- Datos para la tabla marcas
INSERT INTO marcas (marca_vehiculo)
VALUES
('Toyota'),
('Honda'),
('Ford'),
('Chevrolet'),
('BMW'),
('Mercedes-Benz'),
('Audi'),
('Nissan'),
('Volkswagen'),
('Hyundai'),
('Kia'),
('Mazda'),
('Subaru'),
('Lexus'),
('Acura'),
('Infiniti'),
('Porsche'),
('Jaguar'),
('Ferrari'),
('Lamborghini');

INSERT INTO modelos (modelo_vehiculo, id_marca)
VALUES
('Camry', 1), ('RAV4', 1), ('Highlander', 1), ('Prius', 1), -- Toyota
('Civic', 2), ('Accord', 2), ('CR-V', 2), ('Pilot', 2), ('Fit', 2), -- Honda
('Focus', 3), ('Fiesta', 3), ('Mustang', 3), ('Explorer', 3), ('Escape', 3), -- Ford
('Malibu', 4), ('Impala', 4), ('Equinox', 4), ('Traverse', 4), ('Tahoe', 4), -- Chevrolet
('3 Series', 5), ('5 Series', 5), ('X3', 5), ('X5', 5), ('Z4', 5), -- BMW
('C-Class', 6), ('E-Class', 6), ('S-Class', 6), ('GLC', 6), ('GLE', 6), -- Mercedes-Benz
('A3', 7), ('A4', 7), ('A6', 7), ('Q5', 7), ('Q7', 7), -- Audi
('Altima', 8), ('Sentra', 8), ('Rogue', 8), ('Murano', 8), ('Pathfinder', 8), -- Nissan
('Golf', 9), ('Passat', 9), ('Tiguan', 9), ('Atlas', 9), ('Jetta', 9), -- Volkswagen
('Elantra', 10), ('Sonata', 10), ('Tucson', 10), ('Santa Fe', 10), ('Kona', 10), -- Hyundai
('Rio', 11), ('Forte', 11), ('Sportage', 11), ('Sorento', 11), ('Optima', 11), -- Kia
('Mazda3', 12), ('Mazda6', 12), ('CX-5', 12), ('CX-9', 12), ('MX-5', 12), -- Mazda
('Impreza', 13), ('Outback', 13), ('Forester', 13), ('Crosstrek', 13), ('WRX', 13), -- Subaru
('IS', 14), ('ES', 14), ('RX', 14), ('GX', 14), ('LX', 14), -- Lexus
('TLX', 15), ('ILX', 15), ('RDX', 15), ('MDX', 15), ('NSX', 15), -- Acura
('Q50', 16), ('Q60', 16), ('QX50', 16), ('QX60', 16), ('QX80', 16), -- Infiniti
('911', 17), ('Cayenne', 17), ('Macan', 17), ('Panamera', 17), ('Taycan', 17), -- Porsche
('XE', 18), ('XF', 18), ('F-Pace', 18), ('E-Pace', 18), ('I-Pace', 18), -- Jaguar
('488', 19), ('F8', 19), ('Portofino', 19), ('Roma', 19), ('SF90', 19), -- Ferrari
('Aventador', 20), ('Huracan', 20), ('Urus', 20), ('Gallardo', 20), ('Murcielago', 20); -- Lamborghini
            
INSERT INTO servicios (nombre_servicio, descripcion_servicio) VALUES
('Cambio de aceite', 'Cambio de aceite y filtro del motor'),
('Alineación y balanceo', 'Alineación y balanceo de las ruedas'),
('Revisión de frenos', 'Revisión y ajuste de frenos'),
('Cambio de batería', 'Sustitución de la batería del vehículo'),
('Mantenimiento de aire acondicionado', 'Revisión y mantenimiento del sistema de aire acondicionado'),
('Revisión general', 'Revisión general del vehículo'),
('Cambio de llantas', 'Sustitución de las llantas del vehículo'),
('Lavado y encerado', 'Lavado y encerado del vehículo'),
('Reparación de motor', 'Reparación y ajuste del motor'),
('Cambio de filtros', 'Cambio de filtros de aire y combustible'),
('Revisión eléctrica', 'Revisión del sistema eléctrico del vehículo'),
('Cambio de amortiguadores', 'Sustitución de amortiguadores'),
('Revisión de suspensión', 'Revisión y ajuste de la suspensión'),
('Revisión de transmisión', 'Revisión y mantenimiento de la transmisión'),
('Cambio de luces', 'Sustitución de luces delanteras y traseras'),
('Revisión de escape', 'Revisión y mantenimiento del sistema de escape'),
('Pintura', 'Pintura completa del vehículo'),
('Pulido', 'Pulido de la carrocería del vehículo'),
('Revisión de inyectores', 'Revisión y limpieza de inyectores'),
('Revisión de sistema de enfriamiento', 'Revisión y mantenimiento del sistema de enfriamiento');

SELECT * FROM clientes;
SELECT * FROM vehiculos;
SELECT * FROM servicios;
SELECT * FROM citas;
SELECT * FROM cita_servicios;