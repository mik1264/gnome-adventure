// Database configuration
module.exports = {
  database: {
    // For production, use environment variables
    connectionString: process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_Fimuh2wyV7PL@ep-floral-butterfly-afh31i6b-pooler.c-2.us-west-2.aws.neon.tech/neondb?sslmode=require',
    ssl: {
      rejectUnauthorized: false
    }
  },
  server: {
    port: process.env.PORT || 3000,
    cors: {
      origin: process.env.FRONTEND_URL || '*'
    }
  }
}; 