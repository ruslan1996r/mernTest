const { Router } = require("express");
const Link = require("../models/Link");
const router = Router();

//Без middleware auth, чтобы по ссылке мог пройти неавторизированный юзер
//по code из параметра делается поиск в базе. Найденный результат выведи
router.get("/:code", async (req, res) => {
  try {
    const link = await Link.findOne({ code: req.params.code });
    if (link) {
      link.click++;
      await link.save();
      return res.redirect(link.from);
    } else {
    }
    res.status(404).json("Ссылка не найдена");
  } catch (e) {
    res.status(500).json({ message: "Что-то пошло не так. Попробуйте снова" });
  }
});

module.exports = router;
