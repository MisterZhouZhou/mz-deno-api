import { DB } from "$sqlite";

// Open a database
const sqlitDb = new DB(`${Deno.cwd()}/api/db/mz-deno-api.db`);

export default sqlitDb