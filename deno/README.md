# Using TiDB Serverless with Deno

TiDB Serverless is a globally distributed, fully managed SQL database service that offers MySQL compatibility. This makes it an excellent choice for applications requiring a scalable, serverless database solution without the hassle of managing infrastructure. We'll use the TiDB Serverless driver, `@tidbcloud/serverless`, for interaction within Deno environments.

## Setting Up Your Project

Begin by creating a `main.ts` file and importing necessary modules:

```typescript
import { serve } from "https://deno.land/std/http/server.ts";
import { config } from 'https://deno.land/x/dotenv/mod.ts';
import { connect } from "npm:@tidbcloud/serverless";
```

## Configuring the Connection

To connect to a TiDB Serverless database, you need a database URL. This can be obtained after creating a database on TiDB Serverless. Follow the setup instructions provided in the [TiDB documentation](https://docs.pingcap.com/tidbcloud/create-tidb-cluster-serverless).

Securely store your database URL in an environment variable in .env file:

```bash
DATABASE_URL=<your_database_url>
```

For production in deno deploy, you can set the environment variables in the dashboard.

Load this environment variable in your `main.ts` file:

```typescript
// Load environment variables
const env = config();
```

Establish a connection to your TiDB Serverless database:

```typescript
const conn = connect({ url: env.DATABASE_URL });
```

This method is also compatible with Deno Deploy by setting the environment variables in its dashboard.

## Creating and Populating the Database Table

With the connection established, create and populate your database table using SQL commands:

```typescript
await conn.execute("DROP TABLE IF EXISTS posts");
await conn.execute(
  "CREATE TABLE posts (id int NOT NULL AUTO_INCREMENT PRIMARY KEY, title varchar(255) NOT NULL, body varchar(255) NOT NULL);",
);
await conn.execute(
  "INSERT INTO `posts` (title, body) VALUES ('title1', 'body1'), ('title2', 'body2')"
);
```

## Implementing the HTTP Server

Create an HTTP server to handle requests, including a specific route to fetch data from the database:

```typescript
serve(async (req) => {
  const url = new URL(req.url);

  if (url.pathname === "/posts") {
    const posts = await conn.execute("SELECT * FROM `posts`");
    return new Response(JSON.stringify(posts.rows), {
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response("Not found", { status: 404 });
}, { port: 8000 });

console.log("HTTP server running on http://localhost:8000");
```

Execute your Deno application, ensuring permissions for network access, environment variables, and reading the environment config file are granted:

```shell
deno run --allow-net --allow-env --allow-read main.ts
```

## TiDB Serverless and MySQL Compatibility

An important feature of TiDB Serverless is its compatibility with MySQL. This means you can use TiDB as a drop-in replacement for MySQL, leveraging existing tools and libraries designed for MySQL without significant changes to your application code.

## Conclusion

This README guides you through setting up a simple Deno application that interacts with a TiDB Serverless database. TiDB Serverless's global distribution and MySQL compatibility make it an ideal choice for scalable, serverless applications. For further information and advanced features, consult the [TiDB documentation](https://docs.pingcap.com/tidbcloud/).

