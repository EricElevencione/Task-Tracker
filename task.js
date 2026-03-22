"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var FILE_NAME = "tasks.json";
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
function addTask(description) {
    var tasks = loadTasks();
    var newTask = {
        id: tasks.length > 0 ? Math.max.apply(Math, tasks.map(function (t) { return t.id; })) + 1 : 1,
        description: description,
        status: "todo",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
    tasks.push(newTask);
    saveTasks(tasks);
    console.log("\u2705 Task added (ID: ".concat(newTask.id, "): \"").concat(description, "\""));
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
// ── Entry point ───────────────────────────────────────────────────────────────
var _a = process.argv, command = _a[2], args = _a.slice(3);
switch (command) {
    case "add": {
        var description = args.join(" ").trim();
        if (!description) {
            console.error('❌ Usage: node task.js add "<description>"');
            process.exit(1);
        }
        addTask(description);
        break;
    }
    case "update": {
        var id = parseInt(args[0], 10);
        var description = args.slice(1).join(" ").trim();
        if (isNaN(id) || !description) {
            console.error('❌ Usage: node task.js update <id> "<description>"');
            process.exit(1);
        }
        updateTask(id, description);
        break;
    }
    case "delete": {
        var id = parseInt(args[0], 10);
        if (isNaN(id)) {
            console.error("❌ Usage: node task.js delete <id>");
            process.exit(1);
        }
        deleteTask(id);
        break;
    }
    case "mark-in-progress": {
        var id = parseInt(args[0], 10);
        if (isNaN(id)) {
            console.error("❌ Usage: node task.js mark-in-progress <id>");
            process.exit(1);
        }
        markTask(id, "in-progress");
        break;
    }
    case "mark-done": {
        var id = parseInt(args[0], 10);
        if (isNaN(id)) {
            console.error("❌ Usage: node task.js mark-done <id>");
            process.exit(1);
        }
        markTask(id, "done");
        break;
    }
    case "list": {
        var filter = args[0];
        var valid = [undefined, "done", "todo", "in-progress"];
        if (!valid.includes(filter)) {
            console.error("❌ Usage: node task.js list [done | todo | in-progress]");
            process.exit(1);
        }
        listTasks(filter);
        break;
    }
    default:
        printHelp();
        break;
}
