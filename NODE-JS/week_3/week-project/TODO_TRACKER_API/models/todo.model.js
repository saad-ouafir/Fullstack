const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    dueDate: {
      type: Date,
      default: null,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },
  },
  {
    timestamps: true, // pour joutee automatiquement createdAt et updatedAt
  }
);

todoSchema.index({ user: 1, completed: 1 });
todoSchema.index({ user: 1, priority: 1 });
todoSchema.index({title: 1, user: 1},{unique: true});

module.exports = mongoose.model("Todo", todoSchema);
