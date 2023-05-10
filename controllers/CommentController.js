import mongoose from "mongoose";
import CommentModel from "../models/Comment.js";

export const getAll = async (req, res) => {
  try {
    const comments = await CommentModel.find()
      .populate({ path: "user", select: ["fullName"] })
      .exec();

    res.json(comments);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Couldn't get comments",
    });
  }
};

export const getAllForArticle = async (req, res) => {
  try {
    const articleId = req.params.articleId;

    if (!mongoose.Types.ObjectId.isValid(articleId)) {
      console.log("Not an ObjectId");

      return res.status(404).json({
        message: "Article not found",
      });
    }

    await CommentModel.find({
      article: articleId,
    })
      .populate({ path: "user", select: ["fullName"] })
      .then((document) => {
        if (!document) {
          return res.status(404).json({
            message: "Comments not found",
          });
        }

        res.json(document);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          message: "Couldn't return comments",
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
    const commentId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(commentId)) {
      console.log("Not an ObjectId");

      return res.status(404).json({
        message: "Comment not found",
      });
    }

    await CommentModel.findOneAndDelete({
      _id: commentId,
    })
      .then((document) => {
        if (!document) {
          return res.status(404).json({
            message: "Comment not found",
          });
        }

        res.json({
          success: true,
        });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          message: "Couldn't remove comment",
        });
      });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Couldn't remove comment",
    });
  }
};

export const create = async (req, res) => {
  try {
    const doc = new CommentModel({
      text: req.body.text,
      article: req.body.articleId,
      user: req.userId,
    });

    const comment = await doc.save();

    res.json(comment);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Couldn't create comment",
    });
  }
};

export const update = async (req, res) => {
  try {
    const commentId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(commentId)) {
      console.log("Not an ObjectId");

      return res.status(404).json({
        message: "Comment not found",
      });
    }

    await CommentModel.updateOne(
      {
        _id: commentId,
      },
      {
        text: req.body.text,
        article: req.body.articleId,
        user: req.userId,
      }
    );

    res.json({
      success: true,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Couldn't edit comment",
    });
  }
};
