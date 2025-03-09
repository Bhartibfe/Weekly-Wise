import { useState, useRef, useEffect } from 'react';
import { format, addDays, startOfWeek, endOfWeek, eachDayOfInterval, addHours } from 'date-fns';

const WeeklyPlanner = () => {
  // Initialize state with data from localStorage if available
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState(() => {
    const savedEvents = localStorage.getItem('planner-events');
    if (savedEvents) {
      // Parse the events and convert date strings back to Date objects
      const parsedEvents = JSON.parse(savedEvents);
      return parsedEvents.map(event => ({
        ...event,
        start: new Date(event.start),
        end: new Date(event.end)
      }));
    }
    return [
      { 
        id: 1, 
        title: 'Hackathon', 
        start: new Date(2025, 1, 18, 9, 0), 
        end: new Date(2025, 1, 18, 17, 0),
        allDay: true,
        color: '#9333EA'
      },
      { 
        id: 2, 
        title: 'Gantt review + development', 
        start: new Date(2025, 1, 18, 14, 0), 
        end: new Date(2025, 1, 18, 15, 30),
        color: '#A855F7'
      },
      { 
        id: 3, 
        title: 'Breakfast', 
        start: new Date(2025, 1, 18, 9, 0), 
        end: new Date(2025, 1, 18, 9, 30),
        color: '#C084FC'
      }
    ];
  });
  
  const [isEditingEvent, setIsEditingEvent] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('planner-tasks');
    return savedTasks ? JSON.parse(savedTasks) : {};
  });
  
  const [view, setView] = useState(() => {
    const savedView = localStorage.getItem('planner-view');
    return savedView || 'week'; // Default to week view
  });
  
  const [selectedDay, setSelectedDay] = useState(() => {
    const savedDay = localStorage.getItem('planner-selected-day');
    return savedDay ? new Date(savedDay) : null;
  });
  
  const [timeRange, setTimeRange] = useState(() => {
    const savedTimeRange = localStorage.getItem('planner-time-range');
    return savedTimeRange ? JSON.parse(savedTimeRange) : { start: 8, end: 20 };
  });
  
  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const [newEvent, setNewEvent] = useState(null);
  const [isEditingTask, setIsEditingTask] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const modalRef = useRef(null);
  const [removeOriginalTask, setRemoveOriginalTask] = useState(true);

  // Save events to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('planner-events', JSON.stringify(events));
    } catch (error) {
      console.error('Could not save events to localStorage:', error);
    }
  }, [events]);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('planner-tasks', JSON.stringify(tasks));
    } catch (error) {
      console.error('Could not save tasks to localStorage:', error);
    }
  }, [tasks]);

  // Save view preference to localStorage
  useEffect(() => {
    localStorage.setItem('planner-view', view);
  }, [view]);

  // Save selected day to localStorage
  useEffect(() => {
    if (selectedDay) {
      localStorage.setItem('planner-selected-day', selectedDay.toISOString());
    }
  }, [selectedDay]);

  // Save time range to localStorage
  useEffect(() => {
    localStorage.setItem('planner-time-range', JSON.stringify(timeRange));
  }, [timeRange]);

  // Get the days for the current week
  const startDate = startOfWeek(currentDate, { weekStartsOn: 0 });
  const endDate = endOfWeek(currentDate, { weekStartsOn: 0 });
  const days = eachDayOfInterval({ start: startDate, end: endDate });

  // Function to center modal relative to scroll position
  const centerModal = () => {
    if (modalRef.current) {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const viewportHeight = window.innerHeight;
      const modalHeight = modalRef.current.offsetHeight;
      
      // Calculate position to center modal in viewport
      const topPosition = scrollTop + (viewportHeight - modalHeight) / 2;
      
      modalRef.current.style.top = `${topPosition}px`;
    }
  };

  // Effect to center modal when it opens
  useEffect(() => {
    if (isAddingEvent || isEditingTask) {
      centerModal();
      // Add resize event listener to keep modal centered
      window.addEventListener('resize', centerModal);
      window.addEventListener('scroll', centerModal);
      
      return () => {
        window.removeEventListener('resize', centerModal);
        window.removeEventListener('scroll', centerModal);
      };
    }
  }, [isAddingEvent, isEditingTask]);

  // Navigation functions
  const navigatePrevious = () => {
    if (view === 'day' && selectedDay) {
      setSelectedDay(addDays(selectedDay, -1));
    } else {
      const newDate = addDays(currentDate, -7);
      setCurrentDate(newDate);
    }
  };

  const navigateNext = () => {
    if (view === 'day' && selectedDay) {
      setSelectedDay(addDays(selectedDay, 1));
    } else {
      const newDate = addDays(currentDate, 7);
      setCurrentDate(newDate);
    }
  };

  // Switch to day view
  const showDayView = (day) => {
    setSelectedDay(day);
    setView('day');
  };

  // Handle time range updates
  const updateTimeRange = (start, end) => {
    if (start < end && start >= 0 && end <= 24) {
      setTimeRange({ start, end });
    }
  };

  // Add a new task for a specific day
  const addTask = (day) => {
    const dateKey = format(day, 'yyyy-MM-dd');
    const dayTasks = tasks[dateKey] || [];
    
    const updatedTasks = {
      ...tasks,
      [dateKey]: [...dayTasks, { id: Date.now(), text: '', completed: false }]
    };
    
    setTasks(updatedTasks);
  };

  // Update a task
  const updateTask = (day, taskId, text) => {
    const dateKey = format(day, 'yyyy-MM-dd');
    const dayTasks = tasks[dateKey] || [];
    
    const updatedTasks = {
      ...tasks,
      [dateKey]: dayTasks.map(task => 
        task.id === taskId ? { ...task, text } : task
      )
    };
    
    setTasks(updatedTasks);
  };

  // Toggle task completion
  const toggleTaskCompletion = (day, taskId) => {
    const dateKey = format(day, 'yyyy-MM-dd');
    const dayTasks = tasks[dateKey] || [];
    
    const updatedTasks = {
      ...tasks,
      [dateKey]: dayTasks.map(task => 
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    };
    
    setTasks(updatedTasks);
  };

  // Delete a task
  const deleteTask = (day, taskId) => {
    const dateKey = format(day, 'yyyy-MM-dd');
    const dayTasks = tasks[dateKey] || [];
    
    const updatedTasks = {
      ...tasks,
      [dateKey]: dayTasks.filter(task => task.id !== taskId)
    };
    
    setTasks(updatedTasks);
  };

  // Get tasks for a specific day
  const getTasksForDay = (day) => {
    const dateKey = format(day, 'yyyy-MM-dd');
    return tasks[dateKey] || [];
  };

  // Convert task to event
  const convertTaskToEvent = (day, task) => {
    setSelectedTask({ day, task });
    
    // Create default event time at noon or current hour if in working hours
    const now = new Date();
    const hour = (now.getHours() >= timeRange.start && now.getHours() < timeRange.end) 
      ? now.getHours() 
      : 12;
    
    const start = new Date(day);
    start.setHours(hour);
    start.setMinutes(0);
    
    const end = addHours(start, 1);
    
    setNewEvent({
      id: Date.now(),
      title: task.text,
      start,
      end,
      color: '#9333EA', // Default purple color
      fromTask: true,
      taskId: task.id
    });
    
    setIsEditingTask(true);
  };

  // Save task as event and optionally remove the task
  const saveTaskAsEvent = (removeTask = true) => {
    if (newEvent && newEvent.title.trim() !== '') {
      setEvents([...events, newEvent]);
      
      // Optionally remove the original task
      if (removeTask && selectedTask) {
        deleteTask(selectedTask.day, selectedTask.task.id);
      }
    }
    
    setIsEditingTask(false);
    setNewEvent(null);
    setSelectedTask(null);
  };

  // Get background color and emoji for day header based on day name
  // Updated to use purple gradients to match HomePage
  const getDayTheme = (day) => {
    const dayName = format(day, 'EEEE').toLowerCase();
    const themes = {
      monday: { bg: 'bg-gradient-to-br from-purple-300 to-pink-200', emoji: '🌸', color: 'text-purple-800' },
      tuesday: { bg: 'bg-gradient-to-br from-purple-400 to-pink-300', emoji: '✨', color: 'text-purple-900' },
      wednesday: { bg: 'bg-gradient-to-br from-purple-500 to-pink-400', emoji: '🦋', color: 'text-white' },
      thursday: { bg: 'bg-gradient-to-br from-purple-400 to-pink-300', emoji: '🌹', color: 'text-purple-900' },
      friday: { bg: 'bg-gradient-to-br from-purple-300 to-pink-200', emoji: '🎵', color: 'text-purple-800' },
      saturday: { bg: 'bg-gradient-to-br from-purple-200 to-indigo-200', emoji: '🌈', color: 'text-purple-800' },
      sunday: { bg: 'bg-gradient-to-br from-indigo-200 to-purple-200', emoji: '🌞', color: 'text-purple-800' }
    };
    
    return themes[dayName] || { bg: 'bg-gradient-to-br from-purple-300 to-pink-200', emoji: '📆', color: 'text-purple-800' };
  };

  // Add new event - first step
  const startAddEvent = (day, hour) => {
    const start = new Date(day);
    start.setHours(hour);
    start.setMinutes(0);
    
    const end = addHours(start, 1);
    
    setNewEvent({
      id: Date.now(),
      title: '',
      start,
      end,
      color: '#9333EA' // Updated default color to match theme
    });
    
    setIsAddingEvent(true);
  };

  // Complete adding event
  const completeAddEvent = () => {
    if (newEvent && newEvent.title.trim() !== '') {
      setEvents([...events, newEvent]);
    }
    setIsAddingEvent(false);
    setNewEvent(null);
  };

  // Check if two dates represent the same day
  const isSameDay = (date1, date2) => {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  };
  
  // Get events for a specific day
  const getEventsForDay = (day) => {
    return events.filter(event => {
      return isSameDay(new Date(event.start), day) && !event.allDay;
    }).sort((a, b) => new Date(a.start) - new Date(b.start));
  };

  // Get all-day events for a specific day
  const getAllDayEvents = (day) => {
    return events.filter(event => {
      return event.allDay && isSameDay(new Date(event.start), day);
    });
  };

  // Get position and height for day view events
  const getEventStyle = (event) => {
    const startHour = event.start.getHours() + (event.start.getMinutes() / 60);
    const endHour = event.end.getHours() + (event.end.getMinutes() / 60);
    const duration = endHour - startHour;
    
    const top = (startHour - timeRange.start) * 60; // 60px per hour
    const height = duration * 60;
    
    return {
      top: `${top}px`,
      height: `${height}px`,
    };
  };

  // Toggle between day and week views
  const toggleView = (newView) => {
    if (newView === 'day' && !selectedDay) {
      setSelectedDay(currentDate);
    }
    setView(newView);
  };

  // Function to clear all localStorage data
  const clearAllData = () => {
    if (window.confirm('Are you sure you want to clear all planner data? This cannot be undone.')) {
      localStorage.removeItem('planner-events');
      localStorage.removeItem('planner-tasks');
      localStorage.removeItem('planner-view');
      localStorage.removeItem('planner-selected-day');
      localStorage.removeItem('planner-time-range');
      
      // Reset to default state
      setEvents([]);
      setTasks({});
      setView('week');
      setSelectedDay(null);
      setTimeRange({ start: 8, end: 20 });
    }
  };

  return (
    <div className="p-8 bg-white/80 backdrop-blur-sm rounded-xl border border-purple-100 shadow-sm">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8 relative">
        <div className="flex items-center space-x-4">
          <button 
            className="px-3 py-1.5 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white font-semibold text-sm shadow-sm hover:shadow-md transition-all duration-300" 
            onClick={() => {
              setSelectedDay(new Date());
              setView('day');
            }}
          >
            Today
          </button>
          <div className="flex space-x-1">
            <button 
              onClick={navigatePrevious} 
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white/80 border border-purple-100 shadow-sm hover:bg-purple-50 transition-colors duration-200"
            >
              ←
            </button>
            <button 
              onClick={navigateNext} 
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
              onClick={() => toggleView('day')}
            >
              Day
            </button>
            <button 
              className={`px-4 py-2 rounded-full transition-all duration-300 font-medium ${view === 'week' ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-sm' : 'hover:bg-purple-50'}`}
              onClick={() => toggleView('week')}
            >
              Week
            </button>
          </div>
        </div>
      </div>

      {/* Time Range Controller for Day View */}
      {view === 'day' && selectedDay && (
        <div className="mb-6 flex items-center space-x-4 bg-white/80 p-3 rounded-xl shadow-sm border border-purple-100">
          <label className="font-medium text-gray-700">Time Range:</label>
          <select 
            value={timeRange.start} 
            onChange={(e) => updateTimeRange(parseInt(e.target.value), timeRange.end)}
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
            onChange={(e) => updateTimeRange(timeRange.start, parseInt(e.target.value))}
            className="border border-purple-200 rounded-md p-2 focus:ring-2 focus:ring-purple-300 focus:outline-none"
          >
            {Array.from({ length: 24 }).map((_, i) => (
              <option key={`end-${i}`} value={i+1} disabled={i+1 <= timeRange.start}>
                {i+1 === 24 ? '12 AM' : i+1 < 12 ? `${i+1} AM` : i+1 === 12 ? '12 PM' : `${i+1-12} PM`}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Week View - Matching HomePage Style */}
      {view === 'week' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {days.map((day, idx) => {
            const theme = getDayTheme(day);
            const isToday = isSameDay(day, new Date());
            
            return (
              <div 
                key={idx} 
                className={`bg-white/80 backdrop-blur-sm rounded-xl border border-purple-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:scale-105 ${isToday ? 'ring-4 ring-purple-300' : ''}`}
              >
                {/* Day Header */}
                <div 
                  className={`${theme.bg} p-4 relative flex flex-col items-center cursor-pointer`}
                  onClick={() => showDayView(day)}
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
                {getAllDayEvents(day).length > 0 && (
                  <div className="bg-white/80 pt-2 px-2 flex flex-wrap gap-1">
                    {getAllDayEvents(day).map((event, eventIdx) => (
                      <span 
                        key={eventIdx} 
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
                  
                  {getTasksForDay(day).map((task, taskIdx) => (
                    <div key={taskIdx} className="flex items-center mb-2 group">
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={task.completed}
                          onChange={() => toggleTaskCompletion(day, task.id)}
                          className="mr-2 h-4 w-4 rounded-full border-2 border-purple-300 text-purple-500 focus:ring-2 focus:ring-offset-0 focus:ring-purple-300 transition-colors"
                        />
                        {task.completed && (
                          <span className="absolute top-0 left-0 w-full h-0.5 bg-pink-400 transform rotate-45 origin-center"></span>
                        )}
                      </div>
                      <input
                        type="text"
                        value={task.text}
                        onChange={(e) => updateTask(day, task.id, e.target.value)}
                        placeholder="Add task..."
                        className={`flex-grow px-2 py-1 rounded-md focus:outline-none focus:bg-purple-50 transition-colors ${task.completed ? 'line-through text-gray-400' : ''}`}
                        // Add click handler on the input to convert to event
                        onClick={(e) => {
                          if (task.text.trim() !== '') {
                            e.stopPropagation();
                            convertTaskToEvent(day, task);
                          }
                        }}
                      />
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteTask(day, task.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 text-pink-400 hover:text-pink-600 px-1 transition-opacity duration-200"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  
                  {/* Empty lines to fill the list */}
                  {Array.from({ length: Math.max(0, 5 - getTasksForDay(day).length) }).map((_, idx) => (
                    <div key={idx} className="flex items-center mb-2 h-8 border-b border-dotted border-gray-200">
                      <div className="w-4 h-4 mr-2 rounded-full border-2 border-purple-200"></div>
                      <div 
                        className="flex-grow text-xs text-gray-300 cursor-pointer hover:text-gray-400 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          addTask(day);
                        }}
                      >
                        write something...
                      </div>
                    </div>
                  ))}

                  {/* Add Task Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addTask(day);
                    }}
                    className="mt-2 w-full text-center py-1 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 text-white text-sm font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-sm"
                  >
                    + Add Task
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Day View - Enhanced Interface with Timing */}
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
                onClick={() => setSelectedDay(addDays(selectedDay, -1))}
                className="w-8 h-8 rounded-full bg-white bg-opacity-30 flex items-center justify-center hover:bg-opacity-50 transition-colors"
              >
                ←
              </button>
              <button 
                onClick={() => setSelectedDay(addDays(selectedDay, 1))}
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
              {getAllDayEvents(selectedDay).map((event, idx) => (
                <div
                  key={idx}
                  className="px-3 py-2 text-white text-sm rounded-lg shadow-sm transition-transform hover:scale-105"
                  style={{ backgroundColor: event.color }}
                >
                  {event.title}
                </div>
              ))}
              {getAllDayEvents(selectedDay).length === 0 && (
                <div className="text-sm text-gray-500 italic">No all-day events scheduled</div>
              )}
            </div>
          </div>

          {/* Time slots for the day */}
          <div className="relative" style={{ height: `${(timeRange.end - timeRange.start) * 60}px` }}>
            {/* Time markers with decorative elements */}
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

            {/* Events with enhanced styling */}
            <div className="absolute left-16 right-4 top-0 bottom-0">
              {getEventsForDay(selectedDay).map((event, idx) => {
                // Skip events outside the visible time range
                if (event.end.getHours() < timeRange.start || event.start.getHours() >= timeRange.end) {
                  return null;
                }

                const style = getEventStyle(event);
                
                return (
                  <div
                    key={idx}
                    className="absolute left-0 right-0 px-4 py-2 text-white text-sm rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105 cursor-pointer"
                    style={{ 
                      ...style,
                      backgroundColor: event.color,
                      zIndex: 10
                    }}
                    onClick={() => {
                      setEditingEvent({...event});
                      setIsEditingEvent(true);
                    }}
                  >
                    <div className="font-bold">{event.title}</div>
                    <div className="text-xs flex items-center mt-1">
                      <span className="mr-1">⏰</span>
                      {format(event.start, 'h:mm a')} - {format(event.end, 'h:mm a')}
                    </div>
                  </div>
                );
              })}


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
                      startAddEvent(eventDate, hour);
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
                startAddEvent(selectedDay, hour);
              }}
            >
              +
            </button>
          </div>
        </div>
      )}
      {/* Task to Event Conversion Modal */}
{/* Task to Event Conversion Modal */}
{isEditingTask && newEvent && selectedTask && (
  <div 
    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm overflow-hidden" 
    onClick={() => setIsEditingTask(false)}
  >
    <div 
      className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-2xl max-w-md w-full mx-4 transform transition-all border border-purple-100 max-h-screen overflow-auto" 
      ref={modalRef} 
      style={{position: 'absolute'}}
      onClick={(e) => e.stopPropagation()}
    >
      <h3 className="text-xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">
        Convert Task to Event
      </h3>
      <div className="mb-4">
        <label className="block text-gray-700 mb-1 font-medium">Title</label>
        <input 
          type="text" 
          className="w-full border border-purple-200 rounded-lg p-3 focus:ring-2 focus:ring-purple-300 focus:outline-none" 
          value={newEvent.title} 
          onChange={(e) => setNewEvent({...newEvent, title: e.target.value})} 
          placeholder="Enter event title..." 
          autoFocus 
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-gray-700 mb-1 font-medium">Start Time</label>
        <input 
          type="time" 
          className="w-full border border-purple-200 rounded-lg p-3 focus:ring-2 focus:ring-purple-300 focus:outline-none" 
          value={format(newEvent.start, 'HH:mm')} 
          onChange={(e) => { 
            const [hours, minutes] = e.target.value.split(':').map(Number); 
            const newStart = new Date(newEvent.start);
            newStart.setHours(hours);
            newStart.setMinutes(minutes);
            setNewEvent({...newEvent, start: newStart});
          }}
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-gray-700 mb-1 font-medium">End Time</label>
        <input 
          type="time" 
          className="w-full border border-purple-200 rounded-lg p-3 focus:ring-2 focus:ring-purple-300 focus:outline-none" 
          value={format(newEvent.end, 'HH:mm')} 
          onChange={(e) => { 
            const [hours, minutes] = e.target.value.split(':').map(Number); 
            const newEnd = new Date(newEvent.end);
            newEnd.setHours(hours);
            newEnd.setMinutes(minutes);
            setNewEvent({...newEvent, end: newEnd});
          }}
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-gray-700 mb-1 font-medium">Date</label>
        <input 
          type="date" 
          className="w-full border border-purple-200 rounded-lg p-3 focus:ring-2 focus:ring-purple-300 focus:outline-none" 
          value={format(newEvent.start, 'yyyy-MM-dd')} 
          onChange={(e) => {
            const [year, month, day] = e.target.value.split('-').map(Number);
            const newStart = new Date(newEvent.start);
            newStart.setFullYear(year, month - 1, day);
            
            const newEnd = new Date(newEvent.end);
            newEnd.setFullYear(year, month - 1, day);
            
            setNewEvent({
              ...newEvent, 
              start: newStart,
              end: newEnd
            });
          }}
        />
      </div>
      
      <div className="mb-4">
        <label className="flex items-center text-gray-700 font-medium">
          <input 
            type="checkbox" 
            className="mr-2 h-4 w-4 rounded border-2 border-purple-300 text-purple-500 focus:ring-2 focus:ring-offset-0 focus:ring-purple-300"
            checked={removeOriginalTask}
            onChange={() => setRemoveOriginalTask(!removeOriginalTask)}
          />
          Remove original task after conversion
        </label>
      </div>
      
      <div className="flex justify-end space-x-3">
        <button 
          className="px-4 py-2 rounded-lg border border-purple-200 text-purple-600 hover:bg-purple-50 transition-colors" 
          onClick={() => setIsEditingTask(false)}
        >
          Cancel
        </button>
        <button 
          className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:opacity-90 transition-opacity" 
          onClick={() => saveTaskAsEvent(removeOriginalTask)}
        >
          Convert to Event
        </button>
      </div>
    </div>
  </div>
)}
      {/* Event Creation Modal with enhanced styling */}
      {/* Event Creation Modal - Fixed position centered to viewport */}
      {isAddingEvent && newEvent && (
  <div 
    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm" 
    onClick={() => setIsAddingEvent(false)}
  >
    <div 
      className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-2xl w-96 transform transition-all border border-purple-100" 
      ref={modalRef} 
      style={{position: 'absolute'}}
      onClick={(e) => e.stopPropagation()}
    >
      <h3 className="text-xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">
        Add New Event
      </h3>
      
      <div className="mb-4">
        <label className="block text-gray-700 mb-1 font-medium">Title</label>
        <input 
          type="text" 
          className="w-full border border-purple-200 rounded-lg p-3 focus:ring-2 focus:ring-purple-300 focus:outline-none" 
          value={newEvent.title} 
          onChange={(e) => setNewEvent({...newEvent, title: e.target.value})} 
          placeholder="Enter event title..." 
          autoFocus 
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
  <div>
    <label className="block text-gray-700 mb-1 font-medium">Start Time</label>
    <input 
      type="time" 
      className="w-full border border-purple-200 rounded-lg p-3 focus:ring-2 focus:ring-purple-300 focus:outline-none" 
      value={format(newEvent.start, 'HH:mm')} 
      onChange={(e) => { 
        const [hours, minutes] = e.target.value.split(':').map(Number); 
        const newStart = new Date(newEvent.start);
        newStart.setHours(hours);
        newStart.setMinutes(minutes);
        setNewEvent({...newEvent, start: newStart});
      }}
    />
  </div>
  
  <div>
    <label className="block text-gray-700 mb-1 font-medium">End Time</label>
    <input 
      type="time" 
      className="w-full border border-purple-200 rounded-lg p-3 focus:ring-2 focus:ring-purple-300 focus:outline-none" 
      value={format(newEvent.end, 'HH:mm')} 
      onChange={(e) => { 
        const [hours, minutes] = e.target.value.split(':').map(Number); 
        const newEnd = new Date(newEvent.end);
        newEnd.setHours(hours);
        newEnd.setMinutes(minutes);
        setNewEvent({...newEvent, end: newEnd});
      }}
    />
  </div>
</div>
      
      <div className="mb-4">
        <label className="block text-gray-700 mb-1 font-medium">Date</label>
        <input 
          type="date" 
          className="w-full border border-purple-200 rounded-lg p-3 focus:ring-2 focus:ring-purple-300 focus:outline-none" 
          value={format(newEvent.start, 'yyyy-MM-dd')} 
          onChange={(e) => {
            const [year, month, day] = e.target.value.split('-').map(Number);
            const newStart = new Date(newEvent.start);
            newStart.setFullYear(year, month - 1, day);
            
            const newEnd = new Date(newEvent.end);
            newEnd.setFullYear(year, month - 1, day);
            
            setNewEvent({
              ...newEvent, 
              start: newStart,
              end: newEnd
            });
          }}
        />
      </div>
      
      <div className="mb-6">
        <label className="block text-gray-700 mb-1 font-medium">Description</label>
        <textarea 
          className="w-full border border-purple-200 rounded-lg p-3 focus:ring-2 focus:ring-purple-300 focus:outline-none" 
          value={newEvent.description || ''} 
          onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
          placeholder="Add event details..."
          rows="3"
        />
      </div>
      
      <div className="flex justify-end space-x-3">
        <button 
          className="px-4 py-2 rounded-lg border border-purple-200 text-purple-600 hover:bg-purple-50 transition-colors" 
          onClick={() => setIsAddingEvent(false)}
        >
          Cancel
        </button>
        <button 
          className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:opacity-90 transition-opacity" 
          onClick={() => completeAddEvent()}
        >
          Add Event
        </button>
      </div>
    </div>

  </div>
)}
{/* Event Editing Modal */}
{isEditingEvent && editingEvent && (
  <div 
    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm" 
    onClick={() => setIsEditingEvent(false)}
  >
    <div 
      className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-2xl w-96 transform transition-all border border-purple-100" 
      ref={modalRef} 
      style={{position: 'absolute'}}
      onClick={(e) => e.stopPropagation()}
    >
      <h3 className="text-xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">
        Edit Event
      </h3>
      
      <div className="mb-4">
        <label className="block text-gray-700 mb-1 font-medium">Title</label>
        <input 
          type="text" 
          className="w-full border border-purple-200 rounded-lg p-3 focus:ring-2 focus:ring-purple-300 focus:outline-none" 
          value={editingEvent.title} 
          onChange={(e) => setEditingEvent({...editingEvent, title: e.target.value})} 
          placeholder="Enter event title..." 
          autoFocus 
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-gray-700 mb-1 font-medium">Start Time</label>
          <input 
            type="time" 
            className="w-full border border-purple-200 rounded-lg p-3 focus:ring-2 focus:ring-purple-300 focus:outline-none" 
            value={format(editingEvent.start, 'HH:mm')} 
            onChange={(e) => { 
              const [hours, minutes] = e.target.value.split(':').map(Number); 
              const newStart = new Date(editingEvent.start);
              newStart.setHours(hours);
              newStart.setMinutes(minutes);
              setEditingEvent({...editingEvent, start: newStart});
            }}
          />
        </div>
        
        <div>
          <label className="block text-gray-700 mb-1 font-medium">End Time</label>
          <input 
            type="time" 
            className="w-full border border-purple-200 rounded-lg p-3 focus:ring-2 focus:ring-purple-300 focus:outline-none" 
            value={format(editingEvent.end, 'HH:mm')} 
            onChange={(e) => { 
              const [hours, minutes] = e.target.value.split(':').map(Number); 
              const newEnd = new Date(editingEvent.end);
              newEnd.setHours(hours);
              newEnd.setMinutes(minutes);
              setEditingEvent({...editingEvent, end: newEnd});
            }}
          />
        </div>
      </div>
      
      <div className="mb-4">
        <label className="block text-gray-700 mb-1 font-medium">Date</label>
        <input 
          type="date" 
          className="w-full border border-purple-200 rounded-lg p-3 focus:ring-2 focus:ring-purple-300 focus:outline-none" 
          value={format(editingEvent.start, 'yyyy-MM-dd')} 
          onChange={(e) => {
            const [year, month, day] = e.target.value.split('-').map(Number);
            const newStart = new Date(editingEvent.start);
            newStart.setFullYear(year, month - 1, day);
            
            const newEnd = new Date(editingEvent.end);
            newEnd.setFullYear(year, month - 1, day);
            
            setEditingEvent({
              ...editingEvent, 
              start: newStart,
              end: newEnd
            });
          }}
        />
      </div>
      
      <div className="mb-6">
        <label className="block text-gray-700 mb-1 font-medium">Description</label>
        <textarea 
          className="w-full border border-purple-200 rounded-lg p-3 focus:ring-2 focus:ring-purple-300 focus:outline-none" 
          value={editingEvent.description || ''} 
          onChange={(e) => setEditingEvent({...editingEvent, description: e.target.value})}
          placeholder="Add event details..."
          rows="3"
        />
      </div>
      
      <div className="flex justify-end space-x-3">
        <button 
          className="px-4 py-2 rounded-lg border border-purple-200 text-purple-600 hover:bg-purple-50 transition-colors" 
          onClick={() => setIsEditingEvent(false)}
        >
          Cancel
        </button>
        <button 
          className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:opacity-90 transition-opacity" 
          onClick={() => {
            // Update the event in the events list
            setEvents(events.map(e => e.id === editingEvent.id ? editingEvent : e));
            setIsEditingEvent(false);
            setEditingEvent(null);
          }}
        >
          Save Changes
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
  
};

export default WeeklyPlanner;