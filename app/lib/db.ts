import postgres from "postgres";

function getConnectionUrl(): string {
  const url = process.env.POSTGRES_URL;
  if (!url) {
    throw new Error("POSTGRES_URL is not set. Please define it in .env.local.");
  }

  // When Next.js runs on the host (not inside Docker), the hostname "db"
  // cannot be resolved. Since compose.yml maps port 5432 to the host,
  // we replace "db" with "localhost" so the host process can reach it.
  return url.replace(/@db\b/g, "@localhost");
}

function createSql(): postgres.Sql {
  const resolvedUrl = getConnectionUrl();

  const isLocal =
    resolvedUrl.includes("localhost") || resolvedUrl.includes("127.0.0.1");
  const ssl = isLocal ? false : "require";

  return postgres(resolvedUrl, { ssl });
}

const sql = createSql();

export default sql;
