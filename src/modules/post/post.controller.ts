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
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await postService.getPostsState();

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Post Stats Retrive Successfully",
      data: result,
    });
  },
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
  async (req: Request, res: Response, next: NextFunction) => {
    const authorId = req.user?.id;
    const isAdmin = req.user?.role === "ADMIN";
    const postId = req.params.postId;

    if (!postId) {
      throw new Error("Post Id Required in Params");
    }

    await postService.deletePost(postId as string, authorId as string, isAdmin);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Post Deleted Successfully",
      data: null,
    });
  },
);
const deletePost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const authorId = req.user?.id;
    const isAdmin = req.user?.role === "ADMIN";
    const postId = req.params.postId;
    const payload = req.body;

    if (!postId) {
      throw new Error("Post Id Required in Params");
    }

    const result = await postService.updatePost(
      postId as string,
      payload,
      authorId as string,
      isAdmin,
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Post Updated Successfully",
      data: result,
    });
  },
);

const getMyPosts = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const authorId = req.user?.id;

    const result = await postService.getMyPosts(authorId as string);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "My Posts Retrive Successfully",
      data: result,
    });
  },
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
