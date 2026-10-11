CREATE DATABASE IF NOT EXISTS tcc_leite;
USE tcc_leite;
CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    senha VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO usuarios (nome, email) VALUES 
('Maria Silva', 'maria@email.com'),
('João Souza', 'joao@email.com');