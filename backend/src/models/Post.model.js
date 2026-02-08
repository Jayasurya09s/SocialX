const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    username: String,

    text: String,
    emojis: [String],
    imageUrl: String,

    poll: {
      question: String,
      options: [
        {
          text: String,
          votes: [String] // userIds
        }
      ]
    },

    likes: [
      {
        userId: String,
        username: String
      }
    ],
    comments: [
      {
        userId: String,
        username: String,
        text: String,
        createdAt: { type: Date, default: Date.now }
      }
    ],

    shares: [String]     // userIds
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", PostSchema);
