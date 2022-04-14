const UserModel = require("../models/user");
const bcrypt = require("bcrypt");
/* No me deja utilizar los servicios de Auth const Authh = require("./auth"); */
class Users {
    async hashPassword(password) {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        return hash;
    }

    async getByEmail(email) {
        const user = await UserModel.findOne({ email: email });
        return user;
    }

    async getByFilter(filter) {
        const user = await UserModel.findOne(filter);
        return user;
    }

    async getByUserId(userId) {
        const user = await UserModel.findById(userId);
        return user;
    }

    /* Get a user by his id or username */
    async get(query, which) {
        /* console.log(query, which); */
        let user;
        if (which) {
            /* console.log(`Busco por userId`); */
            user = await UserModel.findById(query);
        } else {
            /*   console.log(`Busco por name`); */
            user = await UserModel.findOne({ name: query });
        }
        /* filtra las cosas que devuelve como el password y updatedAt, user._doc son donde se encuentra los datos del usuario */
        const { password, updatedAt, ...other } = user._doc;
        /*  console.log(`esto devuelve`, other._id); */
        return other;
    }

    /* Gets all users excluding the parameter username */
    /* update the name, no puede ser getAll */
    /* En SQL sería SELECT * FROM users WHERE username != ${username} */
    async getAll(name) {
        /* console.log(name); */
        try {
            const users = await UserModel.find();
            let usersList = [];
            users.map((user) => {
                const { _id, name, img } = user;
                usersList.push({ _id, name, img });
            });
            const response = usersList.filter(
                (userList) => userList.name !== name
            );
            /*    console.log(response); */
            return response;
        } catch (error) {
            /*   console.log(error); */
        }
    }

    /* Get the data of the followings of a certain user */
    /* trae los datos de las personas que sigue cierto [usuario] */
    /* userFollowings tendría que ser el nombre técnico? */
    async usernameFriend(userId) {
        const user = await UserModel.findById(userId).populate(
            "followings",
            "name img"
        );
        /*  const friends = await Promise.all(
            user.followings.map((friendId) => {
                return this.getByUserId(friendId);
            })
        ); */
        return user;
    }

    async create(data) {
        const user = await UserModel.create(data);
        return user;
    }

    async update(id, data) {
        /* Este if es para validar si esta editando su cuenta, es decir, el envía su id y si el id que quiere editar es igual a su id entonces se cumple y procede a editarse en la base de datos */
        if (data.userId === id || data.isAdmin) {
            /* hace esto porque si actualiza la contraseña habría que volver a hashearla, esto no lo consideré en el proyecto de movies */
            if (data.password) {
                data.password = await this.hashPassword(data.password);
            }
        } else {
            return {
                success: false,
                message: "You can update only your account!",
            };
        }
        // {new:true} is to return me the new data
        const user = await UserModel.findByIdAndUpdate(id, data, { new: true });
        return { success: true, message: "Account has been updated" };
    }

    async delete(id, data) {
        /* Este if es para validar si esta eliminando su cuenta, es decir, el envía su id y si el id que quiere eliminar es igual a su id entonces se cumple y procede a eliminarse en la base de datos */
        if (data.userId === id || data.isAdmin) {
            const user = await UserModel.findByIdAndDelete(id);
            return { success: true, message: "Account has been deleted" };
        } else {
            return {
                success: false,
                message: "You can delete only your account!",
            };
        }
    }

    /* yo creo que tendría que ser así */
    /* data: follower data, id: following id */
    async follow(data, id) {
        if (data.userId !== id) {
            const user = await UserModel.findById(id);
            const currentUser = await UserModel.findById(data.userId);
            if (!user.followers.includes(data.userId)) {
                await user.updateOne({ $push: { followers: data.userId } });
                await currentUser.updateOne({
                    $push: { followings: id },
                });
                return { success: true, message: "user has been followed" };
            } else {
                return {
                    success: false,
                    message: "you already follow this user",
                };
            }
        } else {
            return { success: false, message: "you can't follow yourself" };
        }
    }

    /* data: current user, id: user */
    async unfollow(data, id) {
        if (data.userId !== id) {
            const user = await UserModel.findById(id);
            const currentUser = await UserModel.findById(data.userId);
            if (user.followers.includes(data.userId)) {
                await user.updateOne({ $pull: { followers: data.userId } });
                await currentUser.updateOne({
                    $pull: { followings: id },
                });
                return { success: true, message: "user has been unfollowed" };
            } else {
                return {
                    success: false,
                    message: "you don't follow this user",
                };
            }
        } else {
            return { success: false, message: "you can't unfollow yourself" };
        }
    }
}
module.exports = Users;
