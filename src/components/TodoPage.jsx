import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Plus, X, Edit2, Smile } from 'lucide-react';

const TodoPage = () => {
  const initialColumns = {
    todo: {
      id: 'todo',
      title: 'To Do',
      inputPlaceholder: 'Add a new task to do',
      items: []
    },
    doing: {
      id: 'doing',
      title: 'Doing',
      inputPlaceholder: 'Add a task in progress',
      items: []
    },
    done: {
      id: 'done',
      title: 'Done ✨',
      inputPlaceholder: 'Add a completed task',
      items: []
    }
  };

  const loadFromLocalStorage = () => {
    const saved = localStorage.getItem('todoColumns');
    return saved ? JSON.parse(saved) : initialColumns;
  };

  const [columns, setColumns] = useState(loadFromLocalStorage);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newTaskTitles, setNewTaskTitles] = useState({
    todo: '',
    doing: '',
    done: ''
  });
  const [taskDetails, setTaskDetails] = useState('');
  const [newSubtask, setNewSubtask] = useState('');
  const [subtasks, setSubtasks] = useState([]);
  const [editingTitle, setEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const commonEmojis = ['🔥', '⭐', '💡', '📝', '🎯', '⚡', '❗', '✨', '📌', '🚀'];

  useEffect(() => {
    localStorage.setItem('todoColumns', JSON.stringify(columns));
  }, [columns]);

  useEffect(() => {
    if (selectedTask) {
      setTaskDetails(selectedTask.details || '');
      setSubtasks(selectedTask.subtasks || []);
      setEditedTitle(selectedTask.title || '');
    }
  }, [selectedTask]);

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) return;

    const sourceColumn = columns[source.droppableId];
    const destColumn = columns[destination.droppableId];
    const sourceItems = [...sourceColumn.items];
    const destItems = source.droppableId === destination.droppableId 
      ? sourceItems 
      : [...destColumn.items];

    const [removed] = sourceItems.splice(source.index, 1);
    const updatedTask = {
      ...removed,
      status: destination.droppableId
    };
    
    destItems.splice(destination.index, 0, updatedTask);

    setColumns({
      ...columns,
      [source.droppableId]: {
        ...sourceColumn,
        items: sourceItems
      },
      [destination.droppableId]: {
        ...destColumn,
        items: destItems
      }
    });
  };

  const addNewTask = (columnId) => {
    if (!newTaskTitles[columnId].trim()) return;

    const newTask = {
      id: `task-${Date.now()}`,
      title: newTaskTitles[columnId].trim(),
      details: '',
      completed: false,
      status: columnId,
      subtasks: []
    };

    setColumns(prev => ({
      ...prev,
      [columnId]: {
        ...prev[columnId],
        items: [...prev[columnId].items, newTask]
      }
    }));

    setNewTaskTitles(prev => ({
      ...prev,
      [columnId]: ''
    }));
  };

  const addSubtask = () => {
    if (!newSubtask.trim()) return;

    const newSubtaskItem = {
      id: `subtask-${Date.now()}`,
      title: newSubtask.trim(),
      completed: false
    };

    setSubtasks(prev => [...prev, newSubtaskItem]);
    setNewSubtask('');
  };

  const toggleSubtaskCompletion = (subtaskId) => {
    setSubtasks(prev => 
      prev.map(subtask =>
        subtask.id === subtaskId 
          ? { ...subtask, completed: !subtask.completed }
          : subtask
      )
    );
  };

  const removeSubtask = (subtaskId) => {
    setSubtasks(prev => prev.filter(subtask => subtask.id !== subtaskId));
  };

  const updateTaskStatus = (taskId, newStatus) => {
    let task;
    let sourceColumnId;

    Object.entries(columns).forEach(([columnId, column]) => {
      const foundTask = column.items.find(item => item.id === taskId);
      if (foundTask) {
        task = foundTask;
        sourceColumnId = columnId;
      }
    });

    if (!task || sourceColumnId === newStatus) return;

    const sourceItems = columns[sourceColumnId].items.filter(item => item.id !== taskId);
    const updatedTask = { ...task, status: newStatus };
    const destItems = [...columns[newStatus].items, updatedTask];

    setColumns(prev => ({
      ...prev,
      [sourceColumnId]: {
        ...prev[sourceColumnId],
        items: sourceItems
      },
      [newStatus]: {
        ...prev[newStatus],
        items: destItems
      }
    }));
  };

  const toggleTaskCompletion = (taskId, columnId) => {
    setColumns(prev => ({
      ...prev,
      [columnId]: {
        ...prev[columnId],
        items: prev[columnId].items.map(task =>
          task.id === taskId ? { ...task, completed: !task.completed } : task
        )
      }
    }));
  };

  const updateTaskTitle = () => {
    if (!selectedTask || !editedTitle.trim()) return;

    const columnId = selectedTask.status;
    setColumns(prev => ({
      ...prev,
      [columnId]: {
        ...prev[columnId],
        items: prev[columnId].items.map(task =>
          task.id === selectedTask.id 
            ? { ...task, title: editedTitle.trim() }
            : task
        )
      }
    }));
    setEditingTitle(false);
  };

  const addEmojiToTitle = (emoji) => {
    setEditedTitle(prev => {
      if (/^[\u{1F300}-\u{1F9FF}]/u.test(prev)) {
        return `${emoji} ${prev.replace(/^[\u{1F300}-\u{1F9FF}]\s?/u, '')}`;
      }
      return `${emoji} ${prev}`;
    });
    setShowEmojiPicker(false);
  };

  const saveTaskDetails = () => {
    if (!selectedTask) return;

    const columnId = selectedTask.status;
    setColumns(prev => ({
      ...prev,
      [columnId]: {
        ...prev[columnId],
        items: prev[columnId].items.map(task =>
          task.id === selectedTask.id 
            ? { ...task, details: taskDetails, subtasks: subtasks }
            : task
        )
      }
    }));
    setShowModal(false);
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
        <div className="w-12 h-12">
  {/*<Lottie
    animationData={animationData}
    loop={true}
    autoplay={true}
  />*/}
</div>
          <h1 className="text-4xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
            ✨ My Magical Todo List ✨
          </h1>
          <p className="text-gray-600 text-lg">Organize your tasks with joy and sparkle!</p>
        </div>

        <DragDropContext onDragEnd={onDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {Object.values(columns).map(column => (
              <div key={column.id} 
                className={`rounded-xl p-6 shadow-lg backdrop-blur-sm bg-white/80 
                  ${column.id === 'todo' ? 'bg-gradient-to-b from-pink-50 to-pink-100/90' : ''}
                  ${column.id === 'doing' ? 'bg-gradient-to-b from-purple-50 to-purple-100/90' : ''}
                  ${column.id === 'done' ? 'bg-gradient-to-b from-blue-50 to-blue-100/90' : ''}`}
              >
                <h2 className="font-bold text-xl mb-4 text-center">
                  {column.id === 'todo' && '📝'}
                  {column.id === 'doing' && '⚡'}
                  {column.id === 'done' && '🌟'}
                  <span className="ml-2">{column.title}</span>
                  <span className="ml-2 text-sm bg-white/50 px-2 py-1 rounded-full">
                    {column.items.length}
                  </span>
                </h2>
                
                <div className="mb-4">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder={column.inputPlaceholder}
                      value={newTaskTitles[column.id]}
                      onChange={(e) => setNewTaskTitles(prev => ({
                        ...prev,
                        [column.id]: e.target.value
                      }))}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          addNewTask(column.id);
                        }
                      }}
                      className="w-full p-3 rounded-lg border-2 border-transparent bg-white/50 backdrop-blur-sm
                        focus:outline-none focus:border-purple-300 transition-all duration-300
                        placeholder-gray-400 shadow-sm"
                    />
                    <button
                      onClick={() => addNewTask(column.id)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-purple-500 
                        hover:text-purple-700 transition-colors duration-200"
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                </div>

                <Droppable droppableId={column.id}>
                  {(provided, snapshot) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className={`min-h-[200px] transition-colors duration-200 rounded-lg
                        ${snapshot.isDraggingOver ? 'bg-purple-50/50' : ''}`}
                    >
                      {column.items.map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`bg-white rounded-lg p-4 mb-3
                                ${snapshot.isDragging ? 'shadow-lg ring-2 ring-purple-200' : 'shadow-md'}
                                transform transition-all duration-200
                                hover:scale-102 hover:shadow-lg hover:rotate-1`}
                            >
                              <div className="flex items-center space-x-3">
                                <input
                                  type="checkbox"
                                  checked={task.completed}
                                  onChange={() => toggleTaskCompletion(task.id, column.id)}
                                  className="h-5 w-5 rounded-full border-2 border-purple-300 
                                    text-purple-500 focus:ring-purple-500 transition-all duration-200
                                    checked:bg-gradient-to-r checked:from-purple-400 checked:to-pink-400"
                                  onClick={(e) => e.stopPropagation()}
                                />
                                <span 
                                  className={`flex-grow cursor-pointer
                                    ${task.completed ? 'line-through text-gray-400' : 'text-gray-700'}
                                    transition-all duration-200`}
                                  onClick={() => {
                                    setSelectedTask(task);
                                    setShowModal(true);
                                  }}
                                >
                                  {task.title}
                                </span>
                              </div>
                              {task.subtasks && task.subtasks.length > 0 && (
                                <div className="mt-2 ml-8 text-sm">
                                  <div className="bg-purple-100/50 px-3 py-1 rounded-full inline-block">
                                    {task.subtasks.filter(st => st.completed).length} / {task.subtasks.length} subtasks
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            ))}
          </div>
        </DragDropContext>

        {showModal && selectedTask && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center">
            <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl
              transform transition-all duration-300 scale-100 opacity-100">
              <div className="flex justify-between items-start mb-6">
                {editingTitle ? (
                  <div className="flex items-center space-x-2 w-full">
                    <input
                      type="text"
                      value={editedTitle}
                      onChange={(e) => setEditedTitle(e.target.value)}
                      className="flex-grow p-2 border-2 border-purple-200 rounded-lg
                        focus:outline-none focus:border-purple-400 transition-all duration-200"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          updateTaskTitle();
                        }
                      }}
                    />
                    <button
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      className="p-2 text-purple-500 hover:text-purple-700 transition-colors duration-200"
                    >
                      <Smile size={20} />
                    </button>
                    <button
                      onClick={updateTaskTitle}
                      className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500
                        text-white rounded-lg hover:from-purple-600 hover:to-pink-600
                        transition-all duration-200 shadow-md"
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center space-x-3">
                    <h3 className="text-xl font-bold text-gray-800">{selectedTask.title}</h3>
                    <button
                      onClick={() => setEditingTitle(true)}
                      className="p-1 text-purple-500 hover:text-purple-700 transition-colors duration-200"
                    >
                      <Edit2 size={16} />
                    </button>
                  </div>
                )}
              </div>

              {showEmojiPicker && (
                <div className="mb-4 p-3 border-2 border-purple-100 rounded-lg bg-purple-50">
                  <div className="flex flex-wrap gap-2">
                    {commonEmojis.map(emoji => (
                      <button
                        key={emoji}
                        onClick={() => addEmojiToTitle(emoji)}
                        className="p-2 hover:bg-purple-100 rounded-lg transition-colors duration-200"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={selectedTask.status}
                    onChange={(e) => updateTaskStatus(selectedTask.id, e.target.value)}
                    className="w-full p-3 border-2 border-purple-200 rounded-lg
                      focus:outline-none focus:border-purple-400 transition-all duration-200
                      bg-white"
                  >
                    <option value="todo">To Do 📝</option>
                    <option value="doing">Doing ⚡</option>
                    <option value="done">Done 🌟</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Task Details
                  </label>
                  <textarea
                    value={taskDetails}
                    onChange={(e) => setTaskDetails(e.target.value)}
                    className="w-full p-3 border-2 border-purple-200 rounded-lg h-32
                      focus:outline-none focus:border-purple-400 transition-all duration-200
                      bg-white resize-none"
                    placeholder="Add details about this task..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Subtasks
                  </label>
                  <div className="space-y-2 mb-4">
                    {subtasks.map(subtask => (
                      <div key={subtask.id} 
                        className="flex items-center space-x-2 p-2 rounded-lg
                          hover:bg-purple-50 transition-colors duration-200">
                        <input
                          type="checkbox"
                          checked={subtask.completed}
                          onChange={() => toggleSubtaskCompletion(subtask.id)}
                          className="h-4 w-4 rounded border-2 border-purple-300
                            text-purple-500 focus:ring-purple-500"
                        />
                        <span className={`flex-grow ${subtask.completed ? 'line-through text-gray-400' : ''}`}>
                          {subtask.title}
                        </span>
                        <button
                          onClick={() => removeSubtask(subtask.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors duration-200"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newSubtask}
                      onChange={(e) => setNewSubtask(e.target.value)}
                      placeholder="Add a subtask"
                      className="flex-grow p-3 border-2 border-purple-200 rounded-lg
                        focus:outline-none focus:border-purple-400 transition-all duration-200"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          addSubtask();
                        }
                      }}
                    />
                    <button
                      onClick={addSubtask}
                      className="p-3 bg-gradient-to-r from-purple-500 to-pink-500
                        text-white rounded-lg hover:from-purple-600 hover:to-pink-600
                        transition-all duration-200 shadow-md"
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100
                    rounded-lg transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={saveTaskDetails}
                  className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500
                    text-white rounded-lg hover:from-purple-600 hover:to-pink-600
                    transition-all duration-200 shadow-md"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TodoPage;