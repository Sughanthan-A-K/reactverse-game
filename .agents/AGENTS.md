# ReactVerse Development Workflow Rules

## 1. Permanent Development Workflow
ReactVerse development strictly follows this 11-step lifecycle for every task:
1. Implementation Contract
2. User Approval
3. Prototype Preview
4. User Prototype Approval
5. Implementation
6. Technical Verification
7. ReactVerse Implementation Report
8. Manual QA
9. Bug Fixes (if required)
10. QA Approved
11. Milestone Closed

No step may be skipped. Never begin coding before the contract and prototype are explicitly approved. Never close a milestone before explicit QA Approval.

## 2. Implementation Contract Format
Before writing any code or prototype, produce an Implementation Contract and wait for explicit approval.

```markdown
# ReactVerse Implementation Contract
## Feature
[Milestone/Feature Name]

## Objective
[Explain in one paragraph what will be built]

## Success Criteria
[List exactly what must be working before implementation is considered technically complete]

## Scope
**Included:**
[Everything that will be implemented]

**Excluded:**
[Everything intentionally postponed]

## Engine Impact
[List every engine modified and why]

## New Files
[List files that will be created]

## Existing Files
[List files expected to change]

## Event Bus Changes
[List every expected event]

## State Changes
[List every Zustand store that will change]

## Risks
[Document possible technical risks and mitigation strategy]

## Performance Considerations
[State how performance will be protected]

## Acceptance Checklist
[Checklist that must be satisfied before implementation is reported as complete]

## Approval Required
Status: Waiting for Approval
No prototype or implementation will begin until you explicitly reply:
**Approved – Begin Prototype**
```

## 3. Prototype Preview Requirements
After the Contract is approved, but BEFORE writing implementation code, you must present a Prototype Preview to answer: What will the player see? What happens first? How does the flow progress?

```markdown
# ReactVerse Prototype Preview

## 1. Screen Flow
[Show every screen in order]

## 2. UI Mockup
[Provide ASCII wireframes, component layout, or simple mockup for each screen]

## 3. Gameplay Flow
[Describe exactly what the player does interaction-wise. No implementation.]

## 4. Story Preview
[Show the dialogue sequence. No implementation.]

## 5. Animation Preview
[Describe animations like camera zoom, crystal glow, boss entrance, etc.]

## 6. Audio Preview
[Describe music, ambient sound, and SFX]

## 7. Engine Usage
[Explain which engine controls each phase]

## 8. Review Questions
[Ask the user questions regarding pacing, difficulty, lengths, etc.]

## Approval Required
Status: Waiting for Prototype Approval
No implementation may begin until you explicitly respond:
**Prototype Approved - Begin Implementation**
```

## 4. Implementation Report Format
After implementing any feature or milestone, NEVER simply say "Done." Instead, ALWAYS provide a structured Implementation Report using EXACTLY the following format.

```markdown
# ReactVerse Implementation Report
## Milestone
[Milestone Title]

## Objective
[Brief explanation of the milestone goal]

## Scope
Included
✓ [Included item]
Not Included
✗ [Excluded item]

## Architecture Decisions
[Explain why important implementation decisions were made]

## Implemented Features
[Group features by system, e.g., Story Engine, Gameplay Engine, Knowledge Engine]
- [System Name]
  - ✓ [Feature 1]

## Engine Changes
[List every engine modified and explain exactly what changed]

## Files Created
- [file/path/1]

## Files Modified
- [file/path/1]

## Folder Structure
[If folders changed, show the updated tree]

## Event Bus
[List New Events, Removed Events, Modified Events]

## State Changes
[Document every new Zustand store and added fields]

## Save Engine
[Document Autosaves, Checkpoints, Save Slots, Replay Points]

## Knowledge Updates
[Explain what gets written into Knowledge Vault, Bug Database, Developer Journal, Interview Confidence]

## Performance Notes
[Document Memoization, Lazy Loading, Re-render Optimizations, Event Optimizations, Animation Optimizations]

## Security / Stability
[Mention Input validation, Error boundaries, Runtime validation, Zod schemas, Fallback handling]

## Breaking Changes
[If this milestone changes public APIs or engine behavior, document them. Otherwise write: No breaking changes.]

## Technical Debt
[Document anything intentionally postponed]

## Future Hooks
[List extension points created for future milestones]

## Verification
✓ TypeScript
✓ npm run build
✓ Runtime Verification
✓ Event Bus Verification
✓ Diagnostics Dashboard
✓ QA Mode Compatibility
[If any item fails, clearly state it and explain why]

## Known Issues
[List unresolved issues or state "No known issues."]

## Manual QA Required
Status: Waiting for Manual QA

The implementation has passed all technical verification.
This milestone is NOT complete until manual QA is performed.
Only after you explicitly respond:
**QA Approved**
may this milestone be marked as completed.

## Engineering Summary
Lines Added: [XXXX]
Files Created: [XX]
Files Modified: [XX]
Engines Updated: [X]
New Events: [X]
Build Status: [PASS/FAIL]
QA Status: Waiting for Manual QA
```
