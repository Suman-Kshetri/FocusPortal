# 🚀 Let's C!

This guide will help you set up your environment for **C programming** on Linux 🐧, Windows 🪟, and Mac 🍏. We'll use **VS Code** (Visual Studio Code) as our IDE and the **GCC compiler** for compiling your code. 🎉

Follow the steps below, and you’ll be coding in no time! 🛠️

---

## 🌱 Linux (Ubuntu) Setup

Setting up C on Ubuntu is a breeze! Follow these simple steps:

### 🛠️ Step 1: Update Your System

Open your terminal 💻 and run:

```bash
sudo apt update && sudo apt upgrade
```

✅ This ensures your system is up-to-date.

### 🛠️ Step 2: Install GCC (C Compiler)

Install the **build-essential** package to get GCC:

```bash
sudo apt install build-essential
```

🎉 You now have the C compiler installed!

### 🛠️ Step 3: Install VS Code

Install Visual Studio Code with:

```bash
sudo apt install code
```

📂 This sets up your IDE for writing and debugging C programs.

### 🧐 What if I use another Linux distro?

If you're using a different Linux distribution (e.g., Fedora, Arch):

- Search for instructions like `Install GCC on Fedora` or `Install VS Code on Arch Linux`.
- Alternatively, check their official documentation.

---

## 🪟 Windows Setup

Setting up C on Windows is just as simple. Let’s get started!

### 🛠️ Step 1: Download and Install MinGW

MinGW provides GCC for Windows. Here's how to install it:

1. 🌐 Go to the [SourceForge Website](https://sourceforge.net/projects/mingw/).
2. Download the **MinGW installer**.
3. Run the installer and select:

   - **mingw32-gcc-g++** (for C and C++).
   - **mingw32-base**.

4. Add MinGW to your system PATH:
   - Open "Environment Variables" (search in Start Menu).
   - Add `C:\MinGW\bin` to the PATH variable.

### 🛠️ Step 2: Install VS Code

1. 🌐 Download **VS Code** from the [official site](https://code.visualstudio.com/).
2. Install and launch it.

### 🛠️ Step 3: Set Up VS Code for GCC

1. Install the **C/C++ extension** in VS Code (from Extensions Marketplace 🛒).
2. Configure a tasks.json file in VS Code to build your C programs.

🎉 You're ready to write and compile C programs on Windows!

---

## 🍏 Mac Setup

Mac users, let’s set up C programming on your system. 🖥️

### 🛠️ Step 1: Install Xcode Command Line Tools

Xcode Command Line Tools includes GCC:

1. Open **Terminal** and run:
   ```bash
   xcode-select --install
   ```
2. Follow the on-screen instructions to complete the installation.

### 🛠️ Step 2: Install VS Code

1. 🌐 Download **VS Code** from the [official site](https://code.visualstudio.com/).
2. Install and launch it.

### 🛠️ Step 3: Set Up VS Code for C

1. Install the **C/C++ extension** in VS Code.
2. Create a tasks.json file in VS Code to compile and run your C programs.

🎉 You’re all set to start coding in C on your Mac!

---

### ⚡ Final Note

Once your setup is complete, you can test it by writing a simple "Hello, World!" program:

```c
#include <stdio.h>

int main() {
    printf("Hello, World!\n");
    return 0;
}
```

- Save it as `hello.c`.
- Compile it using GCC:
  ```bash
  gcc hello.c -o hello
  ```
- Run the program:
  ```bash
  ./hello
  ```

🎉 Congratulations, you’re now a C programmer! 🎉
