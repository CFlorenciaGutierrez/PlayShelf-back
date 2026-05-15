import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import gamesRouter from './routes/games.routes'

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use('/api/games', gamesRouter);
// mounts all the game routes /api/games
// router.get('/') becomes /api/games
// router.get('/genres') becomes /api/games/genres
// router.get('/:id') becomes /api/games/:id

app.get('/', (req, res) => {
  res.json({ message: 'PlayShelf API running 🎮' })
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
});