const express = require("express");
const router = express.Router();
const Message = require("../dao/models/message.model");

router.get("/", async (req, res) => {
    try {
        const messages = await Message.find().lean();
        res.render("chat", { messages });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error obteniendo mensajes");
    }
});

router.post("/sendMessage", async (req, res) => {
    let new_message = req.body;
    try {
        const newMessage = new Message({
             user: new_message.user,
             message: new_message.message 
        });
        await newMessage.save();
        res.redirect("/chat");
    } catch (error) {
        console.error(error);
        res.status(500).send("Error enviando mensaje");
    }
});

module.exports = router;
