import  { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const TodoPage = () => {
  const [columns, setColumns] = useState({
    'to-do': {
      title: 'To Do',
      items: [
        { 
          id: 'task-1', // Use string IDs with a prefix
          title: 'Sell couch', 
          details: { 
            date: 'July 28th',
            cost: '$55',
            location: '1377 Fell St, San Francisco, CA 94117'
          }
        }
      ]
    },
    'doing': {
      title: 'Doing',
      items: [
        { 
          id: 'task-2', // Use string IDs with a prefix
          title: 'Sign up for 5k',
          details: {
            tasks: ['Ask Camille if she wants to join']
          }
        }
      ]
    },
    'done': {
      title: 'Done ✨',
      items: [
        { 
          id: 'task-3', // Use string IDs with a prefix
          title: 'Plan hiking trip to Yosemite',
          details: {
            checklist: [
              'Carrots',
              'Granola bars',
              'Yogurt',
              'Almonds',
              'Dried mangoes',
              'Bananas'
            ]
          }
        }
      ]
    }
  });

  const [selectedTask, setSelectedTask] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const onDragEnd = (result) => {
    if (!result.destination) return;
    
    const { source, destination } = result;
    
    // Create deep copies of the columns to avoid state mutation issues
    const newColumns = JSON.parse(JSON.stringify(columns));
    
    if (source.droppableId === destination.droppableId) {
      // Moving within the same column
      const column = newColumns[source.droppableId];
      const items = Array.from(column.items);
      const [reorderedItem] = items.splice(source.index, 1);
      items.splice(destination.index, 0, reorderedItem);
      
      setColumns({
        ...newColumns,
        [source.droppableId]: {
          ...column,
          items
        }
      });
    } else {
      // Moving between columns
      const sourceColumn = newColumns[source.droppableId];
      const destColumn = newColumns[destination.droppableId];
      const sourceItems = Array.from(sourceColumn.items);
      const destItems = Array.from(destColumn.items);
      
      // Remove from source column
      const [movedItem] = sourceItems.splice(source.index, 1);
      
      // Add to destination column
      destItems.splice(destination.index, 0, movedItem);
      
      setColumns({
        ...newColumns,
        [source.droppableId]: {
          ...sourceColumn,
          items: sourceItems
        },
        [destination.droppableId]: {
          ...destColumn,
          items: destItems
        }
      });
    }
  };

  const addNewTask = (columnId) => {
    if (newTaskTitle.trim() === '') return;
    
    const newTask = {
      id: `task-${Date.now()}`, // Use string IDs with a prefix
      title: newTaskTitle,
      details: {}
    };
    
    setColumns(prevColumns => ({
      ...prevColumns,
      [columnId]: {
        ...prevColumns[columnId],
        items: [...prevColumns[columnId].items, newTask]
      }
    }));
    
    setNewTaskTitle('');
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Task List</h1>
        <p className="text-gray-600">Use this board to track your personal tasks.</p>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.entries(columns).map(([columnId, column]) => (
            <div key={columnId} className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-semibold">
                  {column.title} ({column.items.length})
                </h2>
                <button 
                  className="p-2 hover:bg-gray-200 rounded-full"
                  onClick={() => addNewTask(columnId)}
                >
                  +
                </button>
              </div>

              <Droppable droppableId={columnId}>
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="space-y-3"
                  >
                    {column.items.map((task, index) => (
                      <Draggable 
                        key={task.id} 
                        draggableId={task.id} 
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer"
                            onClick={() => {
                              setSelectedTask(task);
                              setShowModal(true);
                            }}
                          >
                            <div className="flex justify-between items-start">
                              <div className="flex items-start space-x-3">
                                <input 
                                  type="checkbox" 
                                  checked={columnId === 'done'}
                                  onChange={() => {}}
                                  className="mt-1"
                                />
                                <span>{task.title}</span>
                              </div>
                              <button className="text-gray-500 hover:text-gray-700">
                                ⋮
                              </button>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>

              <div className="mt-3">
                <input
                  type="text"
                  placeholder="+ New task"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      addNewTask(columnId);
                    }
                  }}
                  className="w-full p-2 rounded border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          ))}
        </div>
      </DragDropContext>

      {showModal && selectedTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold">{selectedTask.title}</h3>
              <button 
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            
            {selectedTask.details.date && (
              <div className="mb-4">
                <h4 className="font-semibold mb-2">Date</h4>
                <p>{selectedTask.details.date}</p>
              </div>
            )}
            
            {selectedTask.details.cost && (
              <div className="mb-4">
                <h4 className="font-semibold mb-2">Cost</h4>
                <p>{selectedTask.details.cost}</p>
              </div>
            )}
            
            {selectedTask.details.location && (
              <div className="mb-4">
                <h4 className="font-semibold mb-2">Location</h4>
                <p>{selectedTask.details.location}</p>
              </div>
            )}
            
            {selectedTask.details.checklist && (
              <div className="mb-4">
                <h4 className="font-semibold mb-2">Checklist</h4>
                <div className="space-y-2">
                  {selectedTask.details.checklist.map((item, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input type="checkbox" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TodoPage;