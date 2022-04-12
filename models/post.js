const { mongoose } = require("../config/db");

const { Schema } = mongoose;

const postSchema = new Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
        },
        desc: {
            type: String,
            max: 500,
        },
        img: {
            type: String,
        },
        likes: {
            type: Array,
            default: [],
        },
    },
    { timestamps: true }
);

const PostModel = mongoose.model("posts", postSchema);

module.exports = PostModel;
