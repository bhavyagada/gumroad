-- Drop existing tables
DROP TABLE IF EXISTS Link;
DROP TABLE IF EXISTS File;
DROP TABLE IF EXISTS Purchase;
DROP TABLE IF EXISTS Permalink;
DROP TABLE IF EXISTS User;

-- Create Link table if it doesn't exist
CREATE TABLE IF NOT EXISTS Link (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    owner TEXT NOT NULL,
    name TEXT NOT NULL,
    unique_permalink TEXT NOT NULL,
    url TEXT NOT NULL,
    preview_url TEXT,
    description TEXT,
    price REAL NOT NULL DEFAULT 1.00,
    create_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    length_of_exclusivity INTEGER DEFAULT 0,
    number_of_paid_downloads INTEGER DEFAULT 0,
    number_of_downloads INTEGER DEFAULT 0,
    download_limit INTEGER DEFAULT 0,
    number_of_views INTEGER DEFAULT 0,
    balance REAL DEFAULT 0.00
);

-- Create File table if it doesn't exist
CREATE TABLE IF NOT EXISTS File (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    unique_permalink TEXT NOT NULL,
    blob_key TEXT,
    file_name TEXT,
    file_type TEXT,
    date DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create Purchase table if it doesn't exist
CREATE TABLE IF NOT EXISTS Purchase (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    owner TEXT NOT NULL,
    unique_permalink TEXT NOT NULL,
    price REAL NOT NULL,
    create_date DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create Permalink table if it doesn't exist
CREATE TABLE IF NOT EXISTS Permalink (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    permalink TEXT NOT NULL
);

-- Create User table if it doesn't exist
CREATE TABLE IF NOT EXISTS User (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL,
    payment_address TEXT,
    name TEXT,
    password TEXT NOT NULL,
    salt TEXT NOT NULL,
    reset_hash TEXT,
    create_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    balance REAL DEFAULT 0.00
);

-- Create unique indexes if they don't exist
CREATE UNIQUE INDEX IF NOT EXISTS idx_link_permalink ON Link (unique_permalink);
CREATE UNIQUE INDEX IF NOT EXISTS idx_file_permalink ON File (unique_permalink);
CREATE UNIQUE INDEX IF NOT EXISTS idx_purchase_permalink ON Purchase (unique_permalink);
CREATE UNIQUE INDEX IF NOT EXISTS idx_permalink ON Permalink (permalink);
CREATE UNIQUE INDEX IF NOT EXISTS idx_user_email ON User (email);
