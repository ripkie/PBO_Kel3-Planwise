import { Draggable, Droppable } from '@hello-pangea/dnd';
import TaskCard from './TaskCard';

function TaskColumn({ column }) {
  return (
    <div className="task-column">
      <div className="column-header">
        <div>
          <span className={`status-dot ${column.status}`}></span>
          <strong>{column.title}</strong>
          <span className="count">{column.tasks.length}</span>
        </div>
        <button>＋</button>
      </div>

      <Droppable droppableId={column.id}>
        {(provided) => (
          <div
            className="task-list"
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {column.tasks.map((task, index) => (
              <Draggable draggableId={task.id} index={index} key={task.id}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <TaskCard task={task} />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
            <button className="add-card-btn">＋ Add another task</button>
          </div>
        )}
      </Droppable>
    </div>
  );
}

export default TaskColumn;
