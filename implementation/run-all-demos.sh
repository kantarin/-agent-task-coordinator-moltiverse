#!/bin/bash

echo "============================================================"
echo "AGENT TASK COORDINATOR - ALL DEMOS"
echo "============================================================"
echo ""

cd "$(dirname "$0")"

echo "============================================================"
echo "DEMO 1: SIMPLE TASK FLOW"
echo "============================================================"
node demo-scenarios/simple-task-flow.js
echo ""
read -p "Press Enter to continue..."

echo ""
echo "============================================================"
echo "DEMO 2: MULTIPLE BIDDERS"
echo "============================================================"
node demo-scenarios/multiple-bidders.js
echo ""
read -p "Press Enter to continue..."

echo ""
echo "============================================================"
echo "DEMO 3: TASK ESCALATION"
echo "============================================================"
node demo-scenarios/task-escalation.js
echo ""

echo "============================================================"
echo "FINAL STATISTICS"
echo "============================================================"
node task-manager.js stats
echo ""

echo "============================================================"
echo "ALL DEMOS COMPLETE ✓"
echo "============================================================"
