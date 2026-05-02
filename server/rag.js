// rag.js

const { pipeline } = require("@xenova/transformers");

let embedder;

// Expanded knowledge base
const documents = [
  {
    text: "Students have free access to Adobe Express and InDesign for creating posters and designs."
  },
  {
    text: "Microsoft Word is free for IU students and can export documents as PDF easily."
  },
  {
    text: "PowerPoint is available for creating presentations and can also export slides as PDF."
  },
  {
    text: "Adobe Acrobat can be used to convert files into PDF format."
  }
];

let docEmbeddings = [];

// Initialize embeddings
async function initRAG() {
  embedder = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");

  for (let doc of documents) {
    const embedding = await embedder(doc.text, {
      pooling: "mean",
      normalize: true
    });
    docEmbeddings.push(embedding.data);
  }

  console.log("RAG initialized");
}

// Cosine similarity
function cosineSimilarity(a, b) {
  let dot = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

// Return TOP 3 matches
async function getRelevantContext(query) {
  const queryEmbedding = await embedder(query, {
    pooling: "mean",
    normalize: true
  });

  const scores = [];

  for (let i = 0; i < docEmbeddings.length; i++) {
    const score = cosineSimilarity(queryEmbedding.data, docEmbeddings[i]);

    scores.push({
      score,
      text: documents[i].text
    });
  }

  // Sort by best match
  scores.sort((a, b) => b.score - a.score);

  // Return top 3
  return scores.slice(0, 3).map(item => item.text);
}

module.exports = { initRAG, getRelevantContext };