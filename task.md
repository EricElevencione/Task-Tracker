1. # Print a menu like:

   # 📝 Task Tracker
   1. Add task
   2. Update task
   3. Delete task
   4. Mark in-progress
   5. Mark done
   6. List tasks
   7. # Exit

2. Ask "Choose an option: "

3. Based on their answer:
   - If "1" → ask for description → addTask()
   - If "7" → say goodbye → rl.close()
   - anything else → "Invalid option"

4. After each action, show the menu again (loop!)
