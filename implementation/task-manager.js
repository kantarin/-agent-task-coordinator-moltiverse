/**
 * Agent Task Coordinator - Task Manager
 *
 * Core task management system for Agent Task Coordinator project
 * Handles task lifecycle: CREATE → ASSIGNED → IN_PROGRESS → COMPLETED/FAILED
 */

const fs = require('fs');
const path = require('path');

// Task states
const TASK_STATES = {
  OPEN: 'OPEN',
  ASSIGNED: 'ASSIGNED',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
  CANCELLED: 'CANCELLED'
};

// Task data storage path
const DATA_DIR = path.join(__dirname, 'data');
const TASKS_FILE = path.join(DATA_DIR, 'tasks.json');
const AGENTS_FILE = path.join(DATA_DIR, 'agents.json');

// Initialize data directory
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  // Initialize empty data files
  fs.writeFileSync(TASKS_FILE, JSON.stringify([], null, 2));
  fs.writeFileSync(AGENTS_FILE, JSON.stringify({}, null, 2));
}

/**
 * Load data from file
 */
function loadData(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      return null;
    }
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    console.error(`Error loading ${filePath}:`, error.message);
    return null;
  }
}

/**
 * Save data to file
 */
function saveData(filePath, data) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error(`Error saving ${filePath}:`, error.message);
    return false;
  }
}

/**
 * Generate unique task ID
 */
function generateTaskId() {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 7);
  return `TASK-${timestamp}-${random}`.toUpperCase();
}

/**
 * Create a new task
 */
function createTask(taskData) {
  const tasks = loadData(TASKS_FILE) || [];

  const task = {
    id: generateTaskId(),
    title: taskData.title,
    description: taskData.description,
    requirements: taskData.requirements || [],
    priority: taskData.priority || 'MEDIUM',
    createdAt: new Date().toISOString(),
    createdBy: taskData.createdBy || 'unknown',
    status: TASK_STATES.OPEN,
    assignedTo: null,
    acceptedAt: null,
    startedAt: null,
    completedAt: null,
    eta: null,
    result: null,
    failureReason: null,
    history: [
      {
        action: 'CREATED',
        message: 'Task created',
        timestamp: new Date().toISOString(),
        actor: taskData.createdBy
      }
    ]
  };

  tasks.push(task);
  saveData(TASKS_FILE, tasks);

  return { success: true, task };
}

/**
 * Get all tasks (optionally filtered by status)
 */
function getTasks(filters = {}) {
  let tasks = loadData(TASKS_FILE) || [];

  if (filters.status) {
    tasks = tasks.filter(t => t.status === filters.status);
  }

  if (filters.assignedTo) {
    tasks = tasks.filter(t => t.assignedTo === filters.assignedTo);
  }

  if (filters.createdBy) {
    tasks = tasks.filter(t => t.createdBy === filters.createdBy);
  }

  // Sort by createdAt (newest first)
  tasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return { success: true, tasks };
}

/**
 * Get a specific task by ID
 */
function getTask(taskId) {
  const tasks = loadData(TASKS_FILE) || [];
  const task = tasks.find(t => t.id === taskId);

  if (!task) {
    return { success: false, error: 'Task not found' };
  }

  return { success: true, task };
}

/**
 * Accept a task (assign to agent)
 */
function acceptTask(taskId, agentId, eta) {
  const tasks = loadData(TASKS_FILE) || [];
  const taskIndex = tasks.findIndex(t => t.id === taskId);

  if (taskIndex === -1) {
    return { success: false, error: 'Task not found' };
  }

  const task = tasks[taskIndex];

  if (task.status !== TASK_STATES.OPEN) {
    return { success: false, error: `Task is not open (current status: ${task.status})` };
  }

  if (task.assignedTo) {
    return { success: false, error: 'Task is already assigned' };
  }

  // Update task
  tasks[taskIndex] = {
    ...task,
    status: TASK_STATES.ASSIGNED,
    assignedTo: agentId,
    acceptedAt: new Date().toISOString(),
    eta: eta || null,
    history: [
      ...task.history,
      {
        action: 'ASSIGNED',
        message: `Task assigned to ${agentId}${eta ? ` (ETA: ${eta})` : ''}`,
        timestamp: new Date().toISOString(),
        actor: agentId
      }
    ]
  };

  saveData(TASKS_FILE, tasks);

  return { success: true, task: tasks[taskIndex] };
}

/**
 * Start a task
 */
function startTask(taskId, agentId) {
  const tasks = loadData(TASKS_FILE) || [];
  const taskIndex = tasks.findIndex(t => t.id === taskId);

  if (taskIndex === -1) {
    return { success: false, error: 'Task not found' };
  }

  const task = tasks[taskIndex];

  if (task.assignedTo !== agentId) {
    return { success: false, error: 'Task not assigned to this agent' };
  }

  if (task.status !== TASK_STATES.ASSIGNED) {
    return { success: false, error: `Task cannot be started (current status: ${task.status})` };
  }

  // Update task
  tasks[taskIndex] = {
    ...task,
    status: TASK_STATES.IN_PROGRESS,
    startedAt: new Date().toISOString(),
    history: [
      ...task.history,
      {
        action: 'STARTED',
        message: 'Task started',
        timestamp: new Date().toISOString(),
        actor: agentId
      }
    ]
  };

  saveData(TASKS_FILE, tasks);

  return { success: true, task: tasks[taskIndex] };
}

/**
 * Complete a task
 */
function completeTask(taskId, agentId, result) {
  const tasks = loadData(TASKS_FILE) || [];
  const taskIndex = tasks.findIndex(t => t.id === taskId);

  if (taskIndex === -1) {
    return { success: false, error: 'Task not found' };
  }

  const task = tasks[taskIndex];

  if (task.assignedTo !== agentId) {
    return { success: false, error: 'Task not assigned to this agent' };
  }

  if (task.status !== TASK_STATES.IN_PROGRESS) {
    return { success: false, error: `Task cannot be completed (current status: ${task.status})` };
  }

  // Update task
  tasks[taskIndex] = {
    ...task,
    status: TASK_STATES.COMPLETED,
    completedAt: new Date().toISOString(),
    result: result || null,
    history: [
      ...task.history,
      {
        action: 'COMPLETED',
        message: 'Task completed successfully',
        timestamp: new Date().toISOString(),
        actor: agentId
      }
    ]
  };

  saveData(TASKS_FILE, tasks);

  // Update agent reputation
  updateAgentReputation(agentId, 'completed');

  return { success: true, task: tasks[taskIndex] };
}

/**
 * Fail a task (for escalation/reassignment)
 */
function failTask(taskId, agentId, reason) {
  const tasks = loadData(TASKS_FILE) || [];
  const taskIndex = tasks.findIndex(t => t.id === taskId);

  if (taskIndex === -1) {
    return { success: false, error: 'Task not found' };
  }

  const task = tasks[taskIndex];

  if (task.assignedTo !== agentId) {
    return { success: false, error: 'Task not assigned to this agent' };
  }

  // Update task
  tasks[taskIndex] = {
    ...task,
    status: TASK_STATES.OPEN, // Reopen for other agents
    assignedTo: null,
    acceptedAt: null,
    startedAt: null,
    failureReason: reason || 'Task failed',
    history: [
      ...task.history,
      {
        action: 'FAILED',
        message: `Task failed: ${reason}`,
        timestamp: new Date().toISOString(),
        actor: agentId
      },
      {
        action: 'REOPENED',
        message: 'Task reopened for reassignment',
        timestamp: new Date().toISOString(),
        actor: 'system'
      }
    ]
  };

  saveData(TASKS_FILE, tasks);

  // Update agent reputation
  updateAgentReputation(agentId, 'failed');

  return { success: true, task: tasks[taskIndex] };
}

/**
 * Update agent reputation
 */
function updateAgentReputation(agentId, action) {
  const agents = loadData(AGENTS_FILE) || {};

  if (!agents[agentId]) {
    agents[agentId] = {
      id: agentId,
      totalTasks: 0,
      completedTasks: 0,
      failedTasks: 0,
      reputation: 100,
      createdAt: new Date().toISOString()
    };
  }

  agents[agentId].totalTasks += 1;

  if (action === 'completed') {
    agents[agentId].completedTasks += 1;
    agents[agentId].reputation = Math.min(100, agents[agentId].reputation + 5);
  } else if (action === 'failed') {
    agents[agentId].failedTasks += 1;
    agents[agentId].reputation = Math.max(0, agents[agentId].reputation - 10);
  }

  saveData(AGENTS_FILE, agents);
}

/**
 * Get agent information
 */
function getAgent(agentId) {
  const agents = loadData(AGENTS_FILE) || {};
  const agent = agents[agentId];

  if (!agent) {
    return { success: false, error: 'Agent not found' };
  }

  return { success: true, agent };
}

/**
 * Get all agents
 */
function getAllAgents() {
  const agents = loadData(AGENTS_FILE) || {};
  const agentList = Object.values(agents);

  // Sort by reputation (highest first)
  agentList.sort((a, b) => b.reputation - a.reputation);

  return { success: true, agents: agentList };
}

/**
 * Get task statistics
 */
function getStats() {
  const tasks = loadData(TASKS_FILE) || [];
  const agents = loadData(AGENTS_FILE) || {};

  const stats = {
    totalTasks: tasks.length,
    tasksByStatus: {},
    totalAgents: Object.keys(agents).length,
    averageReputation: 0
  };

  // Count tasks by status
  tasks.forEach(task => {
    stats.tasksByStatus[task.status] = (stats.tasksByStatus[task.status] || 0) + 1;
  });

  // Calculate average reputation
  const agentList = Object.values(agents);
  if (agentList.length > 0) {
    const totalReputation = agentList.reduce((sum, agent) => sum + agent.reputation, 0);
    stats.averageReputation = Math.round(totalReputation / agentList.length);
  }

  return { success: true, stats };
}

// Export functions
module.exports = {
  TASK_STATES,
  createTask,
  getTasks,
  getTask,
  acceptTask,
  startTask,
  completeTask,
  failTask,
  getAgent,
  getAllAgents,
  getStats
};

// CLI interface for testing
if (require.main === module) {
  const args = process.argv.slice(2);
  const command = args[0];

  switch (command) {
    case 'create':
      console.log('Creating task...');
      const result = createTask({
        title: 'Sample Task',
        description: 'This is a sample task for testing',
        requirements: ['Requirement 1', 'Requirement 2'],
        priority: 'MEDIUM',
        createdBy: 'test-agent'
      });
      console.log(JSON.stringify(result, null, 2));
      break;

    case 'list':
      console.log('Listing tasks...');
      const tasks = getTasks();
      console.log(JSON.stringify(tasks, null, 2));
      break;

    case 'stats':
      console.log('Getting stats...');
      const stats = getStats();
      console.log(JSON.stringify(stats, null, 2));
      break;

    case 'agents':
      console.log('Listing agents...');
      const agents = getAllAgents();
      console.log(JSON.stringify(agents, null, 2));
      break;

    default:
      console.log('Usage: node task-manager.js [create|list|stats|agents]');
  }
}
