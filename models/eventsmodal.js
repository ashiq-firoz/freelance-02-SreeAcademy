const mongoose = require("mongoose");

const eventListSchema = mongoose.Schema(
    {
      user: {
        type: String,
        required: [true, "Please add user"],
        trim: true,
      },
      event: {
        type: String,
        required: [true, "Please add event"],
        trim: true,
      },
      
    },
    {
      timestamps: true,
    }
  );
  
  const EventList = mongoose.model("EventsList", eventListSchema);
  module.exports = EventList;
  