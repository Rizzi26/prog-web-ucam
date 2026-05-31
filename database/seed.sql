-- T-Shirt Store — seed data
-- Run AFTER schema.sql.
--
-- Demo accounts (passwords are bcrypt-hashed below):
--   admin@tshirt.store    / admin123     (role: admin)
--   cliente@tshirt.store  / cliente123   (role: customer)

USE tshirt_store;

INSERT INTO users (name, email, password_hash, role) VALUES
('Store Admin', 'admin@tshirt.store',
 '$2y$12$Gr5IQGymnwYU3uqma28tpOSEnaVEmLDQGzOrFXbTAN8Uv795ysIuy', 'admin'),
('Demo Customer', 'cliente@tshirt.store',
 '$2y$12$NNMZ8g3XdUL2Mh0HhJhznOxPWUk8DJ/dOJuV3zkXhfjFzEciwW/9i', 'customer');

INSERT INTO products (id, name, description, price, image, active) VALUES
(1, 'Basic Black', 'Classic black cotton t-shirt.', 15.90, 'camisa_preta.jpg', 1),
(2, 'Basic Blue',  'Comfortable blue cotton t-shirt.', 19.90, 'camisa_azul.jpg', 1),
(3, 'Basic Pink',  'Soft pink cotton t-shirt.', 12.90, 'camisa_rosa.jpg', 1),
(4, 'Basic Gray',  'Premium gray cotton t-shirt.', 29.90, 'camisa_cinza.jpg', 1);

-- Stock per size for each design.
INSERT INTO product_variants (product_id, size, color, stock_qty) VALUES
(1, 'S', 'Black', 10), (1, 'M', 'Black', 15), (1, 'L', 'Black', 8),
(2, 'S', 'Blue', 12),  (2, 'M', 'Blue', 20),  (2, 'L', 'Blue', 5),
(3, 'S', 'Pink', 7),   (3, 'M', 'Pink', 9),   (3, 'L', 'Pink', 4),
(4, 'M', 'Gray', 6),   (4, 'L', 'Gray', 6),   (4, 'XL', 'Gray', 3);
