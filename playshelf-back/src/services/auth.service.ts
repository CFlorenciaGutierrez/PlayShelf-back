import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma';
// bcrypt for hashing and comparing password
// jwt for creating and verifying tokens
// prisma -our database client to read/write users

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN!;
// Reads your secret key and explanation time from .env. The ! tells TypeScript thes exists

export const register = async (email: string, username: string, password: string) => {
  // An async function that receives the three fields the user fills when registering
  const existingUser = await prisma.user.findFirst({
    where: { OR: [{ email }, { username }] },
  });
  // checks if user with that email or username already exists in the DB 
  // findFirst -returns the first match it finds
  // OR -either condition can match

  if (existingUser) {
    throw new Error('Email or username already exists');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  // bcrypt converts the plain text password into hashed string
  // 10 the salt rounds, how many times it processes the hash. 10 is the standard

  const user = await prisma.user.create({
    data: { email, username, password: hashedPassword },
  });
  // creates the new user in the DB with the hashed password.

  return { id: user.id, email: user.email, username: user.username };
  // returns the user without the password.
};

export const login = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  // findUnique -finds exactly one user by email

  if (!user) {
    throw new Error('Invalid credentials');
  }

  const validPassword = await bcrypt.compare(password, user.password);
  // bcrypt.compare -hashes the incoming password and copares it to stores hash

  if (!validPassword) {
    throw new Error('Invalid credentials');
  }

  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

  return { token, user: { id: user.id, email: user.email, username: user.username } };
  // for front
};

// in general this file handles all auth logic. Register creates a new user, login checks credentials and returns a JWT token. The routes will just call these functions