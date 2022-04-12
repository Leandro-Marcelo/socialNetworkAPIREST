const { mongoose } = require("../config/db");

const { Schema } = mongoose;

const userSchema = new Schema(
    {
        name: {
            type: String,
        },
        email: {
            type: String,
            max: 50,
        },
        password: {
            type: String,
        },
        img: {
            type: String,
            default: "",
        },
        coverPicture: {
            type: String,
            default: "",
        },
        followers: {
            type: Array,
            default: [],
        },
        followings: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "users",
            },
        ],
        isAdmin: {
            type: Boolean,
            default: false,
        },
        desc: {
            type: String,
            default: "",
        },
        city: {
            type: String,
        },
        from: {
            type: String,
        },
        fileKey: String,
        /*   relationship: {
            type: Number,
            enum: [1, 2, 3],
        }, */
        role: Number,
    },
    { timestamps: true }
);

const UserModel = mongoose.model("users", userSchema);

module.exports = UserModel;
