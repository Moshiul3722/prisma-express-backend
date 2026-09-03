import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { postService } from "./post.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";

const createPost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.user?.id;
    const payload = req.body;

    const result = await postService.createPost(payload, id as string);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Post Created Successfully",
      data: result,
    });
  },
);
const getAllPosts = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await postService.getAllPosts();

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Post Retrive Successfully",
      data: result,
    });
  },
);
const getPostStats = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
);
const getMyPosts = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
);
const getPostByID = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const postId = req.params.postId;

    if (!postId) {
      throw new Error("Post Id Required in Params");
    }

    const result = await postService.getPostByID(postId as string);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Post Retrive Successfully",
      data: result,
    });
  },
);
const updatePost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
);
const deletePost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
);

export const postController = {
  createPost,
  getAllPosts,
  getPostStats,
  getMyPosts,
  getPostByID,
  updatePost,
  deletePost,
};
