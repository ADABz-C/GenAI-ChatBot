# AI Tech Concierge Chatbot

A full-stack AI-powered chatbot that helps Indiana University (IU) students discover and use free software tools available to them. The system uses **Retrieval-Augmented Generation (RAG)** with local documents and a **fully offline AI model (Ollama)** to deliver relevant, context-aware recommendations.

---

##  Project Overview

Many IU students are unaware of the wide range of software tools available to them (e.g., Adobe Creative Cloud, Microsoft 365, IUanyWare). This application solves that problem by acting as an intelligent assistant that recommends tools based on user needs.

Users can ask questions like:
- "How do I convert a file to PDF?"
- "What can I use for video editing?"

The system retrieves relevant IU documentation and combines it with an AI model to generate helpful responses.

---

## Key Features

-  Chat Interface – Clean, responsive UI with chat bubbles  
-  Streaming Responses – Answers appear in real time (like ChatGPT)  
-  Semantic Search (RAG) – Uses embeddings instead of keyword matching  
-  Document-Based Knowledge Base – Reads `.txt` files from local data folder  
-  Conversation Memory – Maintains short-term context  
-  Suggestion Buttons – Guides users with common queries  
-  Fully Local AI – Powered by Ollama (no API keys or costs)  

---

## Technical Architecture
Frontend (HTML/CSS/JS) -> Node.js Backend (Express) -> RAG System (Embeddings + Cosine Similarity) -> Ollama (Local LLM)

---

##  How RAG Works

1. User enters a query  
2. Query is converted into an embedding  
3. Compared with stored document embeddings  
4. Top matches are selected  
5. Context is injected into AI prompt  
6. AI generates response using retrieved knowledge  

---
##  Dependencies & Installation

###  Prerequisites

Make sure you have the following installed:

- Node.js (v16 or higher recommended)  
- npm (comes with Node.js)  
- Ollama (for running the local AI model)  

Download Ollama here:  
https://ollama.com

---

### Install Project Dependencies

Navigate to the project directory and install required packages:

```bash
npm install express cors dotenv node-fetch @xenova/transformers
