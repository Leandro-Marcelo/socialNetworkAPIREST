const Posts = require("../services/posts");
const express = require("express");
/* yo utilizo bcrypt en un middleware */
/* const bcrypt = require("bcrypt"); */

function users(app) {
  const router = express.Router();
  const postsService = new Posts();
  app.use("/api/posts", router);

  router.post("/", async (req, res) => {
    const newPost = await postsService.create(req.body);
    return res.status(200).json(newPost);
  });

  //update a post

  router.put("/:id", async (req, res) => {
    const { id } = req.params;
    /* le envio el id del post que quiero modificar y mi id */
    const response = await postsService.update(id, req.body);
    if (!response.success) {
      return res.status(403).json(response);
    }
    return res.status(200).json(response);
  });

  //delete a post

  router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    /* le envio el id del post que quiero eliminar y mi id */
    const response = await postsService.delete(id, req.body);
    if (!response.success) {
      return res.status(403).json(response);
    }
    return res.status(200).json(response);
  });

  router.put("/:id/like", async (req, res) => {
    const { id } = req.params;
    /* le envio el id del post que quiero likear/deslikear y mi id */
    const response = await postsService.likeDisLike(id, req.body);
    return res.status(200).json(response);
  });

  router.get("/:id", async (req, res) => {
    const { id } = req.params;
    /* le envio el id del post que quiero obtener, aquí no es necesario poner mi id aunque podría pedirlo para luego saber que anda buscando BOEEE */
    const response = await postsService.get(id);
    return res.status(200).json(response);
  });

  /* No tendría que ser un get, tendría que ser un post porque estoy enviando un json */
  router.get("/timeline/:userId", async (req, res) => {
    /* le envio mi id */
    const response = await postsService.timeline(req.params.userId);
    return res.status(200).json(response);
  });

  /* obtener todos los posts del usuario, pero solo los del usuario esto es para el profile del usuario en el front */
  router.get("/profile/:username", async (req, res) => {
    /* le envio mi id */
    const response = await postsService.timelineProfile(req.params.username);
    return res.status(200).json(response);
  });
}

module.exports = users;
