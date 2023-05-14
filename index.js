import express from "express";
import multer from "multer";
import mongoose from "mongoose";

import cors from "cors";

import {
  CommentCreateValidation,
  articleCreateValidation,
  loginValidation,
  registerValidation,
} from "./validations.js";

import { handleValidationErrors, checkAuth } from "./utils/index.js";
import {
  UserController,
  ArticleController,
  CommentController,
  TagController,
} from "./controllers/index.js";
import bodyParser from "body-parser";

mongoose
  .connect(
    // "mongodb+srv://admin:qwe123@newsapp.dficgzh.mongodb.net/newsapp?retryWrites=true&w=majority"
    process.env.MONGODB_URI
  )
  .then(() => {
    console.log("DB connected");
  })
  .catch((err) => console.log("DB error", err));

const app = express();

const storage = multer.diskStorage({
  destination: (_, __, callback) => {
    callback(null, "uploads");
  },
  filename: (_, file, callback) => {
    callback(null, file.originalname);
  },
});

const upload = multer({ storage });

app.use(cors());
app.use("/uploads", express.static("uploads"));

app.post(
  "/auth/login",
  bodyParser.json(),
  loginValidation,
  UserController.login
);

app.post(
  "/auth/register",
  bodyParser.json(),
  registerValidation,
  UserController.register
);
app.get("/auth/me", checkAuth, UserController.getMe);

app.post("/upload", checkAuth, upload.single("image"), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});

app.get("/articles", ArticleController.getAll);
app.get("/articles/:id", ArticleController.getOne);
app.post(
  "/articles",
  bodyParser.json(),
  checkAuth,
  articleCreateValidation,
  ArticleController.create
);

app.delete("/articles/:id", checkAuth, ArticleController.remove);
app.patch(
  "/articles/:id",
  bodyParser.json(),
  checkAuth,
  articleCreateValidation,
  ArticleController.update
);

app.get("/comments", CommentController.getAll);
app.get("/comments/article/:articleId", CommentController.getAllForArticle);
app.post(
  "/comments",
  bodyParser.json(),
  checkAuth,
  CommentCreateValidation,
  CommentController.create
);
app.delete("/comments/:id", checkAuth, CommentController.remove);
app.patch(
  "/comments/:id",
  bodyParser.json(),
  checkAuth,
  CommentCreateValidation,
  CommentController.update
);

app.get("/tags", TagController.getAll);
app.get("/tags/:id", TagController.getOne);
app.post("/tags", bodyParser.json(), TagController.create);

app.listen(4444, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log("Server OK");
});
