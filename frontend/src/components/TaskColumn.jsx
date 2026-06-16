import { Droppable, Draggable } from "@hello-pangea/dnd";
import TaskCard from "./TaskCard";

function TaskColumn({ column, onSelect }) {
  if (!column) {
    return null;
  }

  const tasks = column.tasks || [];

  return (
    <div className="task-column">
      <div className="column-header">
        <h3>{column.title || "-"}</h3>
        <span className="task-count">{tasks.length}</span>
      </div>

      <Droppable droppableId={column.id || "empty"}>
        {(provided) => (
          <div
            className="task-list"
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {tasks.map((task, index) => (
              <Draggable key={task.id} draggableId={task.id} index={index}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <TaskCard task={task} onSelect={onSelect} />
                  </div>
                )}
              </Draggable>
            ))}

            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}

export default TaskColumn;