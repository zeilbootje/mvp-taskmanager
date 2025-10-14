/* Function to format ISO date string to "YYYY-MM-DD HH:MM" */
    function formatDate(isoString) {
  if (!isoString) return "(Geen datum)";
  const date = new Date(isoString);
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const hh = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd} ${hh}:${min}`;
}

document.addEventListener('DOMContentLoaded', () => { 

    loadTasks(); /* load tasks */

    const form = document.getElementById('taskForm'); /* listen to the form */
    form.addEventListener('submit', addTask);
});

/* function to pick up a task */
async function loadTasks() {
    try { /* Fetch data from the server */
    const response = await fetch('/api/tasks');
    const tasks = await response.json(); /* Translate JSON to JS array */

    const container = document.getElementById('tasks'); /* Search for element where tasks should be put into */
    container.innerHTML = ''; /* Empty container */

    if (tasks.length === 0) {
        container.innerHTML = '<p>No tasks found.</p>';
        return;
    }

    /* Create HTML with template literals aka builds html for every task */
    tasks.forEach(task => {
        const taskHTML = `
        <div class="task">
            <h3>${task.title}</h3>
            <p><strong>Datum:</strong> ${formatDate(task.task_date)}</p>
            <p><strong>Notities:</strong> ${task.notes || '(No notes)'}</p>
        </div>
        `;
        container.innerHTML += taskHTML; /* Add html to page */
    });

    } catch (error) {
    console.error('Error loading tasks:', error);
    }
}

/* Function to add a new task, now in JS instead of HTML */
async function addTask(event) {
    event.preventDefault(); /* Prevent the form to refresh site */

const form = event.target;
const Title = form.Title.value;
const date = form.date.value;
const Notes = form.Notes.value;

/* send POST request to server */
const response = await fetch('/data', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, /* Important for express to read the data */
    body: new URLSearchParams({ Title, date, Notes }) /* Easy to read for server */

});

if (response.ok) { /* If everything went well */
    console.log('Task added successfully');
    form.reset(); /* Clear the form */
    loadTasks(); /* Reload tasks to show the new one */
    } else {
    console.error('Error adding task');
    }
}