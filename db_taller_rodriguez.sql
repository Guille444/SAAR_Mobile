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
    intentos_fallidos INT UNSIGNED DEFAULT 0 NOT NULL,
    bloqueo_hasta DATETIME NULL
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

/* INSERTS DE CADA TABLA*/
INSERT INTO roles (nombre_rol) VALUES 
('Administrador'),
('Gerente'),
('Mecánico'),
('Recepcionista'),
('Atención al Cliente'),
('Técnico'),
('Operador'),
('Supervisor'),
('Asistente'),
('Limpiador');

SELECT * FROM roles;

INSERT INTO administradores (nombre_administrador, apellido_administrador, alias_administrador, correo_administrador, clave_administrador, id_rol) VALUES
('Juan', 'Pérez', 'jperez', 'juan.perez@example.com', 'clave123', 1),
('María', 'López', 'mlopez', 'maria.lopez@example.com', 'clave456', 2),
('Carlos', 'Gómez', 'cgomez', 'carlos.gomez@example.com', 'clave789', 3),
('Ana', 'Martínez', 'amartinez', 'ana.martinez@example.com', 'clave012', 4),
('Pedro', 'Rodríguez', 'prodriguez', 'pedro.rodriguez@example.com', 'clave345', 5),
('Laura', 'Sánchez', 'lsanchez', 'laura.sanchez@example.com', 'clave678', 6),
('Luis', 'Fernández', 'lfernandez', 'luis.fernandez@example.com', 'clave901', 7),
('Sofía', 'García', 'sgarcia', 'sofia.garcia@example.com', 'clave234', 8),
('Miguel', 'Hernández', 'mhernandez', 'miguel.hernandez@example.com', 'clave567', 9),
('Lucía', 'Ramírez', 'lramirez', 'lucia.ramirez@example.com', 'clave890', 10),
('Jorge', 'Torres', 'jtorres', 'jorge.torres@example.com', 'clave1234', 1),
('Elena', 'Flores', 'eflores', 'elena.flores@example.com', 'clave5678', 2),
('Diego', 'Cruz', 'dcruz', 'diego.cruz@example.com', 'clave9012', 3),
('Valeria', 'Morales', 'vmorales', 'valeria.morales@example.com', 'clave3456', 4),
('Manuel', 'Reyes', 'mreyes', 'manuel.reyes@example.com', 'clave7890', 5),
('Carmen', 'Ruiz', 'cruiz', 'carmen.ruiz@example.com', 'clave0123', 6),
('Pablo', 'Ortiz', 'portiz', 'pablo.ortiz@example.com', 'clave4567', 7),
('Daniela', 'Medina', 'dmedina', 'daniela.medina@example.com', 'clave8901', 8),
('Andrés', 'Silva', 'asilva', 'andres.silva@example.com', 'clave2345', 9);

SELECT * FROM administradores;

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

INSERT INTO clientes (nombre_cliente, apellido_cliente, alias_cliente, correo_cliente, clave_cliente, contacto_cliente, estado_cliente) VALUES
('Luis', 'Gómez', 'lgomez', 'luis.gomez@example.com', 'clave111', '1234-5678', 1),
('Marta', 'Pérez', 'mperez', 'marta.perez@example.com', 'clave222', '2345-6789', 1),
('Pedro', 'López', 'plopez', 'pedro.lopez@example.com', 'clave333', '3456-7890', 1),
('Elena', 'García', 'egarcia', 'elena.garcia@example.com', 'clave444', '4567-8901', 1),
('Santiago', 'Martínez', 'smartinez', 'santiago.martinez@example.com', 'clave555', '5678-9012', 1),
('Lucía', 'Rodríguez', 'lrodriguez', 'lucia.rodriguez@example.com', 'clave666', '6789-0123', 1),
('Andrés', 'Hernández', 'ahernandez', 'andres.hernandez@example.com', 'clave777', '7890-1234', 1),
('Clara', 'Ramírez', 'cramirez', 'clara.ramirez@example.com', 'clave888', '8901-2345', 1),
('Tomás', 'Ruiz', 'truiz', 'tomas.ruiz@example.com', 'clave999', '9012-3456', 1),
('Paula', 'Torres', 'ptorres', 'paula.torres@example.com', 'clave1010', '0123-4567', 1),
('Diego', 'Ortiz', 'dortiz', 'diego.ortiz@example.com', 'clave1111', '1234-6789', 1),
('Alicia', 'Morales', 'amorales', 'alicia.morales@example.com', 'clave1212', '2345-7890', 1),
('Javier', 'Silva', 'jsilva', 'javier.silva@example.com', 'clave1313', '3456-8901', 1),
('Mariana', 'Mendoza', 'mmendoza', 'mariana.mendoza@example.com', 'clave1414', '4567-9012', 1),
('Gabriel', 'Cruz', 'gcruz', 'gabriel.cruz@example.com', 'clave1515', '5678-0123', 1),
('Irene', 'Ramos', 'iramos', 'irene.ramos@example.com', 'clave1616', '6789-1234', 1),
('Raúl', 'Vega', 'rvega', 'raul.vega@example.com', 'clave1717', '7890-2345', 1),
('Victoria', 'Reyes', 'vreyes', 'victoria.reyes@example.com', 'clave1818', '8901-3456', 1),
('Enrique', 'Jiménez', 'ejimenez', 'enrique.jimenez@example.com', 'clave1919', '9012-4567', 1),
('Natalia', 'Blanco', 'nblanco', 'natalia.blanco@example.com', 'clave2020', '0123-5678', 1);

SELECT * FROM clientes;

INSERT INTO vehiculos (id_marca, id_modelo, id_cliente, placa_vehiculo, año_vehiculo, color_vehiculo, vin_motor) VALUES
(1, 1, 1, 'ABC-123', '2015', 'Rojo', '1HGCM82633A123456'),
(2, 2, 2, 'DEF-456', '2017', 'Azul', '2HGCM82633A654321'),
(3, 3, 3, 'GHI-789', '2019', 'Negro', '3HGCM82633A789123'),
(4, 4, 4, 'JKL-012', '2020', 'Blanco', '4HGCM82633A321654'),
(5, 5, 5, 'MNO-345', '2018', 'Gris', '5HGCM82633A987654'),
(6, 6, 6, 'PQR-678', '2021', 'Rojo', '6HGCM82633A456789'),
(7, 7, 7, 'STU-901', '2016', 'Azul', '7HGCM82633A567890'),
(8, 8, 8, 'VWX-234', '2019', 'Negro', '8HGCM82633A654987'),
(9, 9, 9, 'YZA-567', '2020', 'Blanco', '9HGCM82633A321987'),
(10, 10, 10, 'BCD-890', '2017', 'Gris', '0HGCM82633A987123'),
(1, 11, 11, 'EFG-123', '2015', 'Rojo', '1HGCM82633A654321'),
(2, 12, 12, 'HIJ-456', '2016', 'Azul', '2HGCM82633A123987'),
(3, 13, 13, 'KLM-789', '2017', 'Negro', '3HGCM82633A789654'),
(4, 14, 14, 'NOP-012', '2018', 'Blanco', '4HGCM82633A321987'),
(5, 15, 15, 'QRS-345', '2019', 'Gris', '5HGCM82633A987321'),
(6, 16, 16, 'TUV-678', '2020', 'Rojo', '6HGCM82633A654789'),
(7, 17, 17, 'WXY-901', '2021', 'Azul', '7HGCM82633A123456'),
(8, 18, 18, 'ZAB-234', '2018', 'Negro', '8HGCM82633A987654'),
(9, 19, 19, 'CDE-567', '2019', 'Blanco', '9HGCM82633A321654'),
(10, 20, 20, 'FGH-890', '2020', 'Gris', '0HGCM82633A654123');

SELECT * FROM vehiculos;

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

INSERT INTO citas (id_cliente, id_vehiculo, id_servicio, fecha_cita, estado_cita) VALUES
(1, 1, 1, '2024-07-01', 'Pendiente'),
(2, 2, 2, '2024-08-02', 'Completada'),
(3, 3, 3, '2024-08-03', 'Cancelada'),
(4, 4, 4, '2024-08-04', 'Pendiente'),
(5, 5, 5, '2024-08-05', 'Completada'),
(6, 6, 6, '2024-08-06', 'Cancelada'),
(7, 7, 7, '2024-08-07', 'Pendiente'),
(8, 8, 8, '2024-08-08', 'Completada'),
(9, 9, 9, '2024-08-09', 'Cancelada'),
(10, 10, 10, '2024-08-10', 'Pendiente'),
(11, 11, 11, '2024-08-11', 'Completada'),
(12, 12, 12, '2024-08-12', 'Cancelada'),
(13, 13, 13, '2024-08-13', 'Pendiente'),
(14, 14, 14, '2024-08-14', 'Completada'),
(15, 15, 15, '2024-08-15', 'Cancelada'),
(16, 16, 16, '2024-08-16', 'Pendiente'),
(17, 17, 17, '2024-08-17', 'Completada'),
(18, 18, 18, '2024-08-18', 'Cancelada'),
(19, 19, 19, '2024-08-19', 'Pendiente'),
(20, 20, 20, '2024-08-20', 'Completada'),
(10, 10, 10, '2022-01-10', 'Completada'),
(11, 11, 11, '2022-01-11', 'Completada'),
(12, 12, 12, '2022-01-12', 'Completada'),
(13, 13, 13, '2022-01-13', 'Completada'),
(14, 14, 14, '2022-01-14', 'Completada'),
(15, 15, 15, '2022-01-15', 'Completada'),
(16, 16, 16, '2022-01-16', 'Completada'),
(17, 17, 17, '2022-01-17', 'Completada'),
(18, 18, 18, '2022-01-18', 'Completada'),
(19, 19, 19, '2022-01-19', 'Completada'),
(20, 20, 20, '2022-01-20', 'Completada'),
(1, 1, 1, '2023-01-01', 'Completada'),
(2, 2, 2, '2023-01-02', 'Completada'),
(3, 3, 3, '2023-01-03', 'Cancelada'),
(4, 4, 4, '2023-01-04', 'Completada'),
(5, 5, 5, '2023-01-05', 'Completada'),
(6, 6, 6, '2023-01-06', 'Completada'),
(7, 7, 7, '2023-01-07', 'Completada'),
(8, 8, 8, '2023-01-08', 'Completada'),
(9, 9, 9, '2023-01-09', 'Cancelada'),
(10, 10, 10, '2024-01-10', 'Pendiente'),
(11, 11, 11, '2024-01-11', 'Pendiente'),
(12, 12, 12, '2024-01-12', 'Cancelada'),
(13, 13, 13, '2024-01-13', 'Pendiente'),
(14, 14, 14, '2024-01-14', 'Pendiente'),
(15, 15, 15, '2024-01-15', 'Cancelada'),
(16, 16, 16, '2024-01-16', 'Pendiente'),
(17, 17, 17, '2024-01-17', 'Pendiente'),
(18, 18, 18, '2024-01-18', 'Pendiente'),
(19, 19, 19, '2024-01-19', 'Pendiente'),
(20, 20, 20, '2024-01-20', 'Pendiente');

SELECT * FROM citas;

INSERT INTO piezas (id_cliente, nombre_pieza, descripcion_pieza, precio_unitario) VALUES
(1, 'Filtro de aceite', 'Filtro de aceite para motor', 15.50),
(2, 'Filtro de aire', 'Filtro de aire para motor', 12.00),
(3, 'Pastillas de freno', 'Juego de pastillas de freno delanteras', 45.00),
(4, 'Batería', 'Batería para auto 12V', 120.00),
(5, 'Bujías', 'Juego de 4 bujías para motor', 35.00),
(6, 'Amortiguador delantero', 'Amortiguador delantero derecho', 75.00),
(7, 'Amortiguador trasero', 'Amortiguador trasero izquierdo', 70.00),
(8, 'Correa de distribución', 'Correa de distribución para motor', 55.00),
(9, 'Discos de freno', 'Juego de discos de freno delanteros', 80.00),
(10, 'Radiador', 'Radiador para sistema de enfriamiento', 150.00),
(11, 'Alternador', 'Alternador para sistema eléctrico', 250.00),
(12, 'Motor de arranque', 'Motor de arranque para encendido', 180.00),
(13, 'Faro delantero', 'Faro delantero derecho', 100.00),
(14, 'Parachoques delantero', 'Parachoques delantero', 200.00),
(15, 'Parabrisas', 'Parabrisas delantero', 300.00),
(16, 'Espejo retrovisor', 'Espejo retrovisor izquierdo', 50.00),
(17, 'Silenciador', 'Silenciador para sistema de escape', 130.00),
(18, 'Catalizador', 'Catalizador para sistema de escape', 220.00),
(19, 'Embrague', 'Kit de embrague', 400.00),
(20, 'Compresor de aire', 'Compresor para aire acondicionado', 350.00);

SELECT * FROM piezas;

INSERT INTO inventario (id_pieza, cantidad_disponible, proveedor, fecha_ingreso) VALUES
(1, 100, 'Proveedor A', '2024-08-01'),
(2, 150, 'Proveedor B', '2024-08-02'),
(3, 200, 'Proveedor C', '2024-08-03'),
(4, 75, 'Proveedor D', '2024-08-04'),
(5, 50, 'Proveedor E', '2024-08-05'),
(6, 120, 'Proveedor F', '2024-08-06'),
(7, 90, 'Proveedor G', '2024-08-07'),
(8, 110, 'Proveedor H', '2024-08-08'),
(9, 130, 'Proveedor I', '2024-08-09'),
(10, 80, 'Proveedor J', '2024-08-10'),
(11, 60, 'Proveedor A', '2024-08-11'),
(12, 140, 'Proveedor B', '2024-08-12'),
(13, 170, 'Proveedor C', '2024-08-13'),
(14, 200, 'Proveedor D', '2024-08-14'),
(15, 100, 'Proveedor E', '2024-08-15'),
(16, 90, 'Proveedor F', '2024-08-16'),
(17, 85, 'Proveedor G', '2024-08-17'),
(18, 70, 'Proveedor H', '2024-08-18'),
(19, 65, 'Proveedor I', '2024-08-19'),
(20, 55, 'Proveedor J', '2024-08-20');

SELECT * FROM inventario;

INSERT INTO detalle_citas(id_pieza,id_cita, cantidad)
VALUES 
(1,1,5),
(2,2,4),
(3,3,7),
(4,4,2),
(5,5,3),
(6,6,10),
(7,7,6),
(8,8,2),
(9,9,1),
(10,10,6),
(11,11,3),
(12,12,2),
(13,13,8),
(14,14,7),
(15,15,3),
(16,16,2),
(17,17,5),
(18,18,2),
(19,19,1),
(20,20,7),
(1,21,8),
(2,22,3),
(3,23,2),
(4,24,1),
(5,25,8),
(6,26,7),
(7,27,6),
(8,28,5),
(9,29,4),
(10,30,4),
(11,31,7),
(12,32,3),
(13,33,2),
(14,34,1),
(15,35,2),
(16,36,3),
(17,37,5),
(18,38,3),
(19,39,2),
(20,40,2),
(11,41,7),
(12,42,3),
(13,43,2),
(14,44,1),
(15,45,2),
(16,46,3),
(17,47,5),
(18,48,3),
(19,49,2),
(20,50,2);