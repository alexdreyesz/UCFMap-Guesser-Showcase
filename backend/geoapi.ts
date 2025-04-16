import express from "express";
import multer from "multer";
import { createGeoQuestion, deleteGeoQuestion, getAllGeoQuestions, getGeoQuestionById, getRandomGeoQuestion } from "./database/geoquestionts.js";

// Import Multer types
import { File as MulterFile } from "multer";

// Extend the Request interface to include the 'file' property
declare global {
  namespace Express {
    interface Request {
      file?: MulterFile;
    }
  }
}

const router = express.Router();

// Setup disk storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Make sure this folder exists
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.mimetype.split('/')[1]); // Use the original file extension
  }
});

const upload = multer({ storage: storage });

//register a new treasure
router.post("/create", upload.single('image'), async (req: express.Request, res: express.Response): Promise<void> => {
  try {
    console.log("req.body: ", req.body);
    console.log("req.file: ", req.file.path);
    console.log("req.file: ", req.file);
    if (req.isAuthenticated()) {
      const location = JSON.parse(req.body.location);
      const imageURL = req.file ? req.file.path : req.body.imageURL; // Use the file path from multer
      if (!location || !imageURL || !location.longitude || !location.latitude) {
        res.status(400).json({ error: "Missing required fields" });
        return;
      }
      const newTreasure = await createGeoQuestion({ location, imageURL, authorId: req.user.id });
      res.status(201).json(newTreasure);
    } else {
      console.log("User not authenticated", req.user);
      res.status(401).json({ error: "User not authenticated" });
    }
  } catch (err) {
    console.error("Error creating treasure: ", err);
    res.status(500).json({ error: "Server error while creating treasure" });
  }
});

//get a treasure by id
router.get("/treasure/:treasureId", async (req: express.Request, res: express.Response): Promise<void> => {
  try {
    const { treasureId } = req.params;
    const treasure = await getGeoQuestionById(treasureId);
    if (!treasure) {
      res.status(404).json({ error: "Treasure not found" });
      return;
    }
    res.status(200).json(treasure);
  } catch (err) {
    console.error("Error fetching treasure: ", err);
    res.status(500).json({ error: "Server error while fetching treasure" });
  }
});

//get all treasures by id
router.get("/treasures", async (req: express.Request, res: express.Response): Promise<void> => {
  try {
    const allGeoQuestions = await getAllGeoQuestions();
    if (!allGeoQuestions || allGeoQuestions.length === 0) {
      res.status(404).json({ error: "No treasures found" });
      return;
    }
    res.status(200).json(allGeoQuestions);
  } catch (err) {
    console.error("Error fetching geoquestions: ", err);
    res.status(500).json({ error: "Server error while fetching geoquestions" });
  }
});

//get a random treasure
router.get("/treasure/random", async (req: express.Request, res: express.Response): Promise<void> => {
  try {
    const treasure = await getRandomGeoQuestion();
    if (!treasure) {
      res.status(404).json({ error: "No treasures found" });
      return;
    }
    res.status(200).json(treasure);
  } catch (err) {
    console.error("Error fetching random treasure: ", err);
    res.status(500).json({ error: "Server error while fetching random treasure" });
  }
});

//delete a treasure by id
router.delete("/treasure/:treasureId", async (req: express.Request, res: express.Response): Promise<void> => {
  try {
    const { treasureId } = req.params;
    const deletedTreasure = await deleteGeoQuestion(treasureId);
    if (!deletedTreasure) {
      res.status(404).json({ error: "Treasure not found" });
      return;
    }
    res.status(200).json(deletedTreasure);
  } catch (err) {
    console.error("Error deleting treasure: ", err);
    res.status(500).json({ error: "Server error while deleting treasure" });
  }
});

//export the router
export default router;