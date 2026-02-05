/**
 * Demo Scenario 1: Simple Task Flow
 *
 * Demonstrates:
 * 1. Agent A publishes a task
 * 2. Agent B accepts the task
 * 3. Agent B completes the task
 * 4. Agent A receives the results
 */

const taskManager = require('../task-manager');
const { Agent, AgentCoordinator } = require('../agent-protocol');

console.log('='.repeat(60));
console.log('DEMO 1: SIMPLE TASK FLOW');
console.log('='.repeat(60));
console.log();

// Step 1: Setup - Create coordinator and register agents
console.log('Step 1: Setting up agents...');
const coordinator = new AgentCoordinator();

const agentA = new Agent('agent-A', ['coordination']);
const agentB = new Agent('agent-B', ['research', 'writing']);

coordinator.registerAgent(agentA);
coordinator.registerAgent(agentB);

console.log('✓ Registered: agent-A, agent-B');
console.log();

// Step 2: Agent A publishes a task
console.log('Step 2: Agent A publishes a task...');
const taskResult = agentA.publishTask({
  title: 'Research Latest Crypto Trends',
  description: 'Research the latest cryptocurrency trends and summarize key insights',
  requirements: ['research'],
  priority: 'HIGH'
});

if (taskResult.success) {
  console.log(`✓ Task published: ${taskResult.task.id}`);
  console.log(`  Title: ${taskResult.task.title}`);
  console.log(`  Status: ${taskResult.task.status}`);
}
console.log();

// Step 3: Agent B browses available tasks
console.log('Step 3: Agent B browses available tasks...');
const availableTasks = agentB.browseTasks();

if (availableTasks.success && availableTasks.tasks.length > 0) {
  console.log(`✓ Found ${availableTasks.tasks.length} available task(s)`);
  const task = availableTasks.tasks[0];
  console.log(`  Task: ${task.id} - ${task.title}`);
}
console.log();

// Step 4: Agent B accepts the task
console.log('Step 4: Agent B accepts the task...');
const acceptResult = agentB.acceptTask(taskResult.task.id, '2 hours');

if (acceptResult.success) {
  console.log(`✓ Task accepted: ${acceptResult.task.id}`);
  console.log(`  Assigned to: ${acceptResult.task.assignedTo}`);
  console.log(`  ETA: ${acceptResult.task.eta}`);
  console.log(`  Status: ${acceptResult.task.status}`);
}
console.log();

// Step 5: Agent B starts working on the task
console.log('Step 5: Agent B starts working...');
const startResult = agentB.startTask(taskResult.task.id);

if (startResult.success) {
  console.log(`✓ Task started: ${startResult.task.id}`);
  console.log(`  Status: ${startResult.task.status}`);
  console.log(`  Started at: ${startResult.task.startedAt}`);
}
console.log();

// Simulate work being done
console.log('Step 6: Agent B completes the research...');
console.log('  (Simulating research work...)\n');

// Step 7: Agent B completes the task
const researchResult = {
  summary: 'Key cryptocurrency trends for 2026 include:\n' +
    '1. AI agents driving DeFi innovation\n' +
    '2. USDC stablecoin dominance\n' +
    '3. Layer 2 scaling solutions\n' +
    '4. Agent-to-agent payment protocols',
  insights: [
    'Agent coordination protocols are emerging',
    'Stablecoin payments between agents are becoming mainstream',
    'Prediction markets for AI outcomes are growing'
  ],
  sources: [
    'https://twitter.com/crypto',
    'https://moltbook.com/m/usdc',
    'Industry reports'
  ]
};

const completeResult = agentB.completeTask(taskResult.task.id, researchResult);

if (completeResult.success) {
  console.log(`✓ Task completed: ${completeResult.task.id}`);
  console.log(`  Status: ${completeResult.task.status}`);
  console.log(`  Completed at: ${completeResult.task.completedAt}`);
  console.log('\n--- RESULT ---');
  console.log(completeResult.task.result.summary);
}
console.log();

// Step 8: Agent A checks the completed task
console.log('Step 8: Agent A checks the completed task...');
const finalTask = taskManager.getTask(taskResult.task.id);

if (finalTask.success) {
  console.log(`✓ Task retrieved: ${finalTask.task.id}`);
  console.log(`  Status: ${finalTask.task.status}`);
  console.log(`  Completed by: ${finalTask.task.assignedTo}`);
  console.log('\n--- DELIVERED TO AGENT A ---');
  console.log(finalTask.task.result.summary);
}
console.log();

// Show final statistics
console.log('='.repeat(60));
console.log('STATISTICS');
console.log('='.repeat(60));
const stats = taskManager.getStats();
console.log(JSON.stringify(stats, null, 2));
console.log();

console.log('='.repeat(60));
console.log('DEMO 1 COMPLETE ✓');
console.log('='.repeat(60));
