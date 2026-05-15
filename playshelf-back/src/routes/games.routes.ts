import { Request, Response, Router } from "express";
// Router -Express tool to define routes in a separated file instead of all in index.ts
// Request -TypeScript type for the incoming HTTP request has req.query, req,params etc
// Response TypeScript type for outgoing HTTP response res.json(), res.send(), etc
import { getGameById, getGames, getGenres } from "../services/rawg.service";

const router = Router();
// creates a mini expres app just for game routes. Think of it as a container that holds all your /api/games routes

router.get('/', async (req: Request, res: Response) => {
  // router.get -listens for get requests
  // '/' -the path, this means /api/games
  // async -because we need to wait for RAWG to respond
  const { search, page } = req.query;
  // req.query reads the URL query parameters
  // this gives you example, search="zelda" and page="2"
  const data = await getGames(search as string, Number(page) || 1);
  // search as string tells TypeScript to treat search as string (query params can be multiple types)
  // Number(page) || 1 -converts page to a number , if it's missing or invalid defaults to 1 
  // awit -waits for RAWG to respond before continuing
  res.json(data);
  // sends the RAWG response to the frontend a JSON
});

router.get('/genres', async (req: Request, res: Response) => {
  const data = await getGenres();
  res.json(data);
});
// no params needed, just fetch all genres and return them. 
// /genres is definded before /:id -this important because if it was after, Exprss would think genres is an ID

router.get('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  // /:id the : means it's a dynamic parameter /api/games123 gives you id = "123"
  // req.params -where Express stores URL parameters like :id
  const data = await getGameById(id as string);
  res.json(data);
});

export default router;

//This file defines 3 game endpoints from the plan. It recives HTTP request, calls the RAWG service, and sends the data back to whoever asked. 
