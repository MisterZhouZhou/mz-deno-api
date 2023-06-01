import { serve } from "https://deno.land/std/http/server.ts";

serve((_: Request) => new Response("Hello World"), { port: 3000});