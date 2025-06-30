import { DataSource } from 'typeorm';
import { User } from '../entities/User';
import { Content } from '../entities/Content';

// Database configuration with hardcoded values
// Main database configuration
const dbConfig = {
  type: 'mysql' as const,
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'password',
  database: 'content_management',
  synchronize: true,
  logging: true,
  entities: [User, Content],
  migrations: ['src/migrations/*.ts'],
  subscribers: [],
  charset: 'utf8mb4',
  timezone: 'Z',
  connectTimeout: 10000,
  acquireTimeout: 10000,
  dateStrings: true,
  supportBigNumbers: true,
  bigNumberStrings: true,
  extra: {
    connectionLimit: 10,
    // Set SQL mode to be more permissive with timestamps
    init: (connection: any) => {
      connection.query(`
        SET SESSION sql_mode = 'NO_ENGINE_SUBSTITUTION,NO_ZERO_DATE,NO_ZERO_IN_DATE';
      `);
    }
  }
};

// Log database configuration
console.log('Database configuration:', {
  host: dbConfig.host,
  port: dbConfig.port,
  database: dbConfig.database,
  username: dbConfig.username,
});

// Create and export the data source
export const AppDataSource = new DataSource(dbConfig);