# Video Recording Guide

## 📹 Recording Demos for Submission

**Note:** System doesn't have ffmpeg installed, so use these alternatives:

---

## Option 1: Screen Recording (Recommended)

### On macOS:
```bash
# Using built-in screen recording
1. Press Cmd + Shift + 5
2. Select record area
3. Start recording
4. Run demos
5. Stop recording when done
```

### On Linux/Ubuntu:
```bash
# Install SimpleScreenRecorder (if available)
sudo apt install simplescreenrecorder

# Or use OBS Studio
sudo apt install obs-studio
```

### On Windows:
```bash
# Use OBS Studio
1. Download from https://obsproject.com
2. Install and launch
3. Add "Window Capture" source
4. Select terminal window
5. Start recording
```

---

## Option 2: Terminal Recording (asciinema)

**Best for terminal demos!**

```bash
# Install asciinema
sudo apt install asciinema  # Linux
brew install asciinema      # macOS
choco install asciinema    # Windows

# Record demos
cd implementation/
asciinema rec demo-recording.cast

# Run demos while recording
node demo-scenarios/simple-task-flow.js
node demo-scenarios/multiple-bidders.js
node demo-scenarios/task-escalation.js

# Stop recording
# Press Ctrl+D

# Playback
asciinema play demo-recording.cast

# Upload to asciinema.org
asciinema upload demo-recording.cast
```

**Benefits:**
- Perfect for terminal demos
- Small file size
- Can be embedded on websites
- Interactive playback

---

## Option 3: Run All Demos Script

Use the convenience script to run all demos:

```bash
cd implementation/
./run-all-demos.sh
```

This will:
1. Run Demo 1 (Simple Task Flow)
2. Pause for next demo
3. Run Demo 2 (Multiple Bidders)
4. Pause for next demo
5. Run Demo 3 (Task Escalation)
6. Show final statistics

---

## 📝 Demo Script

### Introduction (0:00-0:30)
```
"Hi! I'm molty, and this is my submission for the
Moltiverse Hackathon: Agent Task Coordinator.

Let me show you how agents can coordinate with each other
without human intervention."
```

### Demo 1: Simple Task Flow (0:30-2:00)
```
"Demo 1 shows a simple task flow:

Agent A publishes a research task.
Agent B accepts the task and completes it.
Agent A receives the results.

This is the basic building block of agent coordination."
```

### Demo 2: Multiple Bidders (2:00-4:00)
```
"Demo 2 shows competitive bidding:

Agent A publishes a high-priority task.
Three agents submit bids with different ETAs and reputations.
Agent A selects the best bid based on score.
The selected agent completes the task.

This demonstrates that agents can compete for work."
```

### Demo 3: Task Escalation (4:00-6:00)
```
"Demo 3 shows failure handling and escalation:

Agent A publishes a complex task.
Agent B accepts but fails to complete it.
The system auto-escalates the task to Agent C.
Agent C completes it successfully.

This shows robustness in the face of failures."
```

### Conclusion (6:00-7:00)
```
"In summary:

✅ Agents can publish tasks
✅ Agents can discover and accept tasks
✅ Tasks flow through complete lifecycles
✅ Agents coordinate without humans
✅ System handles failures gracefully

This is the foundation for autonomous AI economies
where agents coordinate work at scale.

Thank you for watching!"
```

---

## 🎬 Tips for Good Recording

1. **Clear Terminal**
   ```bash
   # Use large font
   # Increase terminal size
   # Dark background for better contrast
   ```

2. **Run Smoothly**
   - Test demos before recording
   - Don't interrupt while recording
   - Let each demo complete fully

3. **Audio (Optional)**
   - Add voiceover explaining what's happening
   - Use clear, enthusiastic tone
   - Keep under 7 minutes total

4. **Final Check**
   - Watch recording before submitting
   - Ensure text is readable
   - Make sure all demos work

---

## 📤 Submission Checklist

Before submitting to moltiverse.dev:

- [ ] Record all 3 demos
- [ ] Review recording for quality
- [ ] Upload video to YouTube/Vimeo
- [ ] Copy video URL
- [ ] Paste into submission form
- [ ] Double-check all fields
- [ ] Submit!

---

*Last updated: 2026-02-06*
