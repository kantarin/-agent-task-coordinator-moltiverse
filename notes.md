# Research Notes - Moltiverse

---

## 📊 Hackathon Overview

**Organized by:** Nadfun & Monad
**Theme:** Agents + High-performance blockchain
**Total Prizes:** $200K
- $10K per winner (up to 16 winners)
- $40K liquidity boost (1 winner)
**Timeline:** Feb 2-15, 2026 (Rolling review)

---

## 🛤️ Two Tracks

### Track 1: 🪙 Agent + Token Track
- Deploy token on nad.fun
- Agent must interact with token
- Token will become part of the ecosystem

### Track 2: 🤖 Agent Track (No Token Required)
- Build an agent that does something interesting
- Monad integration optional but helps improve the overall look
- Focus on demo and documentation

---

## 🎯 What Judges Wanted

**Key criteria:**
1. ✨ **Weird and creative** - Unique and original
2. 🛠️ **Actually works** - Demos are everything
3. 🚀 **Push boundaries** - Agents do things humans can't
4. 🤝 **Bonus:** A2A coordination, trading, community building

---

## 🔧 Technical Resources

### API Endpoints
| Service | URL |
|---------|-----|
| Nad.fun API (mainnet) | https://api.nadapp.net |
| Nad.fun API (testnet) | https://dev-api.nad.fun |
| Monad RPC (mainnet) | https://rpc.monad.xyz |
| Monad RPC (testnet) | https://testnet-rpc.monad.xyz |
| Agent Faucet (testnet) | POST https://agents.devnads.com/v1/faucet |
| Verification API | POST https://agents.devnads.com/v1/verify |

### Contract Addresses (Mainnet)
```
BondingCurveRouter = 0x6F6B8F1a20703309951a5127c45B49b1CD981A22
Curve = 0xA7283d07812a02AFB7C09B60f8896bCEA3F90aCE
Lens = 0x7e78A8DE94f21804F7a17F4E8BF9EC2c872187ea
```

### Token Creation Flow (4 Steps)
1. Upload Image → `POST /agent/token/image` → returns 1. Upload Metadata → `POST /agent/token/metadata` → returns `metadata_uri`
2. Upload Metadata → `POST /agent/salt` → returns `salt` + vanity address (7777)
3. Mine Salt → `POST /agent/salt` → returns `salt` + vanity address (7777)
4. Create On-Chain → Call `BondingCurveRouter.create()` with params

**Deploy fee:** ~10 MON

---

## 🤔 FAQ Insights

- **No crypto experience required:** Agent Track does not require blockchain knowledge.
- **Both tracks can be submitted:** but projects must be substantially different.
- **No team required:** Solo developers are welcome.
- **Existing code can be used:** but documentation is required regarding original/reused code.
- **Rolling judging:** Early excellence receives early rewards + maximum exposure.

---

## 📚 Documentation

| Resource | URL |
|----------|-----|
| Nad.fun Skill | https://nad.fun/skill.md |
| Nad.fun Token Creation | https://nad.fun/create.md |
| Nad.fun Trading | https://nad.fun/trading.md |
| Monad Docs | https://docs.monad.xyz |
| Moltbook Skill | https://moltbook.com/skill.md |

---

## 💡 Interesting Patterns

### From Moltbook m/usdc (Top Projects):
1. **Clawshi** (188 upvotes) — Prediction Market Intelligence + USDC Staking
2. **Minara** (125 upvotes) — AI CFO (Crypto Intelligence API)
3. **Rose Token** (36 upvotes) — Agent Task Marketplace

**Patterns:**
- AI agents with real utility
- Integration with DeFi/Trading
- Community-driven projects

---

## 🎨 Possible Ideas (To explore)

### Agent Track Ideas:
- Agents that coordinate tasks between multiple agents
- Agents that analyze/predict sentiment from multiple sources
- Agents that manage portfolios automatically
- Agents that curate content from the community
- Agents that create content automatically (articles, threads)

### Agent + Token Track Ideas:
- Agents that stake/trade tokens automatically
- Agent marketplace (using tokens as payment)
- Coordination protocol for agents

---

## 📝 Key Takeaways

1. **Agent narrative is HOT** — Now is a great time.
2. **Rolling review** — Submit early, win early.
3. **Demo > Ideas** — Don't just pitch, have a demo.
4. **Creative + Weird = Good** — Don't copy others.

---

*Last updated: 2026-02-06*
