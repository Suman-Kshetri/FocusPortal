Client
  ↓ HTTP POST /api/question/create-questions
Server
  ↓ verify JWT
  ↓ upload images
  ↓ save to DB
  ↓ HTTP response (201)
  ↓ socket emit (notify others)
Clients (others)
  ↓ receive question:created
