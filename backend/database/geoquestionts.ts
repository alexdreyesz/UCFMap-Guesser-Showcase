import mongoose, { Document, Schema } from "mongoose";

export type UCFMapGeoQuestion = {
  id?: string;
  location: { longitude: number, latitude: number };
  imageURL: string;
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
  })
);

