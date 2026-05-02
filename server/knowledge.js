// knowledge.js

const knowledgeBase = [
  {
    keywords: ["poster", "design", "flyer"],
    content: "Students have free access to Adobe Express and InDesign through IU. These tools are great for creating posters and designs."
  },
  {
    keywords: ["document", "word", "essay"],
    content: "Microsoft Word is available for free to IU students through Microsoft 365."
  },
  {
    keywords: ["presentation", "slides"],
    content: "You can use Microsoft PowerPoint for free through IU to create presentations."
  }
];

// Simple retrieval function
function getRelevantContext(userMessage) {
  const lowerMsg = userMessage.toLowerCase();

  for (let item of knowledgeBase) {
    for (let keyword of item.keywords) {
      if (lowerMsg.includes(keyword)) {
        return item.content;
      }
    }
  }

  return "No specific IU tool found. Provide general helpful guidance.";
}

module.exports = { getRelevantContext };