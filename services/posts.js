const PostModel = require("../models/post");
const UserModel = require("../models/user");
class Posts {
  async create(data) {
    const post = await PostModel.create(data);
    console.log(post);
    return post;
  }

  async update(id, data) {
    /* si post es undefined me tira error, es decir, si intenta actualizar un post que no existe entonces rompe el servidor */
    const post = await PostModel.findById(id);
    console.log(post, data.userId);
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

  async likeDisLike(id, data) {
    /* si intenta dar like a un post que no existe, rompe todo */
    const post = await PostModel.findById(id);
    console.log(post);
    if (!post.likes.includes(data.userId)) {
      await post.updateOne({ $push: { likes: data.userId } });
      return { success: true, message: "The post has been liked" };
    } else {
      await post.updateOne({ $pull: { likes: data.userId } });
      return { success: true, message: "The post has been disliked" };
    }
  }

  async get(id) {
    /* si le paso un id que no existe, me devuelve null */
    const post = await PostModel.findById(id);
    return post;
  }

  async timeline(userId) {
    const currentUser = await UserModel.findById(userId);
    const userPosts = await PostModel.find({ userId: currentUser._id });
    const friendPosts = await Promise.all(
      currentUser.followings.map((friendId) => {
        return PostModel.find({ userId: friendId });
      })
    );
    return userPosts.concat(...friendPosts);
  }

  async timelineProfile(username) {
    /* {username:username} */
    const user = await UserModel.findOne({ username });
    const posts = await PostModel.find({ userId: user._id });
    return posts;
  }
}

module.exports = Posts;
