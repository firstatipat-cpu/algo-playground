# Project summary

**Algo Playground** — a static website of interactive algorithm lessons for the university course
**254383 Algorithm Design and Analysis**, covering space–time trade-offs, dynamic programming and
greedy technique (lesson pages cite slide decks week 7–9 with page numbers).

Live: https://bvnixx649.github.io/algo-playground/ · Local: `python .serve.py` → http://127.0.0.1:5178

## What it does
Each lesson takes **one worked example from the slides** and lets the student step through it:
play/pause, scrub, step forward/back, and see the table, graph or tree change. Most lessons let you
**change the input** (paste your own coins, weights, pattern, graph weights) and recompute. Every
lesson ends with **exam-style multiple-choice questions** with instant feedback and a 3-line recap.
A separate **practice page** generates random problems the student solves cell by cell, with hints.

## Audience and constraints
- One student in a browser. No accounts, no server, no database. Progress is kept in `localStorage`
  and is per-browser (optional — the site works fine without it).
- Plain HTML/CSS/JS, no build step, no dependencies. It ships as files on GitHub Pages.
- Content is **Thai** (`<html lang="th">`); code comments are English.

## Content (16 lessons + practice)
- **01 Space–Time Trade-offs** — Counting Sort, Horspool, Boyer-Moore, Hashing, B-tree.
- **02 Dynamic Programming** — coin-row, change-making, coin-collecting, 0/1 knapsack, optimal BST,
  Warshall & Floyd.
- **03 Greedy Technique** — Prim, Kruskal, Dijkstra, Huffman, and 12 greedy lab problems.
- **Practice** — random Horspool shift tables, random knapsack tables, random Dijkstra graphs.
- **Old exam (`#exam`)** — the 69-1-254383-2 paper, 25 questions: 20 multiple choice + 5 written
  (coin-row, Dijkstra, Horspool shift table, Huffman average bits, Floyd). Instant checking, a
  "ดูวิธีทำ" fold with the worked answer for the written ones, and a running score. The keys were
  re-verified with the lesson solvers — two of the original paper's keys were wrong.
- **P / NP / NP-Complete (`#np`)** — the course worksheet (ใบงาน), filled in: definitions with a
  Venn diagram, all 8 exercise sections answered as reference tables (decision-vs-optimization,
  polynomial-vs-exponential, tractable-vs-intractable, true/false, complexity class, certificate &
  verifier, the reduction recipe + 5 reduction constructions, the computed instances, coping
  strategies, discussion answers, and the 14-problem summary table), plus a
  **15-question self-test** with instant feedback and a score. Every computed answer is verified in
  `test.js`.
- **Week 10 review (`#week10`)** — the Week 10 lecture slides (P, NP and NP-Complete, by
  ผศ.พงศกร สุธาพันธ์) summarised for revision: the four classes with both Euler diagrams, polynomial
  time, decision problems, tractability, reductions, NP-Complete/NP-Hard, Cook–Levin, SAT & CNF,
  2-SAT vs 3-SAT, the 3-SAT → CLIQUE worked example, the NP-Complete problem list, HAMPATH ≠ TSP and
  P vs NP. Includes two interactives — **PATH solved by BFS step by step**, and the
  **guess-then-verify model of NP** where you pick a truth assignment for
  `x ∧ (x ∨ y ∨ z̄) ∧ (x̄ ∨ ȳ)` and watch each clause get checked — plus a 12-question self-test.

## How it works
- `index.html` holds all CSS and the `<script>` tags; `app.js` builds the shell, the hash router
  (`#<lesson-id>`, `#practice/<drill-id>`, `#exam`, `#np`, `#week10`) and the shared widgets; each
  `lesson-<id>.js` registers itself with `Lab.register(...)`; `practice.js` registers drills the same
  way; `exam.js`, `np.js` and `week10.js` are plain page modules that reuse `Lab.beat` + `Lab.check`
  (`exam.js` adds a check-as-you-type box, `week10.js` adds a BFS animation and a SAT widget).
- Lessons describe their animation as an array of **frames** and a `render(frame)` that returns the
  caption; `Lab.stepper` is the only player. Shared drawing lives in `app.js` (`Lab.graph`,
  `Lab.tree`, `Lab.cellRows`, `Lab.glyph`).
- The pure solvers of each lesson are exported on `Lab.core` and checked against brute force by
  `node test.js` (9959 checks).
- See [memory.md](memory.md) for the invariants and the decisions behind this shape.

## Status
Audited and fixed in one pass: algorithms verified against brute force, the autoplay timer leak
fixed, dead code removed, duplicated helpers shared, the page moved out of quirks mode, and a test
harness added. Then the old exam paper (`#exam`) and the P/NP worksheet (`#np`) were transcribed with
their answers verified by the solvers. Nothing is known broken. Open items are in [handoff.md](handoff.md).
