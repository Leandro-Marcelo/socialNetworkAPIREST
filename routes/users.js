const Users = require("../services/users");
const express = require("express");
/* yo utilizo bcrypt en un middleware */
/* const bcrypt = require("bcrypt"); */

function users(app) {
    const router = express.Router();
    const usersService = new Users();
    app.use("/users", router);

    /* Get a user by their id or username  (query) */
    router.get("/", async (req, res) => {
        const { name } = req.query;
        const { userId } = req.query;
        const user = userId
            ? await usersService.get(userId, true)
            : await usersService.get(name, false);
        return res.status(200).json(user);
    });

    /* Get all users except the user making the query */
    /* /all/users?username=${username} */
    router.get("/all/users", async (req, res) => {
        const { name } = req.query;
        const usersList = await usersService.getAll(name);
        return res.status(200).json(usersList);
    });

    /* get friends, devuelve las personas que sigue el usuario */
    /* Get the followings of a certain user */
    router.get("/friend/:userId", async (req, res) => {
        /* console.log(req.params.userId); */
        const friendList = await usersService.usernameFriend(req.params.userId);
        return res.status(200).json(friendList);
    });

    /* Update a user by his id (params) */
    router.put("/:id", async (req, res) => {
        const { id } = req.params;
        const response = await usersService.update(id, req.body);
        if (!response.success) {
            return res.status(403).json(response);
        }
        return res.status(200).json(response);
    });

    /* Delete a user by his id (params) */
    router.delete("/:id", async (req, res) => {
        const { id } = req.params;
        const response = await usersService.delete(id, req.body);
        if (!response.success) {
            return res.status(403).json(response);
        }
        return res.status(200).json(response);
    });

    /* Follow a user by his id */
    router.put("/:id/follow", async (req, res) => {
        const { id } = req.params;
        const response = await usersService.follow(req.body, id);
        if (!response.success) {
            return res.status(403).json(response);
        }
        return res.status(200).json(response);
    });

    /* Unfollow a user by his id */
    router.put("/:id/unfollow", async (req, res) => {
        const { id } = req.params;
        const response = await usersService.unfollow(req.body, id);
        if (!response.success) {
            return res.status(403).json(response);
        }
        return res.status(200).json(response);
    });
}
module.exports = users;
