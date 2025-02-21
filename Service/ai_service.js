const gis = require("g-i-s");
const youtubesearchapi = require("youtube-search-api");
const { YoutubeTranscript } = require("youtube-transcript");
const {
  GoogleGenerativeAI,
  HarmBlockThreshold,
  HarmCategory,
} = require("@google/generative-ai");
const showdown = require("showdown");

const genAI = new GoogleGenerativeAI(process.env.API_KEY);

exports.generateContent = async (promptString) => {
  const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
  ];

  const model = genAI.getGenerativeModel({
    model: "gemini-pro",
    safetySettings,
  });

  const result = await model.generateContent(promptString);
  const response = result.response;
  return response.text();
};

exports.convertMarkdownToHtml = (markdownText) => {
  const converter = new showdown.Converter();
  return converter.makeHtml(markdownText);
};

exports.fetchImage = async (promptString) => {
  return new Promise((resolve, reject) => {
    gis(promptString, (error, results) => {
      if (error) {
        reject(new Error("Failed to fetch image"));
      } else {
        resolve(results[0]?.url || null);
      }
    });
  });
};

exports.fetchYouTubeVideo = async (promptString) => {
  try {
    const video = await youtubesearchapi.GetListByKeyword(
      promptString,
      [false],
      [1],
      [{ type: "video" }]
    );
    return video.items[0]?.id || null;
  } catch (error) {
    throw new Error("Failed to fetch YouTube video");
  }
};

exports.fetchTranscript = async (videoId) => {
  try {
    const transcript = await YoutubeTranscript.fetchTranscript(videoId);
    return transcript;
  } catch (error) {
    throw new Error("Failed to fetch transcript");
  }
};

  exports.generateChatResponse = async (promptString) => {
    const safetySettings = [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
    ];
  
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      safetySettings,
    });
  
    try {
      const result = await model.generateContent(promptString);
      const response = result.response;
      const generatedText = response.text();
  
      const converter = new showdown.Converter();
      const htmlContent = converter.makeHtml(generatedText);
  
      return htmlContent;
    } catch (error) {
      throw new Error("Failed to generate chat response");
    }
  };