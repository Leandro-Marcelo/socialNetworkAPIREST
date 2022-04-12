const PostModel = require("../models/post");
const UserModel = require("../models/user");
const { uploadFile } = require("../libs/storage");
const UserService = require("./users");
class Posts {
    /*   async create(data) {
        const post = await PostModel.create(data);
        console.log(post);
        return post;
    } */

    async create(data, file) {
        /* console.log(`file ori..:`, file?.originalname);
        console.log(`file.buffer:`, file?.buffer); */
        let uploaded;
        if (file) {
            uploaded = await uploadFile(file?.originalname, file?.buffer);
            /* al momento de subir el archivo, guardar eso mismo en el modelo de archivos para luego utilizarlo al momento de gestionar los permisos */
        }
        if (uploaded?.success) {
            const newTeam = {
                ...data,
                img: "/files/" + uploaded.fileName,
                fileKey: uploaded.fileName,
            };
            const post = await PostModel.create(newTeam);

            return post;
        } else {
            const newTeam = {
                ...data,
            };
            const post = await PostModel.create(newTeam);
            return post;
        }
    }

    async update(id, data) {
        /* si post es undefined me tira error, es decir, si intenta actualizar un post que no existe entonces rompe el servidor */
        const post = await PostModel.findById(id);
        /* console.log(post, data.userId); */
        /* comprueba si el post que quiero actualizar es mio, si bien quizas en la ui no le muestre la opción de editar un post que no es de él, igual es bueno que en caso de que lo haga de alguna forma tampoco le deje el servidor */
        if (post.userId === data.userId) {
            await post.updateOne({ $set: data });
            return { success: true, message: "the post has been updated" };
        } else {
            return { success: false, message: "you can update only your post" };
        }
    }

    async delete(id, data) {
        const post = await PostModel.findById(id);
        if (post.userId === data.userId) {
            /* se elimina asi mismo */
            await post.deleteOne();
            return { success: true, message: "the post has been deleted" };
        } else {
            return { success: false, message: "you can delete only your post" };
        }
    }

    /* si intenta dar like a un post que no existe, rompe todo */
    /* data: userId, id: postId */
    async likeDislike(data, id) {
        const post = await PostModel.findById(id);
        if (!post.likes.includes(data.userId)) {
            await post.updateOne({ $push: { likes: data.userId } });
            return {
                success: true,
                message: "The post has been liked",
                likeIt: true,
            };
        } else {
            await post.updateOne({ $pull: { likes: data.userId } });
            return {
                success: true,
                message: "The post has been disliked",
                likeIt: false,
            };
        }
    }

    async get(id) {
        /* si le paso un id que no existe, el catch lo atrapa */
        try {
            const post = await PostModel.findById(id);
            return post;
        } catch (error) {
            /* console.log(`Handle error:`, error); */
        }
    }

    /* Get your posts and your friends' posts */
    /* friends / followings */
    async timeline(userId) {
        const currentUser = await UserModel.findById(userId);
        const userPosts = await PostModel.find({
            userId: currentUser._id,
        }).populate("userId", "name img");
        const friendPosts = await Promise.all(
            currentUser.followings.map((friendId) => {
                return PostModel.find({ userId: friendId }).populate(
                    "userId",
                    "name img"
                );
            })
        );
        console.log(userPosts);
        return userPosts.concat(...friendPosts);
    }

    /* Get only your posts */
    async timelineProfile(name) {
        const userService = new UserService();
        const user = await userService.getByFilter({ name });
        /*  console.log(user); */
        const posts = await PostModel.find({ userId: user._id }).populate(
            "userId",
            "name img"
        );
        return posts;
    }
}

module.exports = Posts;
