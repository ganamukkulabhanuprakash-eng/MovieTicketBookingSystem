-- ============================================================
-- CineVault Database Initialization Script
-- Run ONCE manually before starting the backend for the
-- first time, to create the database.
-- ============================================================

-- Create the database if it doesn't exist
CREATE DATABASE IF NOT EXISTS cinevault_db
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

-- Use it
USE cinevault_db;

-- Note: Spring Boot with Hibernate (ddl-auto=update) will
-- automatically create all the tables when the backend starts.
-- You do NOT need to create tables manually.
--
-- This script only creates the database schema container.

SELECT 'cinevault_db created successfully' AS status;
