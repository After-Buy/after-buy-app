import * as SQLite from "expo-sqlite";

export const db = SQLite.openDatabaseSync("afterbuy.db");

export const initDatabase = async () => {
  await db.execAsync("PRAGMA foreign_keys = ON;");

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS folders (
      folder_id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      parent_folder_id INTEGER,
      folder_name TEXT NOT NULL,
      created_at TEXT DEFAULT (DATETIME('now')),
      updated_at TEXT DEFAULT (DATETIME('now')),
      FOREIGN KEY (parent_folder_id) REFERENCES folders (folder_id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS devices (
      device_id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      folder_id INTEGER,
      product_name TEXT NOT NULL,
      model_name TEXT NOT NULL,
      brand TEXT NOT NULL,
      image_url TEXT,
      product_link_url TEXT,
      purchase_date TEXT NOT NULL,
      purchase_price REAL NOT NULL,
      purchase_store TEXT,
      warranty_months INTEGER NOT NULL,
      warranty_expiry_date TEXT NOT NULL,
      serial_number TEXT,
      memo TEXT,
      created_at TEXT DEFAULT (DATETIME('now')),
      updated_at TEXT DEFAULT (DATETIME('now')),
      FOREIGN KEY (folder_id) REFERENCES folders (folder_id) ON DELETE CASCADE
    );
  `);
};
