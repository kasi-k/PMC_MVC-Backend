const AIService = require("../Service/ai_service");


exports.generatePrompt = async (req, res, next) => {
  try {
   // const { prompt } = req.body;

   const receivedData = req.body;
    const { prompt, format } = receivedData;

    const generatedText = await AIService.generateContent(prompt);

    res.status(200).json({ generatedText });
  } catch (error) {
    next(error);
  }
};

exports.generateTheory = async (req, res, next) => {
  try {
    //const { prompt } = req.body;

    const receivedData = req.body;
    const { prompt, format } = receivedData;

    const generatedText = await AIService.generateContent(prompt);

    const htmlContent = AIService.convertMarkdownToHtml(generatedText);

    res.status(200).json({ text: htmlContent });
  } catch (error) {
    next(error);
  }
};

exports.fetchImage = async (req, res, next) => {
  try {
   // const { prompt } = req.body;

   const receivedData = req.body;
    const { prompt, format } = receivedData;

    const imageUrl = await AIService.fetchImage(prompt);

    if (!imageUrl) {
      return res.status(404).json({ success: false, message: "No image found" });
    }

    res.status(200).json({ url: imageUrl });
  } catch (error) {
    next(error);
  }
};

exports.fetchYouTubeVideo = async (req, res, next) => {
  try {
    //const { prompt } = req.body;

    const receivedData = req.body;
    const { prompt, format } = receivedData;

    const videoId = await AIService.fetchYouTubeVideo(prompt);

    if (!videoId) {
      return res.status(404).json({ success: false, message: "No video found" });
    }

    res.status(200).json({ url: videoId });
  } catch (error) {
    next(error);
  }
};

exports.fetchTranscript = async (req, res, next) => {
  try {
    //const { prompt } = req.body;

    const receivedData = req.body;
    const { prompt, format } = receivedData;

    const transcript = await AIService.fetchTranscript(prompt);

    res.status(200).json({ transcript });
  } catch (error) {
    next(error);
  }
};

exports.generateChatResponse = async (req, res, next) => {
    try {
      const { prompt } = req.body;

      const htmlContent = await AIService.generateChatResponse(prompt);
  
      res.status(200).json({ text: htmlContent });
    } catch (error) {
      next(error);
    }
  };