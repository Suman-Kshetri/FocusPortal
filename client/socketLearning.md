# Real-Time Question System – Architecture & Flow

## 1. High-Level Architecture (Big Picture)

```
Client (React)
   |
   |  REST API (HTTP)
   v
Backend (Express + MongoDB)
   |
   |  Socket.IO (WebSocket)
   v
All Connected Clients (Real-time updates)
```

### Communication Methods Used

| Purpose             | Technology                     |
| ------------------- | ------------------------------ |
| Create / Fetch data | REST API (Axios + React Query) |
| Real-time updates   | Socket.IO                      |

---

## 2. Backend Flow (Step by Step)

### 2.1 Express App + Socket.IO Setup (Conceptual)

```ts
const io = new Server(httpServer, { cors: {...} });
app.set("io", io); // 🔑 VERY IMPORTANT
```

**Why this matters:**
This makes the Socket.IO instance accessible inside Express controllers using:

```ts
req.app.get('io')
```

---

### 2.2 Socket Routes Registration

**File:** `registerSocketRoutes.ts`

```ts
export const registerSocketRoutes = (io: Server) => {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    registerQuestionSocket(io, socket);

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
};
```

#### What happens here?

1. A client connects via Socket.IO
2. `io.on("connection")` fires
3. Each client gets a unique `socket.id`
4. Feature-specific socket logic is registered

---

### 2.3 Joining a Room

**File:** `question.socket.ts`

```ts
export const registerQuestionSocket = (io: Server, socket: Socket) => {
  socket.join("questions-feed");
  console.log(`${socket.id} auto-joined questions-feed`);
};
```

#### Important Concepts

| Term             | Meaning                  |
| ---------------- | ------------------------ |
| socket           | One connected user       |
| room             | Logical group of sockets |
| `questions-feed` | Room name                |

📌 Every connected user automatically joins the **questions-feed** room.
This allows broadcasting only to users who care about questions.

---

## 3. Backend REST API Flow

### 3.1 Route Definition

**File:** `question.route.ts`

```ts
questionRoute.post(
   "/create-questions",
   verifyJwt,
   upload.array("images", 2),
   createQuestions
);
```

#### Middleware Order (Very Important)

1. **verifyJwt**
   Ensures user is authenticated and attaches `req.user`

2. **upload.array("images", 2)**
   Parses `multipart/form-data` and attaches files to `req.files`

3. **createQuestions**
   Contains business logic

---

### 3.2 Create Question Controller

**File:** `question.controller.ts`

```ts
export const createQuestions = asyncHandler(async (req, res) => {
```

#### Step-by-Step Execution

##### Step 1: Authentication Check

```ts
const currentUser = req.user;
if (!currentUser) {
  throw new ApiError(401, "Unauthorized Access");
}
```

✔ `verifyJwt` adds `req.user`
✔ If missing, request is blocked

---

##### Step 2: Input Validation

```ts
if (!title || !content || !category) {
  throw new ApiError(400, "All fields are required");
}
```

---

##### Step 3: Parse Tags

Frontend sends:

```ts
payload.append("tags", JSON.stringify(tagsArray));
```

Backend parses:

```ts
tags = JSON.parse(req.body.tags);
```

---

##### Step 4: Handle Images

```ts
const files = req.files;
const imagePaths = files?.map(file => file.path);
```

* Multer provides temporary file paths
* Files are uploaded to Cloudinary

```ts
const uploadedImages = await Promise.all(
  imagePaths.map(path => uploadOnCloudinary(path))
);
```

Result:

```ts
images: ["https://cloudinary/..." ]
```

---

##### Step 5: Save Question in Database

```ts
const question = await Question.create({
  title,
  content,
  category,
  tags,
  images: imageUrls,
  author: currentUser._id,
});
```

Populate author details:

```ts
await question.populate('author', 'fullName email avatar username');
```

---

## 4. Real-Time Event Emission (Most Important Part)

### Getting Socket.IO inside Controller

```ts
const io = req.app.get('io');
```

**Why this works:**

* `app.set("io", io)` was done earlier
* Express app is globally accessible

---

### Emitting Event

```ts
io.to('questions-feed').emit('question:created', question);
```

#### Meaning Breakdown

| Part               | Meaning                |
| ------------------ | ---------------------- |
| `io.to(...)`       | Send event to a room   |
| `questions-feed`   | All users in that room |
| `question:created` | Event name             |
| `question`         | Payload                |

✔ All connected clients in the room receive the event instantly

---

## 5. Frontend Socket Setup

### 5.1 Socket Context

**File:** `socketContext.tsx`

```ts
const newSocket = io(BACKEND_URL, {
  withCredentials: true,
  transports: ['websocket'],
});
```

#### What happens?

1. React app loads
2. `SocketProvider` mounts
3. Client connects to backend socket server
4. Backend fires `io.on("connection")`
5. Client auto-joins `questions-feed`

---

### 5.2 useSocket Hook

```ts
export const useSocket = () => {
  return context.socket;
};
```

✔ Allows any component to access the same socket connection

---

## 6. Questions Feed (Real-Time UI)

### 6.1 Initial Data (REST)

```ts
const { data } = useGetAllQuestions();
```

REST call:

```
GET /question/get-all-questions
```

Initial render comes from database data

---

### 6.2 Listening for Real-Time Updates

```ts
socket.on("question:created", handleNewQuestion);
```

Backend emits:

```ts
io.to("questions-feed").emit("question:created", question);
```

➡ Callback runs instantly on all clients

---

### 6.3 Preventing Duplicate Questions

```ts
if (prev.some(q => q._id === newQuestion._id)) return prev;
```

**Why needed?**

* Creator gets REST response
* Creator also receives socket event

✔ Prevents duplicate insertion in UI

---

## 7. Create Question (Client Side)

### 7.1 React Query Mutation

```ts
useMutation({
  mutationFn: questionApis.createQuestion,
});
```

Sends:

```
POST /question/create-questions
```

Includes:

* FormData
* Images
* JWT (via Axios interceptor)

---

### 7.2 What Happens After Submit

1. Question saved in database
2. Socket event emitted
3. All clients receive update
4. React Query cache invalidated
5. UI stays synchronized

---

## 8. Full Request Timeline (One Line)

```
User submits form
→ Axios POST
→ Express route
→ verifyJwt
→ Multer
→ Controller
→ DB save
→ Socket emit
→ All clients update UI
```

---

## 9. Key Concepts Summary (Exam-Ready)

### Why REST + Socket Together?

| REST                                | Socket                     |
| ----------------------------------- | -------------------------- |
| Reliable                            | Real-time                  |
| Fetch initial data                  | Push updates               |
| Works without persistent connection | Requires active connection |

---

### Why Rooms?

* Scalability
* Feature isolation
* Avoid global broadcasts

---

### Why Context for Socket?

* Single socket connection
* Avoid reconnect spam
* Accessible across entire app
