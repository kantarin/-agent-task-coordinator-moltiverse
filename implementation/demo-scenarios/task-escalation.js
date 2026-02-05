/**
 * Demo Scenario 3: Task Escalation
 *
 * Demonstrates:
 * 1. Agent A publishes a task
 * 2. Agent B accepts the task
 * 3. Agent B fails to complete
 * 4. Task auto-escalates to Agent C
 * 5. Agent C completes successfully
 */

const taskManager = require('../task-manager');
const { Agent, AgentCoordinator } = require('../agent-protocol');

console.log('='.repeat(60));
console.log('DEMO 3: TASK ESCALATION');
console.log('='.repeat(60));
console.log();

// Step 1: Setup - Create coordinator and register agents
console.log('Step 1: Setting up agents...');
const coordinator = new AgentCoordinator();

const agentA = new Agent('agent-A', ['coordination']);
const agentB = new Agent('agent-B', ['research']);
const agentC = new Agent('agent-C', ['research', 'backup']);

coordinator.registerAgent(agentA);
coordinator.registerAgent(agentB);
coordinator.registerAgent(agentC);

console.log('✓ Registered: agent-A, agent-B (primary), agent-C (backup)');
console.log();

// Step 2: Agent A publishes a task
console.log('Step 2: Agent A publishes a task...');
const taskResult = agentA.publishTask({
  title: 'Complex Research Project',
  description: 'Research a complex topic requiring deep analysis',
  requirements: ['research'],
  priority: 'HIGH'
});

if (taskResult.success) {
  console.log(`✓ Task published: ${taskResult.task.id}`);
  console.log(`  Title: ${taskResult.task.title}`);
  console.log(`  Status: ${taskResult.task.status}`);
}
console.log();

// Step 3: Agent B accepts the task
console.log('Step 3: Agent B accepts the task...');
const acceptResultB = agentB.acceptTask(taskResult.task.id, '4 hours');

if (acceptResultB.success) {
  console.log(`✓ Task accepted by agent-B`);
  console.log(`  ETA: ${acceptResultB.task.eta}`);
  console.log(`  Status: ${acceptResultB.task.status}`);
}
console.log();

// Step 4: Agent B starts working
console.log('Step 4: Agent B starts working...');
const startResultB = agentB.startTask(taskResult.task.id);

if (startResultB.success) {
  console.log(`✓ Task started`);
  console.log(`  Status: ${startResultB.task.status}`);
}
console.log();

// Step 5: Agent B encounters problems and fails
console.log('Step 5: Agent B encounters problems...');
console.log('  (Simulating issues...)\n');

const failReason = 'Unable to complete due to lack of required data sources';
const failResult = agentB.failTask(taskResult.task.id, failReason);

if (failResult.success) {
  console.log(`✓ Task failed: ${failResult.task.id}`);
  console.log(`  Failure reason: ${failResult.task.failureReason}`);
  console.log(`  Status: ${failResult.task.status}`);
  console.log(`  Assigned to: ${failResult.task.assignedTo} (null = reopened)`);
}
console.log();

// Step 6: Task is automatically reopened and available for other agents
console.log('Step 6: Task auto-escalates to available agents...');
const availableTasks = agentC.browseTasks();

if (availableTasks.success && availableTasks.tasks.length > 0) {
  console.log(`✓ Task found by agent-C`);
  console.log(`  Task: ${availableTasks.tasks[0].id}`);
  console.log(`  Title: ${availableTasks.tasks[0].title}`);
  console.log(`  Status: ${availableTasks.tasks[0].status}`);
}
console.log();

// Step 7: Agent C accepts the escalated task
console.log('Step 7: Agent C accepts the escalated task...');
const acceptResultC = agentC.acceptTask(taskResult.task.id, '6 hours');

if (acceptResultC.success) {
  console.log(`✓ Task accepted by agent-C`);
  console.log(`  ETA: ${acceptResultC.task.eta}`);
  console.log(`  Status: ${acceptResultC.task.status}`);
}
console.log();

// Step 8: Agent C completes the task
console.log('Step 8: Agent C completes the research...');
console.log('  (Simulating research work...)\n');

const researchResult = {
  summary: 'Research completed successfully using alternative data sources:\n' +
    '1. Analyzed academic papers and research publications\n' +
    '2. Cross-referenced industry reports\n' +
    '3. Consulted expert databases\n' +
    '4. Validated findings with multiple sources',
  findings: [
    'Key insight discovered through specialized databases',
    'Historical patterns revealed new trends',
    'Cross-disciplinary connections found'
  ],
  recommendations: [
    'Expand data sources for future research',
    'Implement backup protocols for complex tasks',
    'Use multi-agent verification for critical tasks'
  ]
};

const completeResult = agentC.completeTask(taskResult.task.id, researchResult);

if (completeResult.success) {
  console.log(`✓ Task completed: ${completeResult.task.id}`);
  console.log(`  Status: ${completeResult.task.status}`);
  console.log(`  Completed at: ${completeResult.task.completedAt}`);
  console.log('\n--- RESULT ---');
  console.log(completeResult.task.result.summary);
}
console.log();

// Step 9: Agent A reviews the complete task history
console.log('Step 9: Agent A reviews task history...');
const finalTask = taskManager.getTask(taskResult.task.id);

if (finalTask.success) {
  console.log(`✓ Task history retrieved`);
  console.log('\n--- TASK HISTORY ---');
  finalTask.task.history.forEach((entry, index) => {
    console.log(`${index + 1}. ${entry.action} - ${entry.message}`);
    console.log(`   Actor: ${entry.actor}`);
    console.log(`   Time: ${entry.timestamp}`);
    console.log();
  });
}

console.log('='.repeat(60));
console.log('ESCALATION SUMMARY');
console.log('='.repeat(60));
console.log('Task flow:');
console.log('1. Created by agent-A');
console.log('2. Accepted by agent-B');
console.log('3. Failed by agent-B → Auto-escalated');
console.log('4. Accepted by agent-C');
console.log('5. Completed by agent-C ✓');
console.log();

// Show final statistics
console.log('='.repeat(60));
console.log('STATISTICS');
console.log('='.repeat(60));
const stats = taskManager.getStats();
console.log(JSON.stringify(stats, null, 2));
console.log();

// Show agent reputations
console.log('='.repeat(60));
console.log('AGENT REPUTATIONS');
console.log('='.repeat(60));
const agents = taskManager.getAllAgents();
if (agents.success) {
  agents.agents.forEach(agent => {
    if (agent.totalTasks > 0) {
      console.log(`${agent.id}:`);
      console.log(`  Reputation: ${agent.reputation}`);
      console.log(`  Total Tasks: ${agent.totalTasks}`);
      console.log(`  Completed: ${agent.completedTasks}`);
      console.log(`  Failed: ${agent.failedTasks}`);
      console.log();
    }
  });
}

console.log('='.repeat(60));
console.log('DEMO 3 COMPLETE ✓');
console.log('='.repeat(60));
