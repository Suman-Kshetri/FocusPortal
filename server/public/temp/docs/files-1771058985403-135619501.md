# 🚀 Let's Configure C

In this guide, we'll set up **VS Code** for **C programming** step by step. 🛠️  
You’ll learn how to:

1. Install essential extensions.
2. Verify your GCC installation.
3. Configure the **Run in Terminal** option for Code Runner.

---

## 🛠️ Step 1: Install Required Extensions

### 1️⃣ **C/C++ Extension Pack**

- Open **VS Code**.
- Go to the **Extensions Marketplace** (Ctrl+Shift+X or Cmd+Shift+X).
- Search for **C/C++ Extension Pack** and install it.
  > 🧩 This includes tools like IntelliSense, debugging, and formatting support.

### 2️⃣ **Code Runner**

- In the Extensions Marketplace, search for **Code Runner** and install it.
  > ⚡ Code Runner allows you to run your C code with a single click.

---

## 🛠️ Step 2: Verify Your GCC Installation

Before diving into coding, ensure GCC is installed and working.

1. Open the **Terminal** in VS Code (Ctrl+` or Cmd+`).
2. Type the following command:
   ```bash
   gcc --version
   ```
3. If GCC is installed, you’ll see output similar to:
   ```
   gcc (Ubuntu 11.3.0) 11.3.0
   Copyright (C) 2021 Free Software Foundation, Inc.
   ```
4. ❌ If you get an error, go back to the setup guide and install GCC properly for your OS.

---

## 🛠️ Step 3: Configure Code Runner

By default, **Code Runner** runs your program in the output window, which doesn’t support user input. Let’s change it to run in the terminal instead.

### 1️⃣ Open Code Runner Settings

- Open the Command Palette (Ctrl+Shift+P or Cmd+Shift+P).
- Search for **Preferences: Open Settings (JSON)** and select it.

### 2️⃣ Add the Following Configuration

Insert this snippet into the settings.json file:

```json
{
  "code-runner.runInTerminal": true
}
```

### 🔍 Explanation:

- `"code-runner.runInTerminal": true`  
  This ensures your program runs in the terminal.

---

## 🎯 Test Your Configuration

1. Write a simple **Hello, World!** program:

   ```c
   #include <stdio.h>

   int main() {
       printf("Hello, World!\n");
       return 0;
   }
   ```

2. Save it as `hello.c`.
3. Click the **Run Code** button (triangle icon in the top right) or press `Ctrl+Alt+N`.
4. 🎉 Your program should run in the terminal, displaying:
   ```
   Hello, World!
   ```

---

🎉 You’ve successfully configured VS Code for **C programming**! 🎉
