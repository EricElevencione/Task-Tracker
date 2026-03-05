# 📝 Task Tracker

A simple command-line task manager written in TypeScript.  
Store, update, and query your tasks using a JSON file in the current directory—with zero external dependencies.

---

## 🚀 Features

The app works entirely via positional command‑line arguments and supports:

- ✅ **Add**, **update**, and **delete** tasks
- 🔄 Mark tasks as **in progress** or **done**
- 📋 List tasks:
  - all
  - only **done**
  - only **not done**
  - only **in progress**

---

## 🛠️ Requirements & Constraints

- Language: **TypeScript** (but any language could be used)
- CLI input via positional arguments
- Tasks stored in a `tasks.json` file
  - Automatically created if it doesn’t exist
- Uses the native file-system module
- **No external libraries or frameworks**
- Gracefully handles errors and edge cases

---

## 📁 File Structure

```
.
├── README.md          # ← you’re here!
└── task.ts            # main application logic
```

---

## 💡 Usage Example

```bash
# Add a task
node task.js add "Buy groceries"

# Update a task
node task.js update 1 "Buy groceries and cleaning supplies"

# Mark done
node task.js complete 1

# List all tasks
node task.js list
```

_(Adapt commands based on the actual CLI implementation in `task.ts`)_

---

## 🏁 Getting Started

1. Clone the repo:

   ```bash
   git clone https://github.com/EricElevencione/Task-Tracker.git
   cd Task-Tracker
   ```

2. Install dependencies (if any) or compile TS:

   ```bash
   tsc task.ts
   ```

3. Run the script with the desired arguments.

---

> **Note:** There's no `tasks.json` until you create your first task. The program will handle that automatically.

---

Thanks for checking out Task Tracker!  
Feel free to fork, modify, or improve ⬆️

---

Let me know if you'd like help adding examples or badges for further flair!

![Programming](https://media.giphy.com/media/78XCFBGOlS6keY1Bil/giphy.gif)
