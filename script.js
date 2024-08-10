$(document).ready(function() {
  let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
  let nextId = JSON.parse(localStorage.getItem("nextId")) || 1;

  // Generate a unique task ID
  function generateTaskId() {
    return nextId++;
  }

  // Create a task card
  function createTaskCard(task) {
    const card = $(`
      <div class="task-card card mb-3" data-id="${task.id}" style="background-color: ${getTaskColor(task.dueDate)};">
        <div class="card-body">
          <h5 class="card-title">${task.title}</h5>
          <p class="card-text">${task.description}</p>
          <p class="card-text"><small class="text-muted">Due: ${dayjs(task.dueDate).format('MMM D, YYYY')}</small></p>
          <button class="btn btn-danger btn-sm delete-task">Delete</button>
        </div>
      </div>
    `);
    return card;
  }

  // Determine the color of the task card based on the due date
  function getTaskColor(dueDate) {
    const today = dayjs();
    const due = dayjs(dueDate);
    if (due.isBefore(today, 'day')) {
      return '#ffdddd'; // Light red
    } else if (due.isBefore(today.add(1, 'week'), 'day')) {
      return '#ffffcc'; // Light yellow
    }
    return '#ffffff'; // White
  }

  // Render the task list
  function renderTaskList() {
    const lanes = {
      "to-do": "#todo-cards",
      "in-progress": "#in-progress-cards",
      "done": "#done-cards"
    };
    
    // Clear existing cards
    for (let lane in lanes) {
      $(lanes[lane]).empty();
    }

    // Create and append task cards
    taskList.forEach(task => {
      const card = createTaskCard(task);
      $(`#${task.status}-cards`).append(card);
    });

    // Add delete functionality
    $(".delete-task").on("click", handleDeleteTask);

    // Initialize draggable and droppable
    $(".task-card").draggable({
      revert: "invalid",
      helper: "clone"
    });
    $(".lane").droppable({
      accept: ".task-card",
      drop: handleDrop
    });
  }

  // Handle adding a new task
  $("#task-form").on("submit", function(event) {
    event.preventDefault();
    const task = {
      id: generateTaskId(),
      title: $("#task-title").val(),
      description: $("#task-description").val(),
      dueDate: $("#task-deadline").val(),
      status: "to-do" // Default status
    };

    // Save task to localStorage
    taskList.push(task);
    localStorage.setItem("tasks", JSON.stringify(taskList));
    localStorage.setItem("nextId", JSON.stringify(nextId));

    // Close the modal
    $("#formModal").modal('hide');

    // Render the task list
    renderTaskList();
  });

  // Handle deleting a task
  function handleDeleteTask(event) {
    const taskId = $(event.target).closest(".task-card").data("id");

    // Remove the task from the list
    taskList = taskList.filter(task => task.id !== taskId);
    localStorage.setItem("tasks", JSON.stringify(taskList));

    // Render the task list
    renderTaskList();
  }

  // Handle dropping a task into a new status lane
  function handleDrop(event, ui) {
    const taskId = $(ui.helper).data("id");
    const newStatus = $(this).attr("id");

    // Update task status
    const task = taskList.find(task => task.id === taskId);
    task.status = newStatus;
    localStorage.setItem("tasks", JSON.stringify(taskList));

    // Render the task list
    renderTaskList();
  }

  // Initial render
  renderTaskList();
});









