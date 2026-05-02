require("dotenv").config();
const express = require("express");
const cors = require("cors");

// ✅ Safe fetch (works on all Node versions)
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

const { initRAG, getRelevantContext } = require("./rag");

const app = express();
app.use(cors());
app.use(express.json());

// 🧠 Simple memory
let chatHistory = [];

app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    if (!userMessage) {
      return res.status(400).json({ error: "No message provided" });
    }

    console.log("User:", userMessage);

    // 🔍 RAG
    const contexts = await getRelevantContext(userMessage);
    const combinedContext = contexts.map(c => c.text).join("\n");

    console.log("Contexts:", contexts);

    // 🧠 Memory
    chatHistory.push(`User: ${userMessage}`);
    if (chatHistory.length > 10) {
      chatHistory = chatHistory.slice(-10);
    }

    const prompt = `
You are an IU Tech Concierge.
You help students succeed by recommending free IU software.

Rules:
- Be friendly and clear
- Recommend tools when helpful
- Mention value when relevant
- Keep responses concise

Conversation:
${chatHistory.join("\n")}

Context:
${combinedContext}

Answer the user:
`;

    // 🔄 STREAM from Ollama
    const aiRes = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama3",
        prompt,
        stream: true
      })
    });

    res.setHeader("Content-Type", "text/plain");

    let fullResponse = "";

    for await (const chunk of aiRes.body) {
      const lines = chunk.toString().split("\n").filter(Boolean);

      for (const line of lines) {
        const parsed = JSON.parse(line);

        if (parsed.response) {
          fullResponse += parsed.response;
          res.write(parsed.response);
        }
      }
    }

    // 🧠 Save bot reply
    chatHistory.push(`Bot: ${fullResponse}`);

    res.end();

  } catch (error) {
    console.error("FULL ERROR:", error);
    res.status(500).end("Server error");
  }
});

// 🚀 Start AFTER RAG loads
async function startServer() {
  console.log("Initializing RAG...");
  await initRAG();
  console.log("RAG ready");

  app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
  });
}

startServer();