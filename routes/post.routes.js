const { Router } = require("express");
const config = require("config");
const fs = require("fs");

const Post = require("../models/Post");
const auth = require("../middleware/auth.middleware");
const handle = require("../utils/promiseHandler");
const upload = require("../utils/multer");

const router = Router();

//Запрос на создание нового поста. Содержит текстовые поля, название файла и ID автора
router.post("/create", auth, async (req, res) => {
  try {
    upload(req, res, async error => {
      if (error) {
        console.log(error);
        res.status(500).json({
          err: "Файл не был загружен в связи с ошибкой: " + error
        });
      } else {
        let _post = {
          title: req.body.title,
          content: req.body.content,
          cover: `${config.get("baseUrl")}/uploads/${req.file.filename}`,
          covername: req.file.filename,
          owner: req.user.userId
        };
        const newPost = new Post(_post);
        let [post, postError] = await handle(newPost.save());

        if (postError) {
          res.status(500).json({
            data: postError
          });
        } else {
          res.status(201).json({ data: post }); //201 (успешно создано)
        }
      }
    });
  } catch (e) {
    res.status(500).json({ message: "Что-то пошло не так. Попробуйте снова" });
  }
});

//Запрос на вывод всех постов
router.get("/", auth, async (req, res) => {
  let [posts, postsError] = await handle(Post.find());
  if (postsError) {
    res.status(500).json({
      data: postsError
    });
  } else {
    res.status(200).json({
      data: posts
    });
  }
});

//Запрос на все свои посты
router.get("/myPosts", auth, async (req, res) => {
  let [posts, postsError] = await handle(Post.find({ owner: req.user.userId }));

  if (postsError) {
    res.status(500).json({
      data: postsError
    });
  } else {
    res.status(200).json({
      data: posts
    });
  }
});

//Запрос на вывод постов по ID, переданным get-параметром через url
router.get("/:id", auth, async (req, res) => {
  let [post, postError] = await handle(Post.findById(req.params.id));
  if (postError) {
    res.status(500).json({
      data: postError
    });
  } else {
    res.status(200).json({
      data: post
    });
  }
});

//Get-запрос на постраничный вывод постов, который принимает uri-параметр (страницу)
//Возьми все посты. Отбрось всё, что будет до результата в с slip(первый лимит*страницу-первый лимит)
//limit - максимум выдачи постов = perPage
//В ответе: 1) посты, 2) текущую страницу, 3) видимые страницы (prev,5,6,7,next)
//Запрос с uri-параметром держать в самом низу. Если поставить выше, могут быть конфликты с другими гетами

router.get("/:page", auth, async (req, res) => {
  let perPage = 2;
  let page = req.params.page || 1;

  Post.find({})
    .skip(perPage * page - perPage)
    .limit(perPage)
    .exec((err, posts) => {
      Post.count("", (err, count) => {
        if (err) {
          console.log(err);
        } else {
          res.status(200).json({
            data: posts,
            current: page,
            pages: Math.ceil(count / perPage) //количество постов подели на максимум постов на странице
          });
        }
      });
    });
});

router.put("/update/:id", auth, async (req, res) => {
  //Если ошибки нет, но файл undefined, найди его и поменяй лишь значения (путь и имя файла будет null)
  //Если всё нормально, найди пост по id и сделай ему update
  try {
    upload(req, res, async error => {
      if (error) {
        res.status(500).json({
          data: error
        });
      } else {
        //Update если файла нет
        if (req.file === undefined) {
          let [update, updateError] = await handle(
            Post.findByIdAndUpdate(req.params.id, {
              $set: {
                title: req.body.title,
                content: req.body.content,
                cover: req.body.oldcover,
                covername: req.body.oldcovername
              }
            })
          );
          if (updateError) {
            res.status(500).json({
              data: updateError
            });
          } else {
            res.status(200).json({ data: update });
          }
        } else {
          //Update если файл есть
          let postcover = req.body.oldcovername;
          let [update, updateError] = await handle(
            Post.findByIdAndUpdate(req.params.id, {
              $set: {
                title: req.body.title,
                content: req.body.content,
                cover: `${config.get("baseUrl")}/uploads/${req.file.filename}`,
                covername: req.file.filename
              }
            })
          );
          if (updateError) {
            res.status(500).json({
              data: updateError
            });
          } else {
            let filePath = "./uploads/" + postcover;
            fs.unlinkSync(filePath);
            res.status(200).json({ data: update });
          }
        }
      }
    });
  } catch (e) {
    res.status(500).json({ message: "Что-то пошло не так. Попробуйте снова" });
  }
});

//Запрос на удаление поста по его ID
router.delete("/delete/:id", auth, async (req, res) => {
  let postCover = "";
  let [post, postError] = await handle(Post.findById(req.params.id));
  if (postError) {
    res.status(500).json({
      data: postError
    });
  } else {
    postCover = post.covername; //запиши название файла в postCover
  }
  //Удаление поста. Найди и удали в базе данных, затем удали в папке сервера
  let [deletePost, deleteError] = await handle(
    Post.findByIdAndDelete(req.params.id)
  );
  if (deleteError) {
    res.status(500).json({
      data: deleteError
    });
  } else {
    let filepath = "./uploads/" + postCover; //Склей путь и название файла. Удали файл по его пути
    fs.unlinkSync(filepath);
    res.status(200).json({
      data: deletePost
    });
  }
});

//Запрос на получение данных о себе (текущий залогиненный юзер)
router.get("/getme", auth, async (req, res) => {
  console.log(123);
  let [user, userError] = await handle(User.findOne({ _id: req.user.userId }));

  if (userError) {
    res.status(500).json({
      data: userError
    });
  } else {
    res.status(200).json({
      data: user
    });
  }
});

module.exports = router;
