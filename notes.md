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
- Deploy token บน nad.fun
- Agent ต้อง interact กับ token
- Token จะกลายเป็นส่วนหนึ่งของ ecosystem

### Track 2: 🤖 Agent Track (No Token Required)
- Build agent ที่ทำอะไรสักอย่าง interesting
- Monad integration optional แต่ช่วยดูดี
- เน้น demo และ documentation

---

## 🎯 What Judges Want

**Key criteria:**
1. ✨ **Weird and creative** - แปลกๆ ดีไม่ซ้ำใคร
2. 🛠️ **Actually works** - demos คือทุกอย่าง
3. 🚀 **Push boundaries** - agents ทำอะไรที่ human ทำไม่ได้
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
Curve              = 0xA7283d07812a02AFB7C09B60f8896bCEA3F90aCE
Lens               = 0x7e78A8DE94f21804F7a17F4E8BF9EC2c872187ea
```

### Token Creation Flow (4 Steps)
1. Upload Image → `POST /agent/token/image` → returns `image_uri`
2. Upload Metadata → `POST /agent/token/metadata` → returns `metadata_uri`
3. Mine Salt → `POST /agent/salt` → returns `salt` + vanity address (7777)
4. Create On-Chain → Call `BondingCurveRouter.create()` with params

**Deploy fee:** ~10 MON

---

## 🤔 FAQ Insights

- **ไม่ต้องมี crypto experience:** Agent Track ไม่ต้องมี knowledge เกี่ยวกับ blockchain
- **ส่งทั้ง 2 tracks ได้:** แต่ project ต้อง substantial different
- **ไม่ต้องมี team:** Solo dev welcome
- **ใช้ existing code ได้:** แต่ต้อง document ว่าอะไรเป็น original/reused
- **Rolling judging:** Early excellence gets early rewards + maximum exposure

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
- AI agents ที่มี utility จริง
- Integration กับ DeFi/trading
- Community-driven projects

---

## 🎨 Possible Ideas (To explore)

### Agent Track Ideas:
- Agent ที่ coordinate tasks ระหว่าง agents หลายตัว
- Agent ที่ analyze/predict sentiment จากหลาย sources
- Agent ที่ manage portfolio อัตโนมัติ
- Agent ที่ curate content จาก community
- Agent ที่ create content อัตโนมัติ (บทความ, threads)

### Agent + Token Track Ideas:
- Agent ที่ stake/trade tokens อัตโนมัติ
- Agent marketplace (ใช้ token เป็น payment)
- Coordination protocol สำหรับ agents

---

## 📝 Key Takeaways

1. **Agent narrative is HOT** — ตอนนี้จังหวะดีมาก
2. **Rolling review** — Submit early, win early
3. **Demo > Ideas** — อย่าแค่ pitch, ต้องมี demo
4. **Creative + Weird = Good** — อย่าเลียนแบบคนอื่น

---

*Last updated: 2026-02-06*
