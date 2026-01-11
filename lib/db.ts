import fs from "fs";
import path from "path";
import Database from "better-sqlite3";

type DbInstance = Database.Database;

let dbInstance: DbInstance | null = null;

function ensureDatabase(): DbInstance {
  if (dbInstance) {
    return dbInstance;
  }

  const dataDir = path.join(process.cwd(), "data");
  fs.mkdirSync(dataDir, { recursive: true });
  const dbPath = path.join(dataDir, "tours.db");
  const db = new Database(dbPath);

  db.exec(`
    CREATE TABLE IF NOT EXISTS tours (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      country TEXT NOT NULL,
      city TEXT NOT NULL,
      start_date TEXT NOT NULL,
      end_date TEXT NOT NULL,
      adults_min INTEGER NOT NULL,
      adults_max INTEGER NOT NULL,
      price_from INTEGER NOT NULL,
      nights INTEGER NOT NULL,
      image_url TEXT NOT NULL,
      is_hot INTEGER NOT NULL DEFAULT 0
    );
  `);

  const existingColumns = db
    .prepare("PRAGMA table_info(tours)")
    .all()
    .map((row: { name: string }) => row.name);

  if (!existingColumns.includes("tour_type")) {
    db.exec("ALTER TABLE tours ADD COLUMN tour_type TEXT NOT NULL DEFAULT 'regular';");
  }
  if (!existingColumns.includes("gallery_json")) {
    db.exec("ALTER TABLE tours ADD COLUMN gallery_json TEXT NOT NULL DEFAULT '[]';");
  }
  db.prepare(
    "UPDATE tours SET tour_type = 'hot' WHERE is_hot = 1 AND tour_type != 'hot';"
  ).run();

  db.exec(`
    CREATE TABLE IF NOT EXISTS tour_types (
      code TEXT PRIMARY KEY,
      label_ru TEXT NOT NULL,
      label_uz TEXT NOT NULL,
      label_en TEXT NOT NULL DEFAULT ''
    );
  `);

  const typeColumns = db
    .prepare("PRAGMA table_info(tour_types)")
    .all()
    .map((row: { name: string }) => row.name);
  if (!typeColumns.includes("label_en")) {
    db.exec("ALTER TABLE tour_types ADD COLUMN label_en TEXT NOT NULL DEFAULT '';");
    db.prepare("UPDATE tour_types SET label_en = label_ru WHERE label_en = '';").run();
  }

  const typeCount = db.prepare("SELECT COUNT(1) as count FROM tour_types").get() as {
    count: number;
  };
  if (typeCount.count === 0) {
    const insertType = db.prepare(
      "INSERT INTO tour_types (code, label_ru, label_uz, label_en) VALUES (@code, @label_ru, @label_uz, @label_en);"
    );
    const seedTypes = [
      {
        code: "regular",
        label_ru: "\u041e\u0431\u044b\u0447\u043d\u044b\u0439",
        label_uz: "Oddiy",
        label_en: "Regular",
      },
      {
        code: "hot",
        label_ru: "\u0413\u043e\u0440\u044f\u0447\u0438\u0439 \u0442\u0443\u0440",
        label_uz: "Hot tur",
        label_en: "Hot tour",
      },
      {
        code: "promo",
        label_ru: "\u0410\u043a\u0446\u0438\u044f",
        label_uz: "Aksiya",
        label_en: "Promo",
      },
    ];
    const insertManyTypes = db.transaction((rows) => {
      for (const row of rows) {
        insertType.run(row);
      }
    });
    insertManyTypes(seedTypes);
  }

  const count = db.prepare("SELECT COUNT(1) as count FROM tours").get() as {
    count: number;
  };
  if (count.count === 0) {
    const insert = db.prepare(`
      INSERT INTO tours (
        id, title, country, city, start_date, end_date,
        adults_min, adults_max, price_from, nights, image_url, is_hot, tour_type
      ) VALUES (
        @id, @title, @country, @city, @start_date, @end_date,
        @adults_min, @adults_max, @price_from, @nights, @image_url, @is_hot, @tour_type
      );
    `);
    const seedTours = [
      {
        id: "sharm-2025-10",
        title: "Шарм-эль-Шейх",
        country: "Египет",
        city: "Шарм-эль-Шейх",
        start_date: "2025-10-12",
        end_date: "2025-10-19",
        adults_min: 1,
        adults_max: 4,
        price_from: 900,
        nights: 7,
        image_url:
          "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?q=80&w=1200&auto=format&fit=crop",
        is_hot: 1,
        tour_type: "hot",
      },
      {
        id: "istanbul-2025-09",
        title: "Стамбул",
        country: "Турция",
        city: "Стамбул",
        start_date: "2025-09-05",
        end_date: "2025-09-09",
        adults_min: 1,
        adults_max: 3,
        price_from: 520,
        nights: 4,
        image_url:
          "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?q=80&w=1200&auto=format&fit=crop",
        is_hot: 0,
        tour_type: "regular",
      },
      {
        id: "dubai-2025-11",
        title: "Дубай",
        country: "ОАЭ",
        city: "Дубай",
        start_date: "2025-11-02",
        end_date: "2025-11-08",
        adults_min: 2,
        adults_max: 6,
        price_from: 1200,
        nights: 6,
        image_url:
          "https://images.unsplash.com/photo-1504270997636-07ddfbd48945?q=80&w=1200&auto=format&fit=crop",
        is_hot: 1,
        tour_type: "hot",
      },
    ];
    const insertMany = db.transaction((rows) => {
      for (const row of rows) {
        insert.run(row);
      }
    });
    insertMany(seedTours);
  }

  dbInstance = db;
  return dbInstance;
}

export default ensureDatabase;
