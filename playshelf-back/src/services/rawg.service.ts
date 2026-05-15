import dotenv from 'dotenv'

// Loads .env so process.env.RAWG_API_KEY is available in this file
dotenv.config()

const RAWG_BASE_URL = 'https://api.rawg.io/api'
const API_KEY = process.env.RAWG_API_KEY
// stores the base URL and API KEY in constants so it dos'nt 
// repeat them in every function

export const getGames = async (search?: string, page = 1) => {
  // async because fetching data takes time, we need to wait for the response
  // search?: string search is optional, the ? means you can call getGames() without it
  // page = 1 if no pages is provided, default to page 1 
  const params = new URLSearchParams({
    key: API_KEY!,
    page: String(page),
    page_size: '20',
    ...(search && { search }),
  })
  // URLSearchParams builds the query string for the URL like ? key=abc&page=1&page_size=20
  // API_KEY! the ! tells TypeScript trust me, this is not undefined
  // String(page) converts the number to string because URLs only have strings
  // ...(search && { search }) only adds search to the params if it was provided

  const res = await fetch(`${RAWG_BASE_URL}/games?${params}`)
  return res.json()
  // fetch makes the HTTP request to RAWG
  // await waits for RAWG to respond before continuing
  // res.json( converts the response to a javascript object)
}

export const getGameById = async (id: string) => {
  const res = await fetch (`${RAWG_BASE_URL}/games/${id}?key=${API_KEY}`)
  return res.json()
}
// Fetches a single game its ID. The ID goes directly in the URL path

export const getGenres = async () => {
  const res = await fetch(`${RAWG_BASE_URL}/genres?key=${API_KEY}`)
  return res.json()
}
// Fetches all available genres from RAWG no estra params needed

// In resume it's the bridge to RAWG 
// Every time the app needs game data instead of talking to RAWG directly from the routes, it goes through this file. It handles: 
// Where to go- the RAWG base URL
// hOW TO AUTHENTICATE- ATTACHING THE api KEY TO EVERY REQUEST
// What to ask for - game list, single game, or genres

