import fs from "fs";
import path from "path";
import Database from "better-sqlite3";

type DbInstance = InstanceType<typeof Database>;

let dbInstance: DbInstance | null = null;

function resolveDbPath() {
  const rawPath = process.env.QORATOSH_DB_PATH ?? "qoratosh.sqlite";
  return path.isAbsolute(rawPath) ? rawPath : path.join(process.cwd(), rawPath);
}

function ensureDatabase(): DbInstance {
  if (dbInstance) {
    return dbInstance;
  }

  const dbPath = resolveDbPath();
  const dbDir = path.dirname(dbPath);
  fs.mkdirSync(dbDir, { recursive: true });
  const db = new Database(dbPath);
  db.pragma("journal_mode = WAL");

  db.exec(`
    CREATE TABLE IF NOT EXISTS tours (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT NOT NULL DEFAULT '',
      country TEXT NOT NULL,
      city TEXT NOT NULL,
      start_date TEXT NOT NULL,
      end_date TEXT NOT NULL,
      adults_min INTEGER NOT NULL,
      adults_max INTEGER NOT NULL,
      price_from INTEGER NOT NULL,
      nights INTEGER NOT NULL,
      image_url TEXT NOT NULL,
      is_hot INTEGER NOT NULL DEFAULT 0,
      tour_type TEXT NOT NULL DEFAULT 'regular',
      gallery_urls TEXT NOT NULL DEFAULT '[]'
    );
  `);

  const existingColumns = db
    .prepare("PRAGMA table_info(tours)")
    .all()
    .map((row) => (row as { name: string }).name);

  if (!existingColumns.includes("description")) {
    db.exec("ALTER TABLE tours ADD COLUMN description TEXT NOT NULL DEFAULT '';");
  }
  if (!existingColumns.includes("tour_type")) {
    db.exec("ALTER TABLE tours ADD COLUMN tour_type TEXT NOT NULL DEFAULT 'regular';");
  }
  if (!existingColumns.includes("gallery_urls")) {
    db.exec("ALTER TABLE tours ADD COLUMN gallery_urls TEXT NOT NULL DEFAULT '[]';");
  }
  if (existingColumns.includes("gallery_json")) {
    db.exec(
      "UPDATE tours SET gallery_urls = gallery_json WHERE gallery_urls = '[]' AND gallery_json != '[]';"
    );
  }
  const normalizeStoredDate = (value: string) => {
    if (/^\d{2}\.\d{2}\.\d{4}$/.test(value)) {
      const [day, month, year] = value.split(".");
      return `${year}-${month}-${day}`;
    }
    if (/^\d{2}-\d{2}-\d{4}$/.test(value)) {
      const [day, month, year] = value.split("-");
      return `${year}-${month}-${day}`;
    }
    return value;
  };
  const dateRows = db
    .prepare("SELECT id, start_date, end_date FROM tours")
    .all();
  const updateDates = db.prepare(
    "UPDATE tours SET start_date = @start_date, end_date = @end_date WHERE id = @id"
  );
  const updateDatesTx = db.transaction((rows) => {
    for (const row of rows as Array<{ id: string; start_date: string; end_date: string }>) {
      const nextStart = normalizeStoredDate(row.start_date);
      const nextEnd = normalizeStoredDate(row.end_date);
      if (nextStart !== row.start_date || nextEnd !== row.end_date) {
        updateDates.run({ id: row.id, start_date: nextStart, end_date: nextEnd });
      }
    }
  });
  updateDatesTx(dateRows);
  const localizedColumns = [
    "title_ru",
    "title_uz",
    "title_en",
    "description_ru",
    "description_uz",
    "description_en",
    "country_ru",
    "country_uz",
    "country_en",
    "city_ru",
    "city_uz",
    "city_en",
  ];
  for (const column of localizedColumns) {
    if (!existingColumns.includes(column)) {
      db.exec(`ALTER TABLE tours ADD COLUMN ${column} TEXT NOT NULL DEFAULT '';`);
    }
  }
  db.prepare("UPDATE tours SET title_ru = title WHERE title_ru = ''").run();
  db.prepare("UPDATE tours SET title_uz = title WHERE title_uz = ''").run();
  db.prepare("UPDATE tours SET title_en = title WHERE title_en = ''").run();
  db.prepare("UPDATE tours SET description_ru = description WHERE description_ru = ''").run();
  db.prepare("UPDATE tours SET description_uz = description WHERE description_uz = ''").run();
  db.prepare("UPDATE tours SET description_en = description WHERE description_en = ''").run();
  db.prepare("UPDATE tours SET country_ru = country WHERE country_ru = ''").run();
  db.prepare("UPDATE tours SET country_uz = country WHERE country_uz = ''").run();
  db.prepare("UPDATE tours SET country_en = country WHERE country_en = ''").run();
  db.prepare("UPDATE tours SET city_ru = city WHERE city_ru = ''").run();
  db.prepare("UPDATE tours SET city_uz = city WHERE city_uz = ''").run();
  db.prepare("UPDATE tours SET city_en = city WHERE city_en = ''").run();
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
    .map((row) => (row as { name: string }).name);
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

  const seedTourIds = new Set([
    "sharm-2025-10",
    "istanbul-2025-09",
    "dubai-2025-11",
  ]);
  const existingTours = db
    .prepare("SELECT id FROM tours")
    .all()
    .map((row) => (row as { id: string }).id);
  if (
    existingTours.length > 0 &&
    existingTours.every((id) => seedTourIds.has(id))
  ) {
    const deleteSeed = db.prepare("DELETE FROM tours WHERE id = ?");
    const deleteMany = db.transaction((rows) => {
      for (const id of rows) {
        deleteSeed.run(id);
      }
    });
    deleteMany(existingTours);
  }
  dbInstance = db;
  return dbInstance;
}

export default ensureDatabase;
