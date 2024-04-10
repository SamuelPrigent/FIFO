import { Document } from "mongoose";

// === Interface ===
export interface ICredit extends Document {
  name: string;
  number: number;
  maxNumber: number;
}

export interface ApiResponse {
  message?: string;
}
