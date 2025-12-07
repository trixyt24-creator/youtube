import { GoogleGenAI } from "@google/genai";
import Channel from "../models/channel.model.js";
import VideoModel from "../models/video.model.js";
import ShortModel from "../models/short.model.js";
import PlaylistModel from "../models/playlist.model.js";
import dotenv from "dotenv";

dotenv.config();

export const searchWithAI = async (req, res) => {
  try {
    const { input } = req.body;
    if (!input) {
      return res.status(400).json({ message: "Input is required" });
    }

    // step 1: AI se keyword nikaalo (autocorrect + simplified)
    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    const prompt = `You are a search assistant for a video streaming platform. The user query is: ${input}. 
        Your job is:
        - if query has typos, correct them.
        - if query has multiple words, break them into meaningful keywords.
        - return only the corrected word(s), comma-separated.
        - do not explain anything, just return the keywords.
        `;
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    let keyword = (response.text || input).trim().replace(/[\n\r]+/g, " ");

    // step 2: split keywords for OR search
    const searchWords = keyword
      .split(",")
      .map((word) => word.trim())
      .filter(Boolean);

    // helper: create OR regex query
    const buildRegexQuery = (fields) => {
      return {
        $or: searchWords.map((word) => ({
          $or: fields.map((field) => ({
            [field]: {
              $regex: word,
              $options: "i",
            },
          })),
        })),
      };
    };

    // channels
    const matchedChannels = await Channel.find(
      buildRegexQuery(["name"])
    ).select("_id name avatar");

    const channelIds = matchedChannels.map((channel) => channel._id);

    // videos
    const videos = await VideoModel.find({
      $or: [
        buildRegexQuery(["title", "description", "tags"]),
        { channel: { $in: channelIds } },
      ],
    }).populate("channel comments.author comments.replies.author");

    // shorts
    const shorts = await ShortModel.find({
      $or: [
        buildRegexQuery(["title", "description", "tags"]),
        { channel: { $in: channelIds } },
      ],
    })
      .populate("channel", "name avatar")
      .populate("likes", "username photoUrl");

    // playlists
    const playlists = await PlaylistModel.find({
      $or: [
        buildRegexQuery(["title", "description"]),
        { channel: { $in: channelIds } },
      ],
    })
      .populate("channel", "name avatar")
      .populate({
        path: "videos",
        populate: {
          path: "channel",
          select: "name avatar",
        },
      });

    return res.status(200).json({
      keyword,
      channels: matchedChannels,
      videos,
      shorts,
      playlists,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const filterCategoryWithAI = async (req, res) => {
  try {
    const { input } = req.body;
    if (!input) {
      return res.status(400).json({ message: "Input is required" });
    }

    // initialize gemini
    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    const categories = [
      "All",
      "Music",
      "Gaming",
      "News",
      "Entertainment",
      "Sports",
      "Movies",
      "Live",
      "DSA",
      "Science & Tech",
      "TV Shows",
      "Art",
      "Comedy",
      "Vlogs",
      "Education",
      "Gadgets",
      "Health",
      "Horror",
      "Cooking",
      "Dance",
      "Fashion",
      "Travel",
      "Beauty",
      "DIY & Crafts",
      "Animals & Pets",
      "Automotive",
      "Animation",
      "Documentary",
      "History",
      "Finance & Business",
      "Fitness",
      "How-to & Style",
      "People & Blogs",
      "Trailers",
      "ASMR",
      "Podcasts",
      "Reviews",
      "Tutorials",
      "Unboxing",
      "Challenges",
      "Pranks",
      "Family",
      "Nature & Outdoors",
      "Photography",
      "Filmmaking",
      "Real Estate",
      "Spirituality",
      "Motivation",
      "Coding & Programming",
      "Web Development",
      "Mobile Development",
    ];

    const prompt = `You are a category classifier for a video streaming platform.
    The user query is ${input}
    Your job:
    - Match this query with the most relevant categories from this list: ${categories.join(
      ","
    )}
    - If more than one category fits, return them comma-seperated.
    - If nothing fits, return the single closest category.
    - Do NOT explain anything. Do NOT return JSON. Only return category names.

    Examples:
    - "arijit singh songs" -> "Music"
    - "pubg gameplay" -> "Gaming"
    - "netflix web series" -> "TV Shows"
    - "india latest news" -> "News"
    - "funny animal videos" -> "Comedy, Pets"
    - "fitness tips" -> "Education, Sports"
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    // split category safely
    const keywordText = response.text.trim();
    const keywords = keywordText.split(",").map((keyword) => keyword.trim());

    // build conditions for each keyword
    const videoConditions = [];
    const shortConditions = [];
    const channelConditions = [];

    keywords.forEach((keyword) => {
      videoConditions.push(
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
        { tags: { $regex: keyword, $options: "i" } }
      );
      shortConditions.push(
        { title: { $regex: keyword, $options: "i" } },
        { tags: { $regex: keyword, $options: "i" } }
      );
      channelConditions.push(
        { name: { $regex: keyword, $options: "i" } },
        { category: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } }
      );
    });

    const videos = await VideoModel.find({ $or: videoConditions }).populate(
      "channel comments.author comments.replies.author"
    );
    const shorts = await ShortModel.find({ $or: shortConditions })
      .populate("channel", "name avatar")
      .populate("likes", "username photoUrl");
    const channels = await Channel.find({ $or: channelConditions })
      .populate("owner", "username photoUrl")
      .populate("subscribers", "username photoUrl")
      .populate({
        path: "videos",
        populate: {
          path: "channel",
          select: "name avatar",
        },
      })
      .populate({
        path: "shorts",
        populate: {
          path: "channel",
          select: "name avatar",
        },
      });

    return res.status(200).json({
      videos,
      shorts,
      channels,
      keywords,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
