import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;
// reads the secret from .env

export interface AuthRequest extends Request {
  userId?: number;
}
// interface a TypeScript way to define the shape of an object
// extends Request -takes everything Express Request already has adds to it userId=:number
export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  // The middleware function takes req, res and next
  const token = req.cookies?.token;
// reads the JWT token from the cookies
// ? optional chaining if cookies is undefines returns undefined
  if (!token) {
    res.status(401).json({ error: 'No token provided' });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
    // jwt.verify checks if the token is valid and not expires using the secret
    // if the token was faked or expired throws error y va al catch
    //  as { userId: number } - tells TypeScript what sahpe thedecoded token has 
    req.userId = decoded.userId;
    next();
    // Attaches the userid to the equest so the route can use it 
    // next( -every thing is ok, move on)
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};

// this middleware is code that runs between the request arriving and th route handling it. This one checks if the user is logged in before allowing acces to pretected routes like /api/library