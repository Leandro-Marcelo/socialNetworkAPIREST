const Users = require("../services/users");
const express = require("express");
/* yo utilizo bcrypt en un middleware */
/* const bcrypt = require("bcrypt"); */

function users(app) {
  const router = express.Router();
  const usersService = new Users();
  app.use("/api/users", router);

  router.get("/:id", async (req, res) => {
    const { id } = req.params;
    const user = await usersService.get(id);
    return res.status(200).json(user);
  });

  router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const response = await usersService.update(id, req.body);
    if (!response.success) {
      return res.status(403).json(response);
    }
    return res.status(200).json(response);
  });

  router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    const response = await usersService.delete(id, req.body);
    if (!response.success) {
      return res.status(403).json(response);
    }
    return res.status(200).json(response);
  });

  router.put("/:id/follow", async (req, res) => {
    const { id } = req.params;
    const response = await usersService.follow(id, req.body);
    if (!response.success) {
      return res.status(403).json(response);
    }
    return res.status(200).json(response);
  });

  router.put("/:id/unfollow", async (req, res) => {
    const { id } = req.params;
    const response = await usersService.unfollow(id, req.body);
    if (!response.success) {
      return res.status(403).json(response);
    }
    return res.status(200).json(response);
  });
}
module.exports = users;
