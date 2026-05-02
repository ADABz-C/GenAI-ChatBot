const fs = require("fs");
const path = require("path");
const { pipeline } = require("@xenova/transformers");

let embedder;
let documents = [];
let docEmbeddings = [];

// 📂 Load text files
function loadDocuments() {
  const folderPath = path.join(__dirname, "data");
  const files = fs.readdirSync(folderPath);

  const docs = [];

  for (let file of files) {
    const content = fs.readFileSync(
      path.join(folderPath, file),
      "utf-8"
    );

    const chunks = content.split(/\n|\.\s/);

    for (let chunk of chunks) {
      if (chunk.trim().length > 20) {
        docs.push({
          text: chunk.trim(),
          source: file
        });
      }
    }
  }

  return docs;
}

// 🔁 Initialize RAG
async function initRAG() {
  embedder = await pipeline(
    "feature-extraction",
    "Xenova/all-MiniLM-L6-v2"
  );

  documents = loadDocuments();

  for (let doc of documents) {
    const embedding = await embedder(doc.text, {
      pooling: "mean",
      normalize: true
    });

    docEmbeddings.push(embedding.data);
  }

  console.log("RAG initialized");
}

// 📐 Cosine similarity
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

// 🔍 Get TOP 3 matches
async function getRelevantContext(query) {
  const queryEmbedding = await embedder(query, {
    pooling: "mean",
    normalize: true
  });

  const scores = [];

  for (let i = 0; i < docEmbeddings.length; i++) {
    const score = cosineSimilarity(
      queryEmbedding.data,
      docEmbeddings[i]
    );

    scores.push({
      score,
      text: documents[i].text,
      source: documents[i].source
    });
  }

  scores.sort((a, b) => b.score - a.score);

  return scores.slice(0, 3);
}

module.exports = { initRAG, getRelevantContext };