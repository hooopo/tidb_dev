// Import necessary modules
import { serve } from "https://deno.land/std/http/server.ts";
import { config } from 'https://deno.land/x/dotenv/mod.ts';
import { connect } from "npm:@tidbcloud/serverless";

// Load environment variables
const env = config();

async function main() {
  // Connect to the database
  const conn = connect({ url: env.DATABASE_URL });

  // Database setup
  await conn.execute("DROP TABLE IF EXISTS posts");
  await conn.execute(
    "CREATE TABLE posts (id int NOT NULL AUTO_INCREMENT PRIMARY KEY, title varchar(255) NOT NULL, body varchar(255) NOT NULL);",
  );
  await conn.execute(
    "INSERT INTO `posts` (title, body) VALUES ('title1', 'body1'), ('title2', 'body2')"
  );

  // Create and start the HTTP server
  serve(async (req) => {
    const url = new URL(req.url);

    // Route to fetch posts
    if (url.pathname === "/posts") {
      const posts = await conn.execute("SELECT * FROM `posts`");
      return new Response(JSON.stringify(posts), {
        headers: { "Content-Type": "application/json" },
      });
    }

    // Fallback route
    return new Response("Not found", { status: 404 });
  }, { port: 8000 });

  console.log("HTTP server running on http://localhost:8000");
}

main();

