DROP DATABASE IF EXISTS db_taller_rodriguez;

CREATE DATABASE db_taller_rodriguez;

USE db_taller_rodriguez;

CREATE table roles(
	id_rol INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
	nombre_rol VARCHAR(30) NOT NULL
);

CREATE TABLE administradores(
    id_administrador INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    nombre_administrador VARCHAR(50) NOT NULL,
    apellido_administrador VARCHAR(50) NOT NULL,
    alias_administrador VARCHAR(50) NOT NULL,
    correo_administrador VARCHAR(100) NOT NULL,
    clave_administrador VARCHAR(64) NOT NULL,
    fecha_registro DATE NOT NULL DEFAULT CURRENT_TIMESTAMP(),
    id_rol INT NOT NULL,
    CONSTRAINT fk_rol_administrador
    FOREIGN KEY (id_rol)
    REFERENCES roles (id_rol) ON DELETE CASCADE,
	codigo_recuperacion VARCHAR(6) NOT NULL,
	intentos_usuario INT UNSIGNED DEFAULT 0,
	fecha_reactivacion TIMESTAMP NULL DEFAULT NULL,
	ultimo_intento TIMESTAMP NULL DEFAULT NULL,
	ultimo_cambio_clave TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
	factor_autenticacion BOOLEAN DEFAULT FALSE,
    estado_administrador BOOLEAN DEFAULT TRUE
);

ALTER TABLE administradores
ADD CONSTRAINT unique_correo_administrador UNIQUE (correo_administrador);

ALTER TABLE administradores
ADD CONSTRAINT unique_alias_administrador UNIQUE (alias_administrador);

CREATE TABLE marcas(
    id_marca INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    marca_vehiculo VARCHAR(30) NOT NULL
);

ALTER TABLE marcas
ADD CONSTRAINT unique_marca_vehiculo UNIQUE (marca_vehiculo);

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

CREATE TABLE servicios(
    id_servicio INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    nombre_servicio VARCHAR(50) NOT NULL,
    descripcion_servicio VARCHAR(250)
);

CREATE TABLE citas(
    id_cita INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    id_cliente INT NOT NULL,
    id_vehiculo INT NOT NULL,
    fecha_cita DATE NOT NULL,
    hora_cita TIME NOT NULL,
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

CREATE TABLE detalle_citas(
	id_detalle_cita INT AUTO_INCREMENT PRIMARY KEY,
	id_pieza INT,
	 CONSTRAINT fk_detalle_pieza
    FOREIGN KEY (id_pieza)
    REFERENCES piezas (id_pieza) ON DELETE CASCADE,
    id_cita INT,
    CONSTRAINT fk_detalle_cita
    FOREIGN KEY (id_cita)
    REFERENCES citas (id_cita) ON DELETE CASCADE,
    cantidad INT NOT NULL	
);

SHOW TABLES;

INSERT INTO marcas (marca_vehiculo) VALUES 
('Toyota'),
('Honda'),
('Ford'),
('Chevrolet'),
('Nissan'),
('BMW'),
('Mercedes-Benz'),
('Audi'),
('Volkswagen'),
('Hyundai');

SELECT * FROM marcas;

INSERT INTO modelos (modelo_vehiculo, id_marca) VALUES
('Corolla', 1),
('Civic', 2),
('Mustang', 3),
('Camaro', 4),
('Altima', 5),
('Serie 3', 6),
('Clase C', 7),
('A4', 8),
('Golf', 9),
('Elantra', 10),
('Hilux', 1),
('Accord', 2),
('F-150', 3),
('Silverado', 4),
('Sentra', 5),
('X5', 6),
('Clase E', 7),
('Q7', 8),
('Passat', 9),
('Tucson', 10);

SELECT * FROM modelos;

INSERT INTO servicios (nombre_servicio, descripcion_servicio) VALUES
('Cambio de aceite', 'Cambio de aceite del motor y revisión de niveles'),
('Alineación', 'Alineación y balanceo de ruedas'),
('Cambio de frenos', 'Cambio de pastillas de freno y revisión de discos'),
('Revisión general', 'Revisión completa del vehículo'),
('Cambio de batería', 'Sustitución de batería'),
('Revisión de suspensión', 'Revisión y ajuste de suspensión'),
('Cambio de llantas', 'Sustitución de llantas'),
('Cambio de filtros', 'Cambio de filtro de aire y filtro de aceite'),
('Revisión de luces', 'Revisión y ajuste de luces del vehículo'),
('Diagnóstico de motor', 'Diagnóstico completo del motor'),
('Cambio de bujías', 'Cambio de bujías del motor'),
('Reparación de frenos', 'Reparación y ajuste de frenos'),
('Cambio de correa', 'Sustitución de correa de distribución'),
('Revisión de aire acondicionado', 'Revisión y recarga de aire acondicionado'),
('Limpieza de inyectores', 'Limpieza y revisión de inyectores de combustible'),
('Cambio de amortiguadores', 'Cambio de amortiguadores y revisión de suspensión'),
('Revisión de transmisión', 'Revisión y ajuste de transmisión'),
('Cambio de embrague', 'Sustitución de embrague'),
('Reparación de escape', 'Reparación y ajuste de sistema de escape'),
('Revisión de frenos ABS', 'Revisión y ajuste de frenos ABS');

SELECT * FROM servicios;