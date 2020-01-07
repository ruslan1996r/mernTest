const { Router } = require("express");
const router = Router();
const shortid = require("shortid");

const Link = require("../models/Link");
const config = require("config");
const auth = require("../middleware/auth.middleware");

//Сгенерировать ссылку
router.post("/generate", auth, async (req, res) => {
  try {
    const baseUrl = config.get("baseUrl");
    const { from } = req.body;
    const code = shortid.generate();
    const existing = await Link.findOne({ from }); //если такой линк уже есть, то просто верни его

    if (existing) {
      return res.json({ link: existing });
    }

    const to = baseUrl + "/t/" + code;
    const link = new Link({
      code,
      to,
      from,
      owner: req.user.userId
    });
    await link.save();

    res.status(201).json({ link });
  } catch (e) {
    res.status(500).json({ message: "Что-то пошло не так. Попробуйте снова" });
  }
});

//Получить все для юзера
router.get("/", auth, async (req, res) => {
  try {
    const links = await Link.find({ owner: req.user.userId }); //req берётся из auth, userId содержится в токене
    res.json(links);
  } catch (e) {
    res.status(500).json({ message: "Что-то пошло не так. Попробуйте снова" });
  }
});

//Получить все переданному параметру в Url
router.get("/:id", auth, async (req, res) => {
  try {
    const link = await Link.findById(req.params.id);
    res.json(link);
  } catch (e) {
    res.status(500).json({ message: "Что-то пошло не так. Попробуйте снова" });
  }
});

module.exports = router;
