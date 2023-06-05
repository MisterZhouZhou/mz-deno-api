import { DB } from "$sqlite";
import { assertEquals, assertNotEquals, assertThrows } from "$testing/asserts.ts";
import sqlitDb from './sqlit.ts'

Deno.test("test-connect sqlit db", async() => {
  const db = new DB("./deno-api.db");
  await assertNotEquals(db, null, 'sqlit db 连接失败');
  db.close()
});

Deno.test("test-create table people", () => {
  sqlitDb.execute(`
    CREATE TABLE IF NOT EXISTS people (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT
    )
  `);
  try {
    sqlitDb.query('SELECT * FROM people')
  } catch (e) {
    assertThrows(() => {
      console.log("err: ", e);
    });
  }
});

Deno.test("test-insert to table people", () => {
  sqlitDb.execute(`
    CREATE TABLE IF NOT EXISTS people (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT
    )
  `);
  for (const name of ["Peter Parker", "Clark Kent", "Bruce Wayne"]) {
    sqlitDb.query("INSERT INTO people (name) VALUES (?)", [name]);
  }
  const rows = sqlitDb.query('SELECT * FROM people')
  assertEquals(rows.length.toString(), '3', 'sqlit insert error')
});


Deno.test("test-query all table people", () => {
  sqlitDb.execute(`
    CREATE TABLE IF NOT EXISTS people (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT
    )
  `);
  const rows = sqlitDb.query('SELECT name FROM people')
  assertEquals(rows.length.toString(), '3', 'sqlit query error')
});
