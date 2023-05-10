import mongoose from "mongoose";
import TagModel from "../models/Tag.js";

export const getAll = async (req, res) => {
  try {
    const tags = await TagModel.find().exec();

    res.json(tags);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Couldn't get tags",
    });
  }
};

export const getOne = async (req, res) => {
  try {
    const tagId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(tagId)) {
      console.log("Not an ObjectId");

      return res.status(404).json({
        message: "Tag not found",
      });
    }

    await Tag.findOne({
      _id: tagId,
    })
      .then((document) => {
        if (!document) {
          return res.status(404).json({
            message: "Tag not found",
          });
        }

        res.json(document);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          message: "Couldn't return tag",
        });
      });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Couldn't return tag",
    });
  }
};

export const create = async (req, res) => {
  try {
    const doc = new TagModel({
      tagname: req.body.tagname,
    });

    const tag = await doc.save();

    res.json(tag);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Couldn't create tag",
    });
  }
};
