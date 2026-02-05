/**
 * Demo Scenario 2: Multiple Bidders
 *
 * Demonstrates:
 * 1. Agent A publishes a task
 * 2. Multiple agents bid on the task
 * 3. Agent A selects the best bid
 * 4. Selected agent completes the task
 */

const taskManager = require('../task-manager');
const { Agent, AgentCoordinator } = require('../agent-protocol');

console.log('='.repeat(60));
console.log('DEMO 2: MULTIPLE BIDDERS');
console.log('='.repeat(60));
console.log();

// Step 1: Setup - Create coordinator and register multiple agents
console.log('Step 1: Setting up agents...');
const coordinator = new AgentCoordinator();

const agentA = new Agent('agent-A', ['coordination']);
const agentB = new Agent('agent-B', ['analysis', 'trading'], 'fast', 90);
const agentC = new Agent('agent-C', ['analysis', 'research'], 'thorough', 95);
const agentD = new Agent('agent-D', ['analysis'], 'reliable', 88);

coordinator.registerAgent(agentA);
coordinator.registerAgent(agentB);
coordinator.registerAgent(agentC);
coordinator.registerAgent(agentD);

console.log('✓ Registered 4 agents:');
console.log('  - agent-A (task publisher)');
console.log('  - agent-B (specialty: fast, reputation: 90)');
console.log('  - agent-C (specialty: thorough, reputation: 95)');
console.log('  - agent-D (specialty: reliable, reputation: 88)');
console.log();

// Step 2: Agent A publishes a task
console.log('Step 2: Agent A publishes a high-priority task...');
const taskResult = agentA.publishTask({
  title: 'Analyze Market Data',
  description: 'Analyze the latest cryptocurrency market data and provide trading insights',
  requirements: ['analysis'],
  priority: 'HIGH'
});

if (taskResult.success) {
  console.log(`✓ Task published: ${taskResult.task.id}`);
  console.log(`  Title: ${taskResult.task.title}`);
  console.log(`  Priority: ${taskResult.task.priority}`);
  console.log(`  Status: ${taskResult.task.status}`);
}
console.log();

// Step 3: Multiple agents browse and bid on the task
console.log('Step 3: Multiple agents browse the task...');

const bids = [];

// Agent B browses
const browseB = agentB.browseTasks();
if (browseB.success && browseB.tasks.length > 0) {
  console.log(`✓ agent-B found the task`);
  bids.push({
    agent: 'agent-B',
    eta: '1 hour',
    reputation: 90,
    specialty: 'fast',
    taskId: taskResult.task.id
  });
}

// Agent C browses
const browseC = agentC.browseTasks();
if (browseC.success && browseC.tasks.length > 0) {
  console.log(`✓ agent-C found the task`);
  bids.push({
    agent: 'agent-C',
    eta: '3 hours',
    reputation: 95,
    specialty: 'thorough',
    taskId: taskResult.task.id
  });
}

// Agent D browses
const browseD = agentD.browseTasks();
if (browseD.success && browseD.tasks.length > 0) {
  console.log(`✓ agent-D found the task`);
  bids.push({
    agent: 'agent-D',
    eta: '2 hours',
    reputation: 88,
    specialty: 'reliable',
    taskId: taskResult.task.id
  });
}

console.log();
console.log(`Total bids received: ${bids.length}`);
console.log();

// Step 4: Display all bids
console.log('Step 4: All bids received...');
console.log('--- BIDS ---');
bids.forEach((bid, index) => {
  console.log(`${index + 1}. ${bid.agent}:`);
  console.log(`   ETA: ${bid.eta}`);
  console.log(`   Reputation: ${bid.reputation}`);
  console.log(`   Specialty: ${bid.specialty}`);
});
console.log();

// Step 5: Agent A selects the best bid
console.log('Step 5: Agent A evaluates bids...');

// Simple bid selection logic: highest reputation, then lowest ETA
let selectedBid = null;
let selectedScore = -1;

bids.forEach(bid => {
  // Score = reputation * 10 - ETA hours (simplified)
  const etaHours = parseInt(bid.eta);
  const score = bid.reputation * 10 - etaHours;

  console.log(`  ${bid.agent}: Score = ${bid.reputation} * 10 - ${etaHours} = ${score}`);

  if (score > selectedScore) {
    selectedScore = score;
    selectedBid = bid;
  }
});

console.log();
console.log(`✓ Selected bid: ${selectedBid.agent}`);
console.log(`  Reason: Highest score (${selectedScore})`);
console.log();

// Step 6: Selected agent accepts the task
console.log('Step 6: Selected agent accepts the task...');

let acceptAgent;
if (selectedBid.agent === 'agent-B') {
  acceptAgent = agentB;
} else if (selectedBid.agent === 'agent-C') {
  acceptAgent = agentC;
} else if (selectedBid.agent === 'agent-D') {
  acceptAgent = agentD;
}

const acceptResult = acceptAgent.acceptTask(selectedBid.taskId, selectedBid.eta);

if (acceptResult.success) {
  console.log(`✓ Task accepted: ${acceptResult.task.id}`);
  console.log(`  Assigned to: ${acceptResult.task.assignedTo}`);
  console.log(`  ETA: ${acceptResult.task.eta}`);
  console.log(`  Status: ${acceptResult.task.status}`);
}
console.log();

// Step 7: Selected agent completes the task
console.log('Step 7: Selected agent completes the analysis...');
console.log('  (Simulating analysis work...)\n');

const analysisResult = {
  summary: 'Market Analysis - Key Findings:\n' +
    '1. Bitcoin showing strong resistance at $150K\n' +
    '2. Ethereum Layer 2 activity up 45% this week\n' +
    '3. AI-related tokens outperforming general market\n' +
    '4. USDC volume increased by 30% (agent activity)',
  tradingSignals: [
    'BTC: Buy on dip to $140K',
    'ETH: Accumulate around $4K',
    'AI tokens: Strong buy signal'
  ],
  riskFactors: [
    'Regulatory uncertainty in EU',
    'Inflation data expected this week',
    'Potential market correction'
  ],
  confidence: 0.85
};

const completeResult = acceptAgent.completeTask(selectedBid.taskId, analysisResult);

if (completeResult.success) {
  console.log(`✓ Task completed: ${completeResult.task.id}`);
  console.log(`  Status: ${completeResult.task.status}`);
  console.log(`  Completed at: ${completeResult.task.completedAt}`);
  console.log('\n--- RESULT ---');
  console.log(completeResult.task.result.summary);
  console.log(`\nConfidence: ${completeResult.task.result.confidence * 100}%`);
}
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
    }
  });
}
console.log();

console.log('='.repeat(60));
console.log('DEMO 2 COMPLETE ✓');
console.log('='.repeat(60));
