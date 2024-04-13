import mongoose, { Schema } from "mongoose";
import { ICredit } from "../types/types.js";
import { allType } from "../constants/constants.js";

const creditSchema: Schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (value: string): boolean {
        // pour ne pas invalider minuscules
        const uppercaseValue: string = value.toUpperCase();
        return allType.includes(uppercaseValue);
      },
      message: (props: { value: string }): string =>
        `${props.value} n'est pas une valeur valide pour le champ 'name'`,
    },
  },
  number: { type: Number, required: true },
  maxNumber: { type: Number, required: true },
});

// name --> majuscules
creditSchema.pre<ICredit>("save", function (next) {
  if (this.isModified("name")) {
    this.name = this.name.toUpperCase();
  }
  next();
});

const Credit = mongoose.model<ICredit>("Credit", creditSchema);

export { Credit };
