import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";

const read = (path) => readFileSync(new URL(path, import.meta.url), "utf8");
for (const path of [
  "../src/server.js", "../src/db.js", "../src/middleware/auth.js",
  "../src/routes/auth.js", "../src/routes/children.js", "../src/routes/curriculum.js",
  "../migrations/001_initial_schema.sql", "../migrations/002_seed_starter_lessons.sql"
]) assert.ok(existsSync(new URL(path, import.meta.url)), `Missing backend file: ${path}`);

const auth = read("../src/routes/auth.js");
const middleware = read("../src/middleware/auth.js");
const children = read("../src/routes/children.js");
const curriculum = read("../src/routes/curriculum.js");
const schema = read("../migrations/001_initial_schema.sql");
const seed = read("../migrations/002_seed_starter_lessons.sql");

assert.match(auth, /bcrypt\.hash/);
assert.match(auth, /adultConfirmation: z\.literal\(true\)/);
assert.match(auth, /expiresIn: "2h"/);
assert.match(middleware, /issuer: "kiddie-genius-world", audience: "kgw-parent"/);
assert.match(children, /parent_id = \\$2/);
assert.match(children, /parent_id = \\$2/);
assert.match(children, /parent_id = \\$2/);
assert.match(curriculum, /published = TRUE/);
assert.match(schema, /REFERENCES parents\(id\) ON DELETE CASCADE/);
assert.match(schema, /UNIQUE \(child_id, lesson_id\)/);
for (const grade of ["'K'", "'1'", "'2'", "'3'", "'4'", "'5'"]) assert.ok(seed.includes(grade));
for (const code of ["MA.K.NSO.1.1","MA.1.NSO.1.1","MA.2.NSO.1.1","MA.3.NSO.1.1","MA.4.NSO.1.1","MA.5.NSO.1.1","ELA.K.F.1.2"]) assert.ok(seed.includes(code));

console.log("Backend foundation smoke tests passed.");
