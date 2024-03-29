import mongoose from "mongoose";

const validNames = ["A", "B", "C"];

const creditSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (value) {
        // pour ne pas invalider minuscules
        const uppercaseValue = value.toUpperCase();
        return validNames.includes(uppercaseValue);
      },
      message: (props) =>
        `${props.value} n'est pas une valeur valide pour le champ 'name'`,
    },
  },
  number: { type: Number, required: true },
});

// name --> majuscules
creditSchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.name = this.name.toUpperCase();
  }
  next();
});

const Credit = mongoose.model("Credit", creditSchema);

export default Credit;
