const mongoose = require("mongoose");
const roomSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "房型必填"],
    },
    price: {
      type: Number,
      required: [true, "價格必填"],
    },
    rating: Number,
    createAt: {
      type: Date,
      default: Date.now,
      select: false,
    },
  },
  { versionKey: false }
);
const Room = mongoose.model("room", roomSchema);

module.exports = Room;
