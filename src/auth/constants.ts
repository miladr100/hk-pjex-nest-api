require('dotenv').config();

export const jwtConstants = {
  secret: process.env.DATABASE_JWT_SECRET_KEY,
};
