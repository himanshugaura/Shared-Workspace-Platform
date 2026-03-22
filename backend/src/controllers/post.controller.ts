import { Post } from "../models/post.model.js";
import { PostStatus } from "../types/constants.types.js";
import asyncHandler from "../utils/asyncHandler.js";
import { sendResponse } from "../utils/response.js";

export const createPost = asyncHandler(async (req , res ) => {
    const { title, description, maxUsers, eligibility, skillsRequired, keywords } = req.body;
    const owner = req.userId;

    const newPost = new Post({
        title,
        description,
        owner,
        maxUsers,
        eligibility,
        skillsRequired,
        keywords,
        status: PostStatus.UPCOMING,
    });

    await newPost.save();

    return sendResponse(res, 201, {
        message: "Post created successfully",
        data: newPost,
    }); 
})

export const getPosts = asyncHandler(async (req, res) => {
    const posts = await Post.find().populate("owner", "name email").populate("admins", "name email").populate("interestedUsers", "name email");

    return sendResponse(res, 200, {
        message: "Posts retrieved successfully",
        data: posts,
    });
});

export const getPostById = asyncHandler(async (req, res) => {
    const postId = req.params.id;

    const post = await Post.findById(postId).populate("owner", "name email").populate("admins", "name email").populate("interestedUsers", "name email");

    if (!post) {
        return sendResponse(res, 404, {
            message: "Post not found",
        });
    }

    return sendResponse(res, 200, {
        message: "Post retrieved successfully",
        data: post,
    });
});

export const updatePost = asyncHandler(async (req, res) => {
    const postId = req.params.id;
    const { title, description, maxUsers, eligibility, skillsRequired, keywords, status } = req.body;
    
    const post = await Post.findById(postId);

    if (!post) {
        return sendResponse(res, 404, {
            message: "Post not found",
        });
    }

    if (title !== undefined) post.title = title;
    if (description !== undefined) post.description = description;
    if (maxUsers !== undefined) post.maxUsers = maxUsers;
    if (eligibility !== undefined) post.eligibility = eligibility;
    if (skillsRequired !== undefined) post.skillsRequired = skillsRequired;
    if (keywords !== undefined) post.keywords = keywords;
    if (status !== undefined) post.status = status;

    await post.save();

    return sendResponse(res, 200, {
        message: "Post updated successfully",
        data: post,
    });
});

export const deletePost = asyncHandler(async (req, res) => {
    const postId = req.params.id;

    const post = await Post.findById(postId);

    if (!post) {
        return sendResponse(res, 404, {
            message: "Post not found",
        });
    }

    await post.deleteOne();
    return sendResponse(res, 200, {
        message: "Post deleted successfully",
    });
});       
    