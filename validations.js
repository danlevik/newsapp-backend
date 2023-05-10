import { body } from "express-validator";

export const loginValidation = [
  body("email", "Incorrect email address").isEmail(),
  body("password", "Password should be at least 5 symbols").isLength({
    min: 5,
  }),
  body("fullName", "FullName should be at least 3 symbols").isLength({
    min: 3,
  }),
];
export const registerValidation = [
  body("email", "Incorrect email address").isEmail(),
  body("password", "Password should be at least 5 symbols").isLength({
    min: 5,
  }),
  body("fullName", "FullName should be at least 3 symbols").isLength({
    min: 3,
  }),
];

export const articleCreateValidation = [
  body("title", "Please enter title").isLength({ min: 3 }).isString(),
  body("text", "Text should be at least 10 symbols")
    .isLength({
      min: 10,
    })
    .isString(),
  body("tags", "Wrong tag format (input array)").optional().isString(),
  body("imageUrl", "Wrong url to image").optional().isString(),
];

export const CommentCreateValidation = [
  body("text", "Text should be at least 10 symbols")
    .isLength({ min: 10 })
    .isString(),
];
