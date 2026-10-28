import dotenv from 'dotenv';
const envPath = new URL("./.env", import.meta.url).pathname;
dotenv.config({ path: envPath});
import { build } from "./app.ts";
import { db } from "./config/postgresql.ts";
import { resend } from "./config/resend.ts";

const server = await build(db, resend);
server.listen(process.env.PORT, () => {
    console.log(`Server is running smooth on PORT: ${process.env.PORT}`)
});
