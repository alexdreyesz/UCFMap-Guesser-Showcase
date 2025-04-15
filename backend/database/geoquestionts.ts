import mongoose from "mongoose";

export type UCFMapGeoQuestion = {
  id?: string;
  location: { longitude: number, latitude: number };
  imageURL: string;
  authorId: string
};

const GeoQuestion = mongoose.model(
  "Teasures",
  new mongoose.Schema<UCFMapGeoQuestion>({
    location: {
      type: {
        longitude: { type: Number, required: true },
        latitude: { type: Number, required: true },
      },
      required: true,
    },
    imageURL: { type: String, required: true },
    authorId: { type: String, required: true },
  })
);


/**
 * Create a new geo question in the database
 * @param geoQuestion - The geo question to create
 * @param geoQuestion.location - The location of the geo question
 * @param geoQuestion.location.longitude - The longitude of the geo question
 * @param geoQuestion.location.latitude - The latitude of the geo question
 * @param geoQuestion.imageURL - The image URL of the geo question
 * @returns the created geo question object
 */
export async function createGeoQuestion(
  geoQuestion: UCFMapGeoQuestion
): Promise<UCFMapGeoQuestion> {
  const dbGeoQuestion = new GeoQuestion({
    location: {
      longitude: geoQuestion.location.longitude,
      latitude: geoQuestion.location.latitude,
    },
    imageURL: geoQuestion.imageURL,
    authorId: geoQuestion.authorId,
  });
  await dbGeoQuestion.save();
  return {
    id: dbGeoQuestion._id.toString(),
    location: {
      longitude: geoQuestion.location.longitude,
      latitude: geoQuestion.location.latitude,
    },
    imageURL: geoQuestion.imageURL,
    authorId: geoQuestion.authorId,
  };
}

/*
*
@param geoQuestionId - The mongoose document ID of the geo question to retrieve
@param id - The ID of the geo question to retrieve
* @returns the geo question object if found
*/
export async function getGeoQuestionById(id: string): Promise<UCFMapGeoQuestion | null> {
  return await GeoQuestion.findById(id).exec();
}


/**
 * Find a random geo question in the database
 * @param {string} [geoQuestionId] - The mongoose document ID of the geo question to retrieve
 * @returns a random geo question object if found
 * @returns null if no geo question was found    
 */
export async function getRandomGeoQuestion(): Promise<UCFMapGeoQuestion | null> {
  const count = await GeoQuestion.countDocuments();
  const random = Math.floor(Math.random() * count);
  const result = await GeoQuestion.findOne().skip(random).exec();
  if (!result) {
    return null;
  }
  return {
    id: result._id.toString(),
    location: {
      longitude: result.location.longitude,
      latitude: result.location.latitude,
    },
    imageURL: result.imageURL,
    authorId: result.authorId,
  }
}

/**
 * delete a geo question in the database
 * @param geoQuestionId - The mongoose document ID of the geo question to delete
 * @returns the deleted geo question object if found
 * @returns null if the geo question was not found
 */
export async function deleteGeoQuestion(
  geoQuestionId: string
): Promise<UCFMapGeoQuestion | null> {
  const geoQuestion = await GeoQuestion.findByIdAndDelete(geoQuestionId);
  if (!geoQuestion) return null;
  return {
    id: geoQuestion._id.toString(),
    location: {
      longitude: geoQuestion.location.longitude,
      latitude: geoQuestion.location.latitude,
    },
    imageURL: geoQuestion.imageURL,
    authorId: geoQuestion.authorId,
  };
}


/**
 * 
 * @returns all geo questions in the database
 */
export async function getAllGeoQuestions(): Promise<UCFMapGeoQuestion[]> {
  const geoQuestions = await GeoQuestion.find();
  return geoQuestions.map((geoQuestion) => ({
    id: geoQuestion._id.toString(),
    location: {
      longitude: geoQuestion.location.longitude,
      latitude: geoQuestion.location.latitude,
    },
    imageURL: geoQuestion.imageURL,
    authorId: geoQuestion.authorId,
  }));
}







