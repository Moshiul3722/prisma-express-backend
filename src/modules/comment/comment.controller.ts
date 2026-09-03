import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";

const createComment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
);

const getCommentByAuthorId = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
);

const getCommentByCommentId = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
);

const updateComment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
);

const deleteComment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
);

const moderateComment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
);

export const commentController = {
  createComment,
  getCommentByAuthorId,
  getCommentByCommentId,
  updateComment,
  deleteComment,
  moderateComment,
};
