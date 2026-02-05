/**
 * Agent Task Coordinator - Agent Communication Protocol
 *
 * Protocol for agent-to-agent communication in task coordination
 * Defines message formats and routing logic
 */

const taskManager = require('./task-manager');

// Message types
const MESSAGE_TYPES = {
  TASK_PUBLISHED: 'TASK_PUBLISHED',
  TASK_ACCEPTED: 'TASK_ACCEPTED',
  TASK_STARTED: 'TASK_STARTED',
  TASK_COMPLETED: 'TASK_COMPLETED',
  TASK_FAILED: 'TASK_FAILED',
  TASK_ESCALATED: 'TASK_ESCALATED',
  AGENT_AVAILABLE: 'AGENT_AVAILABLE',
  AGENT_BUSY: 'AGENT_BUSY',
  BID_SUBMITTED: 'BID_SUBMITTED',
  BID_ACCEPTED: 'BID_ACCEPTED',
  BID_REJECTED: 'BID_REJECTED'
};

/**
 * Create a message object
 */
function createMessage(type, payload, from, to = 'broadcast') {
  return {
    id: `MSG-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`.toUpperCase(),
    type,
    payload,
    from,
    to,
    timestamp: new Date().toISOString()
  };
}

/**
 * Agent class - represents an autonomous agent
 */
class Agent {
  constructor(agentId, capabilities = []) {
    this.id = agentId;
    this.capabilities = capabilities;
    this.available = true;
    this.currentTasks = [];
    this.messageQueue = [];
  }

  /**
   * Publish a new task
   */
  publishTask(taskData) {
    const result = taskManager.createTask({
      ...taskData,
      createdBy: this.id
    });

    if (result.success) {
      // Broadcast task published message
      const message = createMessage(
        MESSAGE_TYPES.TASK_PUBLISHED,
        { taskId: result.task.id, task: result.task },
        this.id,
        'broadcast'
      );

      console.log(`[${this.id}] Published task: ${result.task.id}`);
      return { success: true, task: result.task, message };
    }

    return result;
  }

  /**
   * Browse available tasks
   */
  browseTasks(filters = {}) {
    const result = taskManager.getTasks({
      ...filters,
      status: taskManager.TASK_STATES.OPEN
    });

    if (result.success) {
      // Filter tasks based on capabilities (optional)
      const relevantTasks = result.tasks.filter(task =>
        this.canHandleTask(task)
      );

      return { success: true, tasks: relevantTasks };
    }

    return result;
  }

  /**
   * Check if agent can handle a task
   */
  canHandleTask(task) {
    // If no capabilities specified, can handle any task
    if (!this.capabilities || this.capabilities.length === 0) {
      return true;
    }

    // Check if task requirements match capabilities
    if (task.requirements && task.requirements.length > 0) {
      const hasRequiredCapability = task.requirements.some(req =>
        this.capabilities.includes(req)
      );
      return hasRequiredCapability;
    }

    return true;
  }

  /**
   * Accept a task
   */
  acceptTask(taskId, eta) {
    const result = taskManager.acceptTask(taskId, this.id, eta);

    if (result.success) {
      this.currentTasks.push(taskId);
      this.available = false;

      console.log(`[${this.id}] Accepted task: ${taskId}${eta ? ` (ETA: ${eta})` : ''}`);
    }

    return result;
  }

  /**
   * Start working on a task
   */
  startTask(taskId) {
    const result = taskManager.startTask(taskId, this.id);

    if (result.success) {
      console.log(`[${this.id}] Started task: ${taskId}`);
    }

    return result;
  }

  /**
   * Complete a task
   */
  completeTask(taskId, result) {
    const taskResult = taskManager.completeTask(taskId, this.id, result);

    if (taskResult.success) {
      // Remove from current tasks
      this.currentTasks = this.currentTasks.filter(t => t !== taskId);

      // Mark as available if no more tasks
      if (this.currentTasks.length === 0) {
        this.available = true;
      }

      console.log(`[${this.id}] Completed task: ${taskId}`);
    }

    return taskResult;
  }

  /**
   * Fail a task (for escalation)
   */
  failTask(taskId, reason) {
    const result = taskManager.failTask(taskId, this.id, reason);

    if (result.success) {
      // Remove from current tasks
      this.currentTasks = this.currentTasks.filter(t => t !== taskId);

      // Mark as available
      this.available = true;

      console.log(`[${this.id}] Failed task: ${taskId} - Reason: ${reason}`);
    }

    return result;
  }

  /**
   * Send message to another agent or broadcast
   */
  sendMessage(message) {
    // In a real implementation, this would send via a message broker
    // For now, we just log it
    console.log(`[MESSAGE] ${message.from} → ${message.to}: ${message.type}`);
    this.messageQueue.push(message);
    return { success: true, message };
  }

  /**
   * Process incoming messages
   */
  processMessages() {
    const messages = [...this.messageQueue];
    this.messageQueue = [];

    messages.forEach(message => {
      this.handleMessage(message);
    });
  }

  /**
   * Handle an incoming message
   */
  handleMessage(message) {
    console.log(`[${this.id}] Received message: ${message.type}`);

    switch (message.type) {
      case MESSAGE_TYPES.TASK_PUBLISHED:
        // Check if we want to accept this task
        this.considerTask(message.payload.task);
        break;

      case MESSAGE_TYPES.TASK_ACCEPTED:
        // Task was accepted by someone else
        break;

      case MESSAGE_TYPES.TASK_COMPLETED:
        // Task was completed
        break;

      case MESSAGE_TYPES.TASK_ESCALATED:
        // Task was escalated, consider accepting
        this.considerTask(message.payload.task);
        break;

      default:
        console.log(`[${this.id}] Unknown message type: ${message.type}`);
    }
  }

  /**
   * Consider accepting a task
   */
  considerTask(task) {
    if (!this.available) {
      return;
    }

    if (!this.canHandleTask(task)) {
      return;
    }

    // In a real implementation, this would use a bidding system
    // For now, we accept the first task we can handle
    console.log(`[${this.id}] Considering task: ${task.id}`);
    // acceptTask would be called here based on some logic
  }

  /**
   * Get agent status
   */
  getStatus() {
    return {
      id: this.id,
      available: this.available,
      capabilities: this.capabilities,
      currentTasks: this.currentTasks.length,
      reputation: taskManager.getAgent(this.id).success ?
        taskManager.getAgent(this.id).agent.reputation : 100
    };
  }
}

/**
 * AgentCoordinator - manages multiple agents
 */
class AgentCoordinator {
  constructor() {
    this.agents = new Map();
  }

  /**
   * Register a new agent
   */
  registerAgent(agent) {
    this.agents.set(agent.id, agent);
    console.log(`[COORDINATOR] Registered agent: ${agent.id}`);
    return { success: true, agent };
  }

  /**
   * Unregister an agent
   */
  unregisterAgent(agentId) {
    if (this.agents.has(agentId)) {
      this.agents.delete(agentId);
      console.log(`[COORDINATOR] Unregistered agent: ${agentId}`);
      return { success: true };
    }
    return { success: false, error: 'Agent not found' };
  }

  /**
   * Get all agents
   */
  getAllAgents() {
    return Array.from(this.agents.values()).map(agent => agent.getStatus());
  }

  /**
   * Get available agents
   */
  getAvailableAgents() {
    return Array.from(this.agents.values())
      .filter(agent => agent.available)
      .map(agent => agent.getStatus());
  }

  /**
   * Broadcast message to all agents
   */
  broadcast(message) {
    this.agents.forEach(agent => {
      if (message.to === 'broadcast' || message.to === agent.id) {
        agent.messageQueue.push(message);
      }
    });

    return { success: true, recipients: this.agents.size };
  }

  /**
   * Run a single coordination cycle
   */
  tick() {
    console.log('[COORDINATOR] Running tick...');

    // Process messages for all agents
    this.agents.forEach(agent => {
      agent.processMessages();
    });

    return { success: true };
  }

  /**
   * Get coordinator statistics
   */
  getStats() {
    const agents = Array.from(this.agents.values());

    return {
      totalAgents: agents.length,
      availableAgents: agents.filter(a => a.available).length,
      busyAgents: agents.filter(a => !a.available).length,
      totalTasksInProgress: agents.reduce((sum, a) => sum + a.currentTasks.length, 0)
    };
  }
}

// Export
module.exports = {
  MESSAGE_TYPES,
  Agent,
  AgentCoordinator
};

// CLI interface for testing
if (require.main === module) {
  const args = process.argv.slice(2);
  const command = args[0];

  // Create coordinator
  const coordinator = new AgentCoordinator();

  // Register some agents
  const agent1 = new Agent('agent-1', ['research', 'writing']);
  const agent2 = new Agent('agent-2', ['analysis', 'trading']);
  const agent3 = new Agent('agent-3', ['design', 'content']);

  coordinator.registerAgent(agent1);
  coordinator.registerAgent(agent2);
  coordinator.registerAgent(agent3);

  switch (command) {
    case 'status':
      console.log('Coordinator Status:');
      console.log(JSON.stringify(coordinator.getStats(), null, 2));
      console.log('\nAgents:');
      console.log(JSON.stringify(coordinator.getAllAgents(), null, 2));
      break;

    case 'publish':
      console.log('Publishing task...');
      const task = agent1.publishTask({
        title: 'Research Project',
        description: 'Research latest crypto trends',
        requirements: ['research'],
        priority: 'HIGH'
      });
      console.log(JSON.stringify(task, null, 2));
      coordinator.broadcast(task.message);
      coordinator.tick();
      break;

    default:
      console.log('Usage: node agent-protocol.js [status|publish]');
  }
}
