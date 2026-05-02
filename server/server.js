// server.js

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const fetch = (...args) =>
  import('node-fetch').then(({ default: fetch }) => fetch(...args));

const { initRAG, getRelevantContext } = require("./rag");

const app = express();

app.use(cors());
app.use(express.json());

// Chat route
app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    const contexts = await getRelevantContext(userMessage);
    const combinedContext = contexts.join("\n");

    const aiRes = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama3",
        prompt: `
You are an IU Tech Concierge.

Context:
${combinedContext}

User:
${userMessage}
`,
        stream: true
      })
    });

    res.setHeader("Content-Type", "text/plain");

    for await (const chunk of aiRes.body) {
      const lines = chunk.toString().split("\n").filter(Boolean);

      for (const line of lines) {
        const parsed = JSON.parse(line);

        if (parsed.response) {
          res.write(parsed.response); // 🔥 STREAM to frontend
        }
      }
    }

    res.end();

  } catch (error) {
    console.error(error);
    res.status(500).end("Error");
  }
});

// Start server AFTER RAG loads
async function startServer() {
  console.log("Initializing RAG...");
  await initRAG();
  console.log("RAG ready");

  app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
  });
}

startServer();