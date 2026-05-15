import { Router, Request, Response } from 'express';
import { register, login } from '../services/auth.service';
import { authenticate, AuthRequest } from '../middleware/auth.middleware';
import prisma from '../lib/prisma';
// register, login -the function we built in auth.service
// authenticate, AuthRequest -the middleware and custom request type we built 
// prisma to fetch the user profile in /me

const router = Router();
// creates a container for all the routes

router.post('/register', async (req: Request, res: Response) => {
  try {
    const { email, username, password } = req.body;
    const user = await register(email, username, password);
    res.status(201).json(user);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});
// router.post -listens for POST requests since we're sendind data
// req.body -where Express reads the JSON body the frontend sends
// register(...) calls out service function
// res.status 201 means created 
// try/cathch -if service trhows an error, send back error

router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const { token, user } = await login(email, password);

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json(user);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/me', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: { id: true, email: true, username: true, createdAt: true },
    });
    res.json(user);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/logout', (req: Request, res: Response) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out successfully' });
});

export default router;

// defines the 4 auth endpoints. Register, login, get profile, and logout. It uses the auth service and middleware we already built