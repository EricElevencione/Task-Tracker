"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var readline = require("readline");
var FILE_NAME = "tasks.json";
var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});
// ── File helpers ──────────────────────────────────────────────────────────────
function loadTasks() {
    if (!fs.existsSync(FILE_NAME))
        return [];
    try {
        var data = fs.readFileSync(FILE_NAME, "utf-8");
        return JSON.parse(data);
    }
    catch (_a) {
        return [];
    }
}
function saveTasks(tasks) {
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
    rl.question("Enter your choice: ", function (answer) {
        if (answer === "0") {
            console.log("👋 Goodbye!");
            rl.close(); // ← actually stops the program
            return; // ← stops mainMenu() from being called again
        }
        else if (answer === "1") {
            addTask();
        }
        else if (answer === "2") {
            updateTask(parseInt(answer), answer);
        }
        else if (answer === "3") {
            deleteTask(parseInt(answer));
        }
        else if (answer === "4") {
            markTask(parseInt(answer), "in-progress");
        }
        else if (answer === "5") {
            markTask(parseInt(answer), "done");
        }
        else if (answer === "6") {
            listTasks();
        }
        else if (answer === "7") {
            printHelp();
        }
        else {
            console.error("❌ Invalid command. Please try again.");
        }
    });
}
function addTask() {
    rl.question("What do you want to add:", function (answer) {
        var tasks = loadTasks();
        if (answer === "") {
            mainMenu();
        }
        else {
            var newTask = {
                id: tasks.length > 0 ? Math.max.apply(Math, tasks.map(function (t) { return t.id; })) + 1 : 1,
                description: answer,
                status: "todo",
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };
            tasks.push(newTask);
            saveTasks(tasks);
            console.log("\u2705 Task added (ID: ".concat(newTask.id, "): \"").concat(answer, "\""));
        }
        mainMenu();
    });
}
function updateTask(id, description) {
    var tasks = loadTasks();
    var task = tasks.find(function (t) { return t.id === id; });
    if (!task) {
        console.error("\u274C No task found with ID ".concat(id, "."));
        process.exit(1);
    }
    task.description = description;
    task.updatedAt = new Date().toISOString();
    saveTasks(tasks);
    console.log("\u270F\uFE0F  Task ".concat(id, " updated: \"").concat(description, "\""));
}
function deleteTask(id) {
    var tasks = loadTasks();
    var index = tasks.findIndex(function (t) { return t.id === id; });
    if (index === -1) {
        console.error("\u274C No task found with ID ".concat(id, "."));
        process.exit(1);
    }
    var removed = tasks.splice(index, 1)[0];
    saveTasks(tasks);
    console.log("\uD83D\uDDD1\uFE0F  Task ".concat(id, " deleted: \"").concat(removed.description, "\""));
}
function markTask(id, status) {
    var tasks = loadTasks();
    var task = tasks.find(function (t) { return t.id === id; });
    if (!task) {
        console.error("\u274C No task found with ID ".concat(id, "."));
        process.exit(1);
    }
    task.status = status;
    task.updatedAt = new Date().toISOString();
    saveTasks(tasks);
    var icon = status === "done" ? "✅" : "🔄";
    console.log("".concat(icon, " Task ").concat(id, " marked as \"").concat(status, "\"."));
}
function listTasks(filter) {
    var tasks = loadTasks();
    var filtered = filter ? tasks.filter(function (t) { return t.status === filter; }) : tasks;
    if (filtered.length === 0) {
        console.log("📭 No tasks found.");
        return;
    }
    var statusIcon = {
        todo: "⬜",
        "in-progress": "🔄",
        done: "✅",
    };
    var label = filter ? "Tasks (".concat(filter, ")") : "All Tasks";
    console.log("\n\uD83D\uDCCB ".concat(label, ":"));
    console.log("─".repeat(50));
    for (var _i = 0, filtered_1 = filtered; _i < filtered_1.length; _i++) {
        var task = filtered_1[_i];
        console.log("".concat(statusIcon[task.status], " [").concat(task.id, "] ").concat(task.description));
        console.log("      Status: ".concat(task.status, " | Updated: ").concat(new Date(task.updatedAt).toLocaleString()));
    }
    console.log("─".repeat(50));
    console.log("Total: ".concat(filtered.length, " task(s)\n"));
}
// ── Help ──────────────────────────────────────────────────────────────────────
function printHelp() {
    console.log("\n\uD83D\uDCDD Task Tracker CLI\n\nUsage:\n  node task.js <command> [arguments]\n\nCommands:\n  add <description>              Add a new task\n  update <id> <description>      Update an existing task\n  delete <id>                    Delete a task\n  mark-in-progress <id>          Mark a task as in-progress\n  mark-done <id>                 Mark a task as done\n  list                           List all tasks\n  list done                      List completed tasks\n  list todo                      List tasks not yet started\n  list in-progress               List tasks in progress\n\nExamples:\n  node task.js add \"Buy groceries\"\n  node task.js update 1 \"Buy groceries and cleaning supplies\"\n  node task.js mark-in-progress 1\n  node task.js mark-done 1\n  node task.js delete 1\n  node task.js list\n  node task.js list done\n  ");
}
mainMenu();
