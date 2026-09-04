import { CommentStatus, PostStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { ICreatePostPayload, IUpdatePostPayload } from "./post.interface";

const createPost = async (payload: ICreatePostPayload, userId: string) => {
  const result = await prisma.post.create({
    data: {
      ...payload,
      authorId: userId,
    },
  });

  return result;
};

const getAllPosts = async () => {
  const posts = await prisma.post.findMany({
    include: {
      author: {
        omit: {
          password: true,
        },
      },
      comments: true,
    },
  });

  return posts;
};

const getPostByID = async (postId: string) => {
  // await prisma.post.update({
  //   where: {
  //     id: postId,
  //   },
  //   data: {
  //     views: {
  //       increment: 1,
  //     },
  //   },
  // });

  // throw new Error("Fake Error");

  const transactionResult = await prisma.$transaction(async (tx) => {
    await tx.post.update({
      where: {
        id: postId,
      },
      data: {
        views: {
          increment: 1,
        },
      },
    });

    // throw new Error("Fake error");
    const post = await tx.post.findUniqueOrThrow({
      where: {
        id: postId,
      },
      include: {
        author: {
          omit: {
            password: true,
          },
        },
        comments: {
          where: {
            status: CommentStatus.APPROVED,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        _count: {
          select: {
            comments: true,
          },
        },
      },
    });
    return post;
  });
  return transactionResult;
  // const post = await prisma.post.findUniqueOrThrow({
  //   where: {
  //     id: postId,
  //   },
  //   include: {
  //     author: {
  //       omit: {
  //         password: true,
  //       },
  //     },
  //     comments: {
  //       where: {
  //         status: CommentStatus.APPROVED,
  //       },
  //       orderBy: {
  //         createdAt: "desc",
  //       },
  //     },
  //     _count: {
  //       select: {
  //         comments: true,
  //       },
  //     },
  //   },
  // });
};

const updatePost = async (
  postId: string,
  payload: IUpdatePostPayload,
  authorId: string,
  isAdmin: boolean,
) => {
  const post = await prisma.post.findUniqueOrThrow({
    where: {
      id: postId,
    },
  });
  if (!isAdmin && post.authorId != authorId) {
    throw new Error("Yoy are not the owner of this post!");
  }
  const result = await prisma.post.update({
    where: {
      id: postId,
    },
    data: payload,
    include: {
      author: {
        omit: {
          password: true,
        },
      },
      comments: true,
    },
  });
  return result;
};

const deletePost = async (
  postId: string,
  authorId: string,
  isAdmin: boolean,
) => {
  const post = await prisma.post.findUniqueOrThrow({
    where: {
      id: postId,
    },
  });
  if (!isAdmin && post.authorId != authorId) {
    throw new Error("Yoy are not the owner of this post!");
  }
  const result = await prisma.post.delete({
    where: {
      id: postId,
    },
  });
  return result;
};

const getPostsState = async () => {
  const transactionResult = await prisma.$transaction(async (tx) => {
    // const totalPosts = await tx.post.count();
    // const totalPublishedPost = await tx.post.count({
    //   where: {
    //     status: PostStatus.PUBLISHED,
    //   },
    // });
    // const totalDraftPost = await tx.post.count({
    //   where: {
    //     status: PostStatus.DRAFT,
    //   },
    // });
    // const totalArchivedPost = await tx.post.count({
    //   where: {
    //     status: PostStatus.ARCHIVE,
    //   },
    // });
    // const totalComments = await tx.comment.count();
    // const totalApprovedComments = await tx.comment.count({
    //   where: {
    //     status: CommentStatus.APPROVED,
    //   },
    // });
    // const totalRejectedComments = await tx.comment.count({
    //   where: {
    //     status: CommentStatus.REJECTED,
    //   },
    // });
    // Not a good approach----
    // const allPost = await tx.post.findMany();
    // let totalPostViews = 0;
    // allPost.forEach((post) => {
    //   totalPostViews = totalPostViews + post.views;
    // });
    // Aggregation
    // const totalPostViewsAggregation = await tx.post.aggregate({
    //   _sum: {
    //     views: true,
    //   },
    // });
    // const totalPostViews = totalPostViewsAggregation._sum.views;
    // return {
    //   totalPosts,
    //   totalApprovedComments,
    //   totalArchivedPost,
    //   totalComments,
    //   totalDraftPost,
    //   totalPublishedPost,
    //   totalRejectedComments,
    //   totalPostViews,
    // };

    const [
      totalPosts,
      totalApprovedComments,
      totalArchivedPost,
      totalComments,
      totalDraftPost,
      totalPublishedPost,
      totalRejectedComments,
      totalPostViewsAggregate,
    ] = await Promise.all([
      await tx.post.count(),
      await tx.post.count({
        where: {
          status: PostStatus.PUBLISHED,
        },
      }),
      await tx.post.count({
        where: {
          status: PostStatus.DRAFT,
        },
      }),
      await tx.post.count({
        where: {
          status: PostStatus.ARCHIVE,
        },
      }),
      await tx.comment.count(),
      await tx.comment.count({
        where: {
          status: CommentStatus.APPROVED,
        },
      }),
      await tx.comment.count({
        where: {
          status: CommentStatus.REJECTED,
        },
      }),

      await tx.post.aggregate({
        _sum: {
          views: true,
        },
      }),
    ]);

    return {
      totalPosts,
      totalApprovedComments,
      totalArchivedPost,
      totalComments,
      totalDraftPost,
      totalPublishedPost,
      totalRejectedComments,
      totalPostViews: totalPostViewsAggregate._sum.views,
    };
  });
  return transactionResult;
};

const getMyPosts = async (authorId: string) => {
  const result = await prisma.post.findMany({
    where: {
      authorId,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      comments: true,
      author: {
        omit: {
          password: true,
        },
      },
      _count: {
        select: {
          comments: true,
        },
      },
    },
  });

  return result;
};

export const postService = {
  createPost,
  getAllPosts,
  getPostByID,
  updatePost,
  deletePost,
  getPostsState,
  getMyPosts,
};
