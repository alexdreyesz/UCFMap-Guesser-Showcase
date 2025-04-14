import express from "express";
import { createGeoQuestion, getGeoQuestionById, deleteGeoQuestion, getRandomGeoQuestion, UCFMapGeoQuestion } from "./database/geoquestionts.js";

const router = express.Router();

//register a new treasure
router.post("/treasure", async (req: express.Request, res: express.Response): Promise<void> => {
  try {
    const { location, imageURL }: UCFMapGeoQuestion = req.body;
    if (!location || !imageURL) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }
    const newTreasure = await createGeoQuestion({ location, imageURL });
    res.status(201).json(newTreasure);
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