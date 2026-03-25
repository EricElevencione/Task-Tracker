import * as fs from "fs";
import { stringify } from "querystring";
import * as readline from "readline";

const FILE_NAME = "tasks.json";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

interface Task {
  id: number;
  description: string;
  status: "todo" | "in-progress" | "done";
  createdAt: string;
  updatedAt: string;
}

// ── File helpers ──────────────────────────────────────────────────────────────

function loadTasks(): Task[] {
  if (!fs.existsSync(FILE_NAME)) return [];
  try {
    const data = fs.readFileSync(FILE_NAME, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

function saveTasks(tasks: Task[]): void {
  fs.writeFileSync(FILE_NAME, JSON.stringify(tasks, null, 2));
}

// ── Commands ──────────────────────────────────────────────────────────────────

function display() {
  console.log("──────────────────────────────────────────────");
  console.log("#Task Tracker");
  console.log("1. Add Task");
  console.log("2. Update Task");
  console.log("3. Delete Task");
  console.log("4. Mark as In Progress");
  console.log("5. Mark as Done");
  console.log("6. List Tasks");
  console.log("7. Help");
  console.log("0. Exit");
  console.log("Type the command number to proceed......");
  console.log("──────────────────────────────────────────────");
}

function mainMenu() {
  display();

  rl.question("Enter your choice: ", (answer) => {
    if (answer === "0") {
      console.log("👋 Goodbye!");
      rl.close(); // ← actually stops the program
      return; // ← stops mainMenu() from being called again
    } else if (answer === "1") {
      addTask();
    } else if (answer === "2") {
      updateTask();
    } else if (answer === "3") {
      deleteTask(parseInt(answer));
    } else if (answer === "4") {
      markTask(parseInt(answer), "in-progress");
    } else if (answer === "5") {
      markTask(parseInt(answer), "done");
    } else if (answer === "6") {
      listTasks();
    } else if (answer === "7") {
      printHelp();
    } else {
      console.error("❌ Invalid command. Please try again.");
    }
  });
}

function addTask(): void {
  rl.question("What do you want to add:", (answer) => {
    const tasks = loadTasks();

    if (answer === "") {
      mainMenu();
    } else {
      const newTask: Task = {
        id: tasks.length > 0 ? Math.max(...tasks.map((t) => t.id)) + 1 : 1,
        description: answer,
        status: "todo",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      tasks.push(newTask);
      saveTasks(tasks);

      console.log(`✅ Task added (ID: ${newTask.id}): "${answer}"`);
    }
    mainMenu();
  });
}

function updateTask(): void {
  console.log(listTasks()); // Show all tasks to help user choose which one to update

  rl.question("Enter the ID of the task to update: ", (idInput) => {
    rl.question("Enter the new description: ", (description) => {
      const id = parseInt(idInput);

      const tasks = loadTasks();
      const task = tasks.find((t) => t.id === id);
      if (!task) {
        console.error(`❌ No task found with ID ${id}.`);
        process.exit(1);
      }
      task.description = description;
      task.updatedAt = new Date().toISOString();
      saveTasks(tasks);
      console.log(`✏️  Task ${id} updated: "${description}"`);
      mainMenu();
    });
  });
}

function deleteTask(id: number): void {
  const tasks = loadTasks();
  const index = tasks.findIndex((t) => t.id === id);
  if (index === -1) {
    console.error(`❌ No task found with ID ${id}.`);
    process.exit(1);
  }
  const [removed] = tasks.splice(index, 1);
  saveTasks(tasks);
  console.log(`🗑️  Task ${id} deleted: "${removed.description}"`);
}

function markTask(id: number, status: Task["status"]): void {
  const tasks = loadTasks();
  const task = tasks.find((t) => t.id === id);
  if (!task) {
    console.error(`❌ No task found with ID ${id}.`);
    process.exit(1);
  }
  task.status = status;
  task.updatedAt = new Date().toISOString();
  saveTasks(tasks);
  const icon = status === "done" ? "✅" : "🔄";
  console.log(`${icon} Task ${id} marked as "${status}".`);
}

function listTasks(filter?: Task["status"]): void {
  const tasks = loadTasks();
  const filtered = filter ? tasks.filter((t) => t.status === filter) : tasks;

  if (filtered.length === 0) {
    console.log("📭 No tasks found.");
    return;
  }

  const statusIcon: Record<Task["status"], string> = {
    todo: "⬜",
    "in-progress": "🔄",
    done: "✅",
  };

  const label = filter ? `Tasks (${filter})` : "All Tasks";
  console.log(`\n📋 ${label}:`);
  console.log("─".repeat(50));
  for (const task of filtered) {
    console.log(`${statusIcon[task.status]} [${task.id}] ${task.description}`);
    console.log(
      `      Status: ${task.status} | Updated: ${new Date(task.updatedAt).toLocaleString()}`,
    );
  }
  console.log("─".repeat(50));
  console.log(`Total: ${filtered.length} task(s)\n`);
}

// ── Help ──────────────────────────────────────────────────────────────────────

function printHelp(): void {
  console.log(`
📝 Task Tracker CLI

Usage:
  node task.js <command> [arguments]

Commands:
  add <description>              Add a new task
  update <id> <description>      Update an existing task
  delete <id>                    Delete a task
  mark-in-progress <id>          Mark a task as in-progress
  mark-done <id>                 Mark a task as done
  list                           List all tasks
  list done                      List completed tasks
  list todo                      List tasks not yet started
  list in-progress               List tasks in progress

Examples:
  node task.js add "Buy groceries"
  node task.js update 1 "Buy groceries and cleaning supplies"
  node task.js mark-in-progress 1
  node task.js mark-done 1
  node task.js delete 1
  node task.js list
  node task.js list done
  `);
}

mainMenu();
