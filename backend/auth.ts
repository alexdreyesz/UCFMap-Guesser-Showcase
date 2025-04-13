import bcrypt from "bcryptjs";
import express, { Request } from "express";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { createUser, getUserById, getUserByUsername, UCFMapUser } from "./database/user.js";

const router = express.Router();

// Passport Local Strategy for login
passport.use(new LocalStrategy(async (username, password, done) => {
  try {
    const user = await getUserByUsername(username.toLowerCase());
    if (!user || !bcrypt.compareSync(password, user.password)) {
      console.log("Failed");
      return done(null, false, { message: "Incorrect username or password" });
    }
    console.log("Success!");
    return done(null, user);
  } catch (err) {
    return done(err);
  }
})
);

// This will add the user type to the request object
declare global {
  namespace Express {
    interface User extends UCFMapUser { }
  }
}
passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await getUserById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

// Register a new user
router.post("/register", async (req: Request, res: express.Response): Promise<void> => {
  const { email, username, password } = req.body;

  if (!email || !username || !password) {
    res.status(400).json({ success: false, message: "Missing fields" });
    return;
  }

  try {
    const hashedPassword = bcrypt.hashSync(password, 14);
    const newUser = await createUser({
      email,
      username: username.toLowerCase(),
      password: hashedPassword
    });

    res.json({
      success: true,
      user: {
        userID: newUser.id,
        email: newUser.email,
        username: newUser.username
      }
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ success: false, message: "Registration failed", error: err.message });
  }
});

// Log in an existing user
router.post("/login", (req: Request, res: express.Response, next) => {
  passport.authenticate("local", (err, user) => {
    if (err) return next(err);
    if (!user) return res.json({ loggedIn: false });

    req.logIn(user, (err) => {
      if (err) return next(err);
      return res.json({ loggedIn: true });
    });
  })(req, res, next);
});

// Logout current user
router.post("/logout", (req: Request, res: express.Response, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.json({ success: true });
  });
});

export default router;
