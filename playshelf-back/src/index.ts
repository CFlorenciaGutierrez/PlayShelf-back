import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import gamesRouter from './routes/games.routes';
import cookieParser from 'cookie-parser';
import authRouter from './routes/auth.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

app.get('/', (reg,res) => {
  res.json({ message: 'PlayShelf API running 🎮' })
});

app.use('/api/games', gamesRouter);
app.use('/api/auth', authRouter);
// mounts all the game routes /api/games
// router.get('/') becomes /api/games
// router.get('/genres') becomes /api/games/genres
// router.get('/:id') becomes /api/games/:id

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
});