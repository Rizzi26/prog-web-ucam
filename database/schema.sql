-- T-Shirt Store — relational schema (MySQL / MariaDB)
-- UCAM Web Programming — Phase 2
-- Import order: run this file first, then seed.sql.

CREATE DATABASE IF NOT EXISTS tshirt_store
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE tshirt_store;

-- Drop in reverse dependency order so the script is re-runnable.
DROP TABLE IF EXISTS invoices;
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS product_variants;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS users;

-- Client logic: registered customers and administrators.
CREATE TABLE users (
    id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name          VARCHAR(120)  NOT NULL,
    email         VARCHAR(190)  NOT NULL UNIQUE,
    password_hash VARCHAR(255)  NOT NULL,
    role          ENUM('customer','admin') NOT NULL DEFAULT 'customer',
    created_at    DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Catalog products.
CREATE TABLE products (
    id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(150)   NOT NULL,
    description TEXT           NULL,
    price       DECIMAL(8,2)   NOT NULL,
    image       VARCHAR(255)   NULL,
    active      TINYINT(1)     NOT NULL DEFAULT 1,
    created_at  DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Stock control per design (product) and size/color variant.
CREATE TABLE product_variants (
    id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    product_id INT UNSIGNED   NOT NULL,
    size       VARCHAR(10)    NOT NULL,
    color      VARCHAR(40)    NOT NULL,
    stock_qty  INT UNSIGNED   NOT NULL DEFAULT 0,
    UNIQUE KEY uq_variant (product_id, size, color),
    CONSTRAINT fk_variant_product
        FOREIGN KEY (product_id) REFERENCES products(id)
        ON DELETE CASCADE
) ENGINE=InnoDB;

-- Sales: one order per checkout.
CREATE TABLE orders (
    id             INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id        INT UNSIGNED NOT NULL,
    status         ENUM('pending','paid','cancelled') NOT NULL DEFAULT 'pending',
    total          DECIMAL(10,2) NOT NULL DEFAULT 0,
    address        VARCHAR(255)  NOT NULL,
    payment_method VARCHAR(40)   NOT NULL,
    created_at     DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_order_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE
) ENGINE=InnoDB;

-- Line items of each order.
CREATE TABLE order_items (
    id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    order_id   INT UNSIGNED  NOT NULL,
    variant_id INT UNSIGNED  NOT NULL,
    quantity   INT UNSIGNED  NOT NULL DEFAULT 1,
    unit_price DECIMAL(8,2)  NOT NULL,
    CONSTRAINT fk_item_order
        FOREIGN KEY (order_id) REFERENCES orders(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_item_variant
        FOREIGN KEY (variant_id) REFERENCES product_variants(id)
) ENGINE=InnoDB;

-- Invoices / reports: one invoice per paid order.
CREATE TABLE invoices (
    id        INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    order_id  INT UNSIGNED  NOT NULL UNIQUE,
    number    VARCHAR(30)   NOT NULL UNIQUE,
    issued_at DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    total     DECIMAL(10,2) NOT NULL,
    CONSTRAINT fk_invoice_order
        FOREIGN KEY (order_id) REFERENCES orders(id)
        ON DELETE CASCADE
) ENGINE=InnoDB;
