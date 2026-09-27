-- Datos de ejemplo para pruebas manuales.
-- La contraseña en texto plano de este admin es "Admin123" (hashéala con bcrypt
-- antes de insertar; este INSERT es solo ilustrativo del formato esperado).

INSERT INTO products (name, description, price, stock) VALUES
  ('Teclado mecánico', 'Teclado mecánico switches rojos', 899.00, 25),
  ('Mouse inalámbrico', 'Mouse ergonómico 2.4GHz', 349.50, 60),
  ('Monitor 27" 144Hz', 'Panel IPS, HDR400', 4599.00, 10);
