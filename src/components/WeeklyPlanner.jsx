/* eslint-disable react/prop-types */
import { useState, useRef, useEffect } from 'react';
import { format, addDays, startOfWeek, endOfWeek, eachDayOfInterval, addHours } from 'date-fns';
import EventModal from './WeeklyEvent';

// Helper functions moved outside component for cleaner code
const isSameDay = (date1, date2) => {
  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
};

// Day themes extracted as a constant outside the component
const DAY_THEMES = {
  monday: { bg: 'bg-gradient-to-br from-purple-300 to-pink-200', emoji: '🌸', color: 'text-purple-800' },
  tuesday: { bg: 'bg-gradient-to-br from-purple-400 to-pink-300', emoji: '✨', color: 'text-purple-900' },
  wednesday: { bg: 'bg-gradient-to-br from-purple-500 to-pink-400', emoji: '🦋', color: 'text-white' },
  thursday: { bg: 'bg-gradient-to-br from-purple-400 to-pink-300', emoji: '🌹', color: 'text-purple-900' },
  friday: { bg: 'bg-gradient-to-br from-purple-300 to-pink-200', emoji: '🎵', color: 'text-purple-800' },
  saturday: { bg: 'bg-gradient-to-br from-purple-200 to-indigo-200', emoji: '🌈', color: 'text-purple-800' },
  sunday: { bg: 'bg-gradient-to-br from-indigo-200 to-purple-200', emoji: '🌞', color: 'text-purple-800' }
};

// Get theme for a specific day
const getDayTheme = (day) => {
  const dayName = format(day, 'EEEE').toLowerCase();
  return DAY_THEMES[dayName] || DAY_THEMES.monday; // Default to Monday theme
};

// Initial state values from localStorage with default fallbacks
const getInitialState = () => {
  return {
    events: (() => {
      const savedEvents = localStorage.getItem('planner-events');
      if (savedEvents) {
        const parsedEvents = JSON.parse(savedEvents);
        return parsedEvents.map(event => ({
          ...event,
          start: new Date(event.start),
          end: new Date(event.end)
        }));
      }
      return [{ 
        id: 1, 
        title: 'Hackathon', 
        start: new Date(2025, 1, 18, 9, 0), 
        end: new Date(2025, 1, 18, 17, 0),
        allDay: true,
        color: '#9333EA'
      }];
    })(),
    tasks: JSON.parse(localStorage.getItem('planner-tasks') || '{}'),
    view: localStorage.getItem('planner-view') || 'week',
    selectedDay: localStorage.getItem('planner-selected-day') ? new Date(localStorage.getItem('planner-selected-day')) : null,
    timeRange: JSON.parse(localStorage.getItem('planner-time-range') || '{"start":8,"end":20}')
  };
};

const WeeklyPlanner = () => {
  // State initialization with grouped related states
  const [currentDate] = useState(new Date());
  const [{ events, tasks, view, selectedDay, timeRange }, setState] = useState(getInitialState);
  
  // Modal related states
  const [modalState, setModalState] = useState({
    isAddingEvent: false,
    isEditingEvent: false,
    isEditingTask: false,
    newEvent: null,
    editingEvent: null,
    selectedTask: null,
    removeOriginalTask: true
  });
  
  // Destructure modal state for convenience
  const {
    isAddingEvent, isEditingEvent, isEditingTask, 
    newEvent, editingEvent, selectedTask, removeOriginalTask
  } = modalState;
  
  const modalRef = useRef(null);

  // Save data to localStorage
  useEffect(() => {
    const saveToStorage = (key, value) => {
      try {
        localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
      } catch (error) {
        console.error(`Could not save ${key} to localStorage:`, error);
      }
    };
    
    saveToStorage('planner-events', events);
    saveToStorage('planner-tasks', tasks);
    saveToStorage('planner-view', view);
    if (selectedDay) saveToStorage('planner-selected-day', selectedDay.toISOString());
    saveToStorage('planner-time-range', timeRange);
  }, [events, tasks, view, selectedDay, timeRange]);

  // Modal positioning
  useEffect(() => {
    if (isAddingEvent || isEditingTask || isEditingEvent) {
      const centerModal = () => {
        if (modalRef.current) {
          const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
          const viewportHeight = window.innerHeight;
          const modalHeight = modalRef.current.offsetHeight;
          modalRef.current.style.top = `${scrollTop + (viewportHeight - modalHeight) / 2}px`;
        }
      };
      
      centerModal();
      window.addEventListener('resize', centerModal);
      window.addEventListener('scroll', centerModal);
      
      return () => {
        window.removeEventListener('resize', centerModal);
        window.removeEventListener('scroll', centerModal);
      };
    }
  }, [isAddingEvent, isEditingTask, isEditingEvent]);

  // Get the days for the current week
  const startDate = startOfWeek(currentDate, { weekStartsOn: 0 });
  const endDate = endOfWeek(currentDate, { weekStartsOn: 0 });
  const days = eachDayOfInterval({ start: startDate, end: endDate });

  // State updaters combined for related states
  const updateState = (updates) => {
    setState(prev => ({ ...prev, ...updates }));
  };
  
  const updateModalState = (updates) => {
    setModalState(prev => ({ ...prev, ...updates }));
  };

  // Navigation functions
  const navigate = (direction) => {
    if (view === 'day' && selectedDay) {
      updateState({ selectedDay: addDays(selectedDay, direction) });
    } else {
      updateState({ currentDate: addDays(currentDate, direction * 7) });
    }
  };

  // Task management functions
  const taskActions = {
    add: (day) => {
      const dateKey = format(day, 'yyyy-MM-dd');
      const dayTasks = tasks[dateKey] || [];
      
      updateState({
        tasks: {
          ...tasks,
          [dateKey]: [...dayTasks, { id: Date.now(), text: '', completed: false }]
        }
      });
    },
    
    update: (day, taskId, text) => {
      const dateKey = format(day, 'yyyy-MM-dd');
      const dayTasks = tasks[dateKey] || [];
      
      updateState({
        tasks: {
          ...tasks,
          [dateKey]: dayTasks.map(task => 
            task.id === taskId ? { ...task, text } : task
          )
        }
      });
    },
    
    toggle: (day, taskId) => {
      const dateKey = format(day, 'yyyy-MM-dd');
      const dayTasks = tasks[dateKey] || [];
      
      updateState({
        tasks: {
          ...tasks,
          [dateKey]: dayTasks.map(task => 
            task.id === taskId ? { ...task, completed: !task.completed } : task
          )
        }
      });
    },
    
    delete: (day, taskId) => {
      const dateKey = format(day, 'yyyy-MM-dd');
      const dayTasks = tasks[dateKey] || [];
      
      updateState({
        tasks: {
          ...tasks,
          [dateKey]: dayTasks.filter(task => task.id !== taskId)
        }
      });
    },
    
    getForDay: (day) => {
      const dateKey = format(day, 'yyyy-MM-dd');
      return tasks[dateKey] || [];
    },
    
    convertToEvent: (day, task) => {
      // Create default event time at noon or current hour if in working hours
      const now = new Date();
      const hour = (now.getHours() >= timeRange.start && now.getHours() < timeRange.end) 
        ? now.getHours() 
        : 12;
      
      const start = new Date(day);
      start.setHours(hour, 0);
      
      updateModalState({
        selectedTask: { day, task },
        newEvent: {
          id: Date.now(),
          title: task.text,
          start,
          end: addHours(start, 1),
          color: '#9333EA',
          fromTask: true,
          taskId: task.id
        },
        isEditingTask: true
      });
    }
  };

  // Event management functions
  const eventActions = {
    getForDay: (day) => {
      return events.filter(event => 
        isSameDay(new Date(event.start), day) && !event.allDay
      ).sort((a, b) => new Date(a.start) - new Date(b.start));
    },
    
    getAllDay: (day) => {
      return events.filter(event => 
        event.allDay && isSameDay(new Date(event.start), day)
      );
    },
    
    add: (day, hour) => {
      const start = new Date(day);
      start.setHours(hour, 0);
      
      updateModalState({
        newEvent: {
          id: Date.now(),
          title: '',
          start,
          end: addHours(start, 1),
          color: '#9333EA'
        },
        isAddingEvent: true
      });
    },
    
    save: () => {
      if (newEvent && newEvent.title.trim() !== '') {
        updateState({ events: [...events, newEvent] });
      }
      updateModalState({ isAddingEvent: false, newEvent: null });
    },
    
    getStyle: (event) => {
      const startHour = event.start.getHours() + (event.start.getMinutes() / 60);
      const endHour = event.end.getHours() + (event.end.getMinutes() / 60);
      const duration = endHour - startHour;
      
      return {
        top: `${(startHour - timeRange.start) * 60}px`,
        height: `${duration * 60}px`,
      };
    },
    
    saveTaskAsEvent: () => {
      if (newEvent?.title.trim()) {
        updateState({ events: [...events, newEvent] });
        
        if (removeOriginalTask && selectedTask) {
          taskActions.delete(selectedTask.day, selectedTask.task.id);
        }
      }
      
      updateModalState({
        isEditingTask: false,
        newEvent: null,
        selectedTask: null
      });
    },
    
    update: () => {
      updateState({
        events: events.map(e => e.id === editingEvent.id ? editingEvent : e)
      });
      updateModalState({
        isEditingEvent: false,
        editingEvent: null
      });
    }
  };

  // Clear all data
  const clearAllData = () => {
    if (window.confirm('Are you sure you want to clear all planner data? This cannot be undone.')) {
      ['planner-events', 'planner-tasks', 'planner-view', 'planner-selected-day', 'planner-time-range']
        .forEach(key => localStorage.removeItem(key));
      
      updateState({
        events: [],
        tasks: {},
        view: 'week',
        selectedDay: null,
        timeRange: { start: 8, end: 20 }
      });
    }
  };

  // Rendering helper components
  const TimeRangeSelector = () => (
    <div className="mb-6 flex items-center space-x-4 bg-white/80 p-3 rounded-xl shadow-sm border border-purple-100">
      <label className="font-medium text-gray-700">Time Range:</label>
      <select 
        value={timeRange.start} 
        onChange={(e) => updateState({ timeRange: { ...timeRange, start: parseInt(e.target.value) } })}
        className="border border-purple-200 rounded-md p-2 focus:ring-2 focus:ring-purple-300 focus:outline-none"
      >
        {Array.from({ length: 24 }).map((_, i) => (
          <option key={`start-${i}`} value={i} disabled={i >= timeRange.end}>
            {i === 0 ? '12 AM' : i < 12 ? `${i} AM` : i === 12 ? '12 PM' : `${i-12} PM`}
          </option>
        ))}
      </select>
      <span className="text-purple-500">to</span>
      <select 
        value={timeRange.end} 
        onChange={(e) => updateState({ timeRange: { ...timeRange, end: parseInt(e.target.value) } })}
        className="border border-purple-200 rounded-md p-2 focus:ring-2 focus:ring-purple-300 focus:outline-none"
      >
        {Array.from({ length: 24 }).map((_, i) => (
          <option key={`end-${i}`} value={i+1} disabled={i+1 <= timeRange.start}>
            {i+1 === 24 ? '12 AM' : i+1 < 12 ? `${i+1} AM` : i+1 === 12 ? '12 PM' : `${i+1-12} PM`}
          </option>
        ))}
      </select>
    </div>
  );

  const TaskItem = ({ day, task }) => (
    <div className="flex items-center mb-2 group">
      <div className="relative">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => taskActions.toggle(day, task.id)}
          className="mr-2 h-4 w-4 rounded-full border-2 border-purple-300 text-purple-500 focus:ring-2 focus:ring-offset-0 focus:ring-purple-300 transition-colors"
        />
        {task.completed && (
          <span className="absolute top-0 left-0 w-full h-0.5 bg-pink-400 transform rotate-45 origin-center"></span>
        )}
      </div>
      <input
        type="text"
        value={task.text}
        onChange={(e) => taskActions.update(day, task.id, e.target.value)}
        placeholder="Add task..."
        className={`flex-grow px-2 py-1 rounded-md focus:outline-none focus:bg-purple-50 transition-colors ${task.completed ? 'line-through text-gray-400' : ''}`}
        onClick={(e) => {
          if (task.text.trim() !== '') {
            e.stopPropagation();
            taskActions.convertToEvent(day, task);
          }
        }}
      />
      <button 
        onClick={(e) => {
          e.stopPropagation();
          taskActions.delete(day, task.id);
        }}
        className="opacity-0 group-hover:opacity-100 text-pink-400 hover:text-pink-600 px-1 transition-opacity duration-200"
      >
        ×
      </button>
    </div>
  );

  const EmptyTaskLines = ({ day, count }) => (
    <>
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} className="flex items-center mb-2 h-8 border-b border-dotted border-gray-200">
          <div className="w-4 h-4 mr-2 rounded-full border-2 border-purple-200"></div>
          <div 
            className="flex-grow text-xs text-gray-300 cursor-pointer hover:text-gray-400 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              taskActions.add(day);
            }}
          >
            write something...
          </div>
        </div>
      ))}
    </>
  );

  const DayCard = ({ day }) => {
    const theme = getDayTheme(day);
    const isToday = isSameDay(day, new Date());
    const dayTasks = taskActions.getForDay(day);
    const allDayEvents = eventActions.getAllDay(day);
    
    return (
      <div 
        className={`bg-white/80 backdrop-blur-sm rounded-xl border border-purple-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:scale-105 ${isToday ? 'ring-4 ring-purple-300' : ''}`}
      >
        {/* Day Header */}
        <div 
          className={`${theme.bg} p-4 relative flex flex-col items-center cursor-pointer`}
          onClick={() => updateState({ selectedDay: day, view: 'day' })}
        >
          <span className="text-2xl mb-1">{theme.emoji}</span>
          <span className={`font-bold ${theme.color}`}>
            {format(day, 'EEEE')}
          </span>
          <span className={`text-sm ${theme.color}`}>
            {format(day, 'MMM d')}
          </span>
        </div>

        {/* Event badges */}
        {allDayEvents.length > 0 && (
          <div className="bg-white/80 pt-2 px-2 flex flex-wrap gap-1">
            {allDayEvents.map((event, idx) => (
              <span 
                key={idx} 
                className="inline-block px-2 py-1 text-xs text-white rounded-full"
                style={{ backgroundColor: event.color }}
              >
                {event.title}
              </span>
            ))}
          </div>
        )}

        {/* Task List */}
        <div className="p-3 bg-white/80 backdrop-blur-sm">
          <div className="border-b-2 border-dashed border-purple-100 mb-2">
            <div className="text-xs font-medium text-purple-500 mb-1">TASKS</div>
          </div>
          
          {dayTasks.map((task, idx) => (
            <TaskItem key={idx} day={day} task={task} />
          ))}
          
          <EmptyTaskLines day={day} count={Math.max(0, 5 - dayTasks.length)} />

          {/* Add Task Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              taskActions.add(day);
            }}
            className="mt-2 w-full text-center py-1 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 text-white text-sm font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-sm"
          >
            + Add Task
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="p-8 bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100backdrop-blur-sm rounded-xl border border-purple-100 shadow-sm">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8 relative">
        <div className="flex items-center space-x-4">
          <button 
            className="px-3 py-1.5 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white font-semibold text-sm shadow-sm hover:shadow-md transition-all duration-300" 
            onClick={() => updateState({ selectedDay: new Date(), view: 'day' })}
          >
            Today
          </button>
          <div className="flex space-x-1">
            <button 
              onClick={() => navigate(-1)} 
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white/80 border border-purple-100 shadow-sm hover:bg-purple-50 transition-colors duration-200"
            >
              ←
            </button>
            <button 
              onClick={() => navigate(1)} 
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white/80 border border-purple-100 shadow-sm hover:bg-purple-50 transition-colors duration-200"
            >
              →
            </button>
          </div>
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-500">
            {view === 'day' && selectedDay 
              ? format(selectedDay, 'EEEE, MMMM d, yyyy')
              : `Week of ${format(startDate, 'MMM d')} - ${format(endDate, 'MMM d, yyyy')}`
            }
          </h2>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={clearAllData}
            className="px-3 py-1.5 rounded-full bg-red-500 text-white font-semibold text-sm shadow-sm hover:bg-red-600 transition-all duration-300"
          >
            Reset Data
          </button>
          <div className="bg-white/80 p-1 rounded-full shadow-sm border border-purple-100 flex">
            <button 
              className={`px-4 py-2 rounded-full transition-all duration-300 font-medium ${view === 'day' ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-sm' : 'hover:bg-purple-50'}`}
              onClick={() => updateState({ view: 'day', selectedDay: selectedDay || currentDate })}
            >
              Day
            </button>
            <button 
              className={`px-4 py-2 rounded-full transition-all duration-300 font-medium ${view === 'week' ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-sm' : 'hover:bg-purple-50'}`}
              onClick={() => updateState({ view: 'week' })}
            >
              Week
            </button>
          </div>
        </div>
      </div>

      {/* Time Range Controller for Day View */}
      {view === 'day' && selectedDay && <TimeRangeSelector />}

      {/* Week View */}
      {view === 'week' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {days.map((day, idx) => <DayCard key={idx} day={day} />)}
        </div>
      )}

      {/* Day View */}
      {view === 'day' && selectedDay && (
        <div className="rounded-xl shadow-lg bg-white/80 backdrop-blur-sm border border-purple-100 overflow-hidden">
          {/* Day header */}
          <div className={`${getDayTheme(selectedDay).bg} p-4 flex justify-between items-center`}>
            <div className="flex items-center">
              <span className="text-3xl mr-3">{getDayTheme(selectedDay).emoji}</span>
              <h3 className="text-xl font-bold">
                {format(selectedDay, 'EEEE, MMMM d')}
              </h3>
            </div>
            <div className="flex space-x-2">
              <button 
                onClick={() => updateState({ selectedDay: addDays(selectedDay, -1) })}
                className="w-8 h-8 rounded-full bg-white bg-opacity-30 flex items-center justify-center hover:bg-opacity-50 transition-colors"
              >
                ←
              </button>
              <button 
                onClick={() => updateState({ selectedDay: addDays(selectedDay, 1) })}
                className="w-8 h-8 rounded-full bg-white bg-opacity-30 flex items-center justify-center hover:bg-opacity-50 transition-colors"
              >
                →
              </button>
            </div>
          </div>
          
          {/* All-day events */}
          <div className="border-b p-3 bg-purple-50">
            <div className="text-sm font-bold text-purple-600 mb-2 flex items-center">
              <span className="mr-2">📌</span>
              All-day Events
            </div>
            <div className="flex flex-wrap gap-2">
              {eventActions.getAllDay(selectedDay).map((event, idx) => (
                <div
                  key={idx}
                  className="px-3 py-2 text-white text-sm rounded-lg shadow-sm transition-transform hover:scale-105"
                  style={{ backgroundColor: event.color }}
                >
                  {event.title}
                </div>
              ))}
              {eventActions.getAllDay(selectedDay).length === 0 && (
                <div className="text-sm text-gray-500 italic">No all-day events scheduled</div>
              )}
            </div>
          </div>

          {/* Time slots for the day */}
          <div className="relative" style={{ height: `${(timeRange.end - timeRange.start) * 60}px` }}>
            {/* Time markers */}
            {Array.from({ length: timeRange.end - timeRange.start + 1 }).map((_, idx) => {
              const hour = timeRange.start + idx;
              const isEvenHour = hour % 2 === 0;
              
              return (
                <div 
                  key={idx} 
                  className={`absolute left-0 right-0 border-t ${isEvenHour ? 'border-purple-100' : 'border-gray-100'}`}
                  style={{ top: `${idx * 60}px` }}
                >
                  <div className={`text-xs ${isEvenHour ? 'font-bold text-purple-500' : 'text-gray-500'} pl-2 py-1 w-16`}>
                    {hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour-12} PM`}
                  </div>
                </div>
              );
            })}

            {/* Events */}
            <div className="absolute left-16 right-4 top-0 bottom-0">
              {eventActions.getForDay(selectedDay)
                .filter(event => !(event.end.getHours() < timeRange.start || event.start.getHours() >= timeRange.end))
                .map((event, idx) => (
                  <div
                    key={idx}
                    className="absolute left-0 right-0 px-4 py-2 text-white text-sm rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105 cursor-pointer"
                    style={{ 
                      ...eventActions.getStyle(event),
                      backgroundColor: event.color,
                      zIndex: 10
                    }}
                    onClick={() => updateModalState({
                      editingEvent: {...event},
                      isEditingEvent: true
                    })}
                  >
                    <div className="font-bold">{event.title}</div>
                    <div className="text-xs flex items-center mt-1">
                      <span className="mr-1">⏰</span>
                      {format(event.start, 'h:mm a')} - {format(event.end, 'h:mm a')}
                    </div>
                  </div>
              ))}

              {/* Clickable areas for adding events */}
              {Array.from({ length: (timeRange.end - timeRange.start) * 4 }).map((_, idx) => {
                const hour = timeRange.start + Math.floor(idx / 4);
                const minutes = (idx % 4) * 15;
                return (
                  <div
                    key={idx}
                    className="absolute left-0 right-0 hover:bg-purple-50 hover:border-dashed hover:border-l-4 hover:border-purple-300 transition-colors"
                    style={{ 
                      top: `${(idx * 15)}px`,
                      height: '15px',
                      zIndex: 5
                    }}
                    onClick={() => {
                      const eventDate = new Date(selectedDay);
                      eventDate.setHours(hour, minutes);
                      eventActions.add(eventDate, hour);
                    }}
                  />
                );
              })}
            </div>
            
            {/* Add event floating button */}
            <button 
              className="absolute bottom-4 right-4 w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white flex items-center justify-center shadow-lg hover:shadow-xl transition-all"
              onClick={() => {
                const now = new Date();
                const hour = Math.max(timeRange.start, now.getHours());
                eventActions.add(selectedDay, hour);
              }}
            >
              +
            </button>
          </div>
        </div>
      )}

      {/* Modals */}
      <EventModal
        isOpen={isEditingTask}
        onClose={() => updateModalState({ isEditingTask: false })}
        modalType="convert"
        event={newEvent}
        setEvent={(event) => updateModalState({ newEvent: event })}
        onSave={() => eventActions.saveTaskAsEvent()}
        modalRef={modalRef}
        removeOriginalTask={removeOriginalTask}
        setRemoveOriginalTask={(value) => updateModalState({ removeOriginalTask: value })}
      />
      
      <EventModal
        isOpen={isAddingEvent}
        onClose={() => updateModalState({ isAddingEvent: false })}
        modalType="add"
        event={newEvent}
        setEvent={(event) => updateModalState({ newEvent: event })}
        onSave={() => eventActions.save()}
        modalRef={modalRef}
      />
      
      <EventModal
        isOpen={isEditingEvent}
        onClose={() => updateModalState({ isEditingEvent: false })}
        modalType="edit"
        event={editingEvent}
        setEvent={(event) => updateModalState({ editingEvent: event })}
        onSave={() => eventActions.update()}
        modalRef={modalRef}
      />
    </div>
);
};
export default WeeklyPlanner;