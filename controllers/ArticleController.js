import mongoose from "mongoose";
import ArticleModel from "../models/Aritcle.js";

export const getAll = async (req, res) => {
  try {
    const articles = await ArticleModel.find()
      .populate({ path: "user", select: ["fullName"] })
      .populate("tag")
      .exec();

    res.json(articles);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Couldn't get articles",
    });
  }
};

export const getOne = async (req, res) => {
  try {
    const articleId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(articleId)) {
      console.log("Not an ObjectId");

      return res.status(404).json({
        message: "Article not found",
      });
    }

    await ArticleModel.findOneAndUpdate(
      {
        _id: articleId,
      },
      {
        $inc: { viewsCount: 1 },
      },
      {
        returnDocument: "after",
      }
    )
      .populate({ path: "user", select: ["fullName"] })
      .populate("tag")
      .then((document) => {
        if (!document) {
          return res.status(404).json({
            message: "Article not found",
          });
        }

        res.json(document);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          message: "Couldn't return article",
        });
      });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Couldn't return article",
    });
  }
};

export const remove = async (req, res) => {
  try {
    const articleId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(articleId)) {
      console.log("Not an ObjectId");

      return res.status(404).json({
        message: "Article not found",
      });
    }

    await ArticleModel.findOneAndDelete({
      _id: articleId,
    })
      .then((document) => {
        if (!document) {
          return res.status(404).json({
            message: "Article not found",
          });
        }

        res.json({
          success: true,
        });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          message: "Couldn't remove article",
        });
      });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Couldn't remove article",
    });
  }
};

export const create = async (req, res) => {
  try {
    const doc = new ArticleModel({
      title: req.body.title,
      text: req.body.text,
      imageUrl: req.body.imageUrl,
      tag: req.body.tag,
      user: req.userId,
    });

    const article = await doc.save();

    res.json(article);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Couldn't create article",
    });
  }
};

export const update = async (req, res) => {
  try {
    const articleId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(articleId)) {
      console.log("Not an ObjectId");

      return res.status(404).json({
        message: "Article not found",
      });
    }

    await ArticleModel.updateOne(
      {
        _id: articleId,
      },
      {
        title: req.body.title,
        text: req.body.text,
        imageUrl: req.body.imageUrl,
        tags: req.body.tags ? req.body.tags.split(",") : [],
        tag: req.body.tag,
        user: req.userId,
      }
    );

    res.json({
      success: true,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Couldn't edit article",
    });
  }
};
