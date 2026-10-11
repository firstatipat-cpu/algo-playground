/* Week 10 review page: P, NP, NP-Complete — summarised from the lecture slides
   (week10_pnp_complete.pptx, ผศ.พงศกร สุธาพันธ์, 254383). The two interactives:
   a BFS on a PATH example, and the guess-then-verify model of NP.
   The numbers/answers it claims are brute-forced in test.js (see Lab.core.week10). */
(function () {
  const K = Lab.k;
  const LESSON = 'week10';

  const tbl = (head, rows, center) => `<div class="scroll"><table class="dt"><tr>${head.map((h) => `<th${center ? ' style="text-align:center"' : ''}>${h}</th>`).join('')}</tr>${rows.map((r) => `<tr>${r.map((c, i) => `<td${i ? ' class="t"' : ''}${center && i ? ' style="text-align:center"' : ''}>${c}</td>`).join('')}</tr>`).join('')}</table></div>`;

  /* ---------- verified facts (test.js brute-forces every one) ---------- */
  // slide 11 + 19: φ = x ∧ (x ∨ y ∨ z̄) ∧ (x̄ ∨ ȳ)
  const SAT_VARS = ['x', 'y', 'z'];
  const SAT_CLAUSES = [[['x', true]], [['x', true], ['y', true], ['z', false]], [['x', false], ['y', false]]];
  // PATH example: two components, so "A to D" is a no-instance
  const PATH_G = { pos: { A: [60, 70], B: [200, 70], E: [340, 70], F: [480, 70], C: [150, 200], D: [330, 200] },
    E: [['A', 'B'], ['B', 'E'], ['E', 'F'], ['C', 'D']] };
  // 3-SAT → CLIQUE reduction worked example (slide 23)
  // φ = (x₁∨¬x₂∨x₃) ∧ (¬x₁∨x₂∨x₃)   → 6 literal nodes, k = 2
  const CLIQUE_LITS = [
    { id: 'x1c1', var: 1, pos: true, clause: 0 }, { id: 'nx2c1', var: 2, pos: false, clause: 0 }, { id: 'x3c1', var: 3, pos: true, clause: 0 },
    { id: 'nx1c2', var: 1, pos: false, clause: 1 }, { id: 'x2c2', var: 2, pos: true, clause: 1 }, { id: 'x3c2', var: 3, pos: true, clause: 1 },
  ];
  const CLIQUE_E = (() => {
    const E = [];
    for (const a of CLIQUE_LITS) for (const b of CLIQUE_LITS) {
      if (b.clause <= a.clause) continue;
      if (a.var === b.var && a.pos !== b.pos) continue;      // a literal and its negation: no edge
      E.push([a.id, b.id]);
    }
    return E;
  })();
  const facts = {
    sat: { vars: SAT_VARS, clauses: SAT_CLAUSES },
    path: { edges: PATH_G.E, from: 'A', toF: 'F', toD: 'D', reachF: true, reachD: false, hops: 3 },
    clique: { lits: CLIQUE_LITS, edges: CLIQUE_E, k: 2 },
  };

  /* ---------- helpers for the two interactives ---------- */
  const litTrue = (lit, val) => val[lit[0]] === lit[1];
  const clauseOk = (cl, val) => cl.some((l) => litTrue(l, val));
  const formulaOk = (val) => SAT_CLAUSES.every((cl) => clauseOk(cl, val));
  const litText = (l) => (l[1] ? l[0] : l[0] + '̄');

  const euler = `<div class="row2">
    <div style="max-width:320px">
      <div class="mini-h">กรณี P ≠ NP (ที่เชื่อกันส่วนใหญ่)</div>
      <svg class="gsvg" viewBox="0 0 300 200" role="img" aria-label="P ≠ NP: NP-Complete = NP ∩ NP-Hard">
        <circle cx="110" cy="100" r="72" style="fill:var(--surface-2);stroke:var(--ink-3);stroke-width:2"/>
        <circle cx="180" cy="100" r="72" style="fill:color-mix(in srgb,var(--acc) 16%,transparent);stroke:var(--ink-3);stroke-width:2"/>
        <path d="M145 37.1 A72 72 0 0 1 145 162.9 A72 72 0 0 1 145 37.1 Z" style="fill:color-mix(in srgb,var(--acc) 34%,transparent);stroke:var(--ink-3);stroke-width:2"/>
        <circle cx="72" cy="120" r="28" style="fill:var(--surface);stroke:var(--ink-3);stroke-width:2"/>
        <text x="72" y="120" style="fill:var(--ink);font-family:var(--f-display);font-size:15px;font-weight:700;text-anchor:middle;dominant-baseline:central">P</text>
        <text x="46" y="30" style="fill:var(--ink);font-family:var(--f-display);font-size:14px;font-weight:600">NP</text>
        <text x="222" y="30" style="fill:var(--acc);font-family:var(--f-display);font-size:14px;font-weight:600">NP-Hard</text>
        <text x="145" y="100" style="fill:var(--ink);font-family:var(--f-display);font-size:10.5px;font-weight:700;text-anchor:middle;dominant-baseline:central">NP-Complete</text>
        <text x="150" y="190" style="fill:var(--ink-3);font-family:var(--f-body);font-size:10.5px;text-anchor:middle">NP-Complete = NP ∩ NP-Hard</text>
      </svg>
    </div>
    <div style="max-width:320px">
      <div class="mini-h">กรณี P = NP (ยังไม่มีใครพิสูจน์)</div>
      <svg class="gsvg" viewBox="0 0 300 200" role="img" aria-label="P = NP: P, NP และ NP-Complete ทับกัน">
        <circle cx="132" cy="100" r="72" style="fill:color-mix(in srgb,var(--acc) 34%,transparent);stroke:var(--ink-3);stroke-width:2"/>
        <circle cx="212" cy="100" r="72" style="fill:color-mix(in srgb,var(--acc) 16%,transparent);stroke:var(--ink-3);stroke-width:2"/>
        <text x="110" y="100" style="fill:var(--ink);font-family:var(--f-display);font-size:13px;font-weight:700;text-anchor:middle;dominant-baseline:central">P = NP</text>
        <text x="110" y="118" style="fill:var(--ink);font-family:var(--f-display);font-size:13px;font-weight:700;text-anchor:middle;dominant-baseline:central">= NP-Complete</text>
        <text x="232" y="30" style="fill:var(--acc);font-family:var(--f-display);font-size:14px;font-weight:600">NP-Hard</text>
        <text x="150" y="190" style="fill:var(--ink-3);font-family:var(--f-body);font-size:10.5px;text-anchor:middle">NP-Hard ยังคงโผล่ออกนอก NP ได้ (เช่น Halting)</text>
      </svg>
    </div>
  </div>`;

  /* the PATH example, animated with BFS from A */
  function pathAnim(slot) {
    const N = Object.keys(PATH_G.pos);
    const frames = [];
    const seen = new Set(['A']), q = ['A'], prev = {}, order = [];
    const snap = (o) => Object.assign({ seen: [...seen], q: [...q], prev: { ...prev } }, o);
    frames.push(snap({ cap: `เริ่มที่ ${K('A')} (เริ่มจากจุดเริ่มต้นของโจทย์) · BFS ใช้ queue: ใส่ A เข้าไปก่อน` }));
    while (q.length) {
      const u = q.shift();
      order.push(u);
      const fresh = [];
      for (const [a, b] of PATH_G.E) for (const [p, c] of [[a, b], [b, a]]) if (p === u && !seen.has(c)) { seen.add(c); prev[c] = u; q.push(c); fresh.push(c); }
      frames.push(snap({ cur: u, fresh, cap: fresh.length ? `ดึง ${K(u)} ออกจาก queue → เจอเพื่อนบ้านใหม่ ${fresh.map((v) => K(v)).join(', ')}` : `ดึง ${K(u)} ออก → ไม่มีเพื่อนบ้านใหม่` }));
    }
    frames.push(snap({ cur: null, done: true, cap: `BFS จบ · ค้นพบ ${order.map((v) => K(v)).join(' → ')}` }));
    const path = [];
    for (let v = 'F'; v; v = prev[v]) { path.unshift(v); if (v === 'A') break; }
    frames.push(snap({ done: true, path, cap: `เส้นทางจาก A ไป F: ${K(path.join(' → '))} (${path.length - 1} ขั้น) · ส่วน ${K('C')} กับ ${K('D')} อยู่คนละองค์ประกอบ ค้นไม่ถึง → <b>ไม่มีเส้นทางจาก A ไป D</b>` }));
    Lab.stepper(Lab.stage(slot), {
      frames, speed: 900,
      render(el, f) {
        const on = (u, v) => f.path && f.path.some((x, i) => (x === u && f.path[i + 1] === v) || (x === v && f.path[i + 1] === u));
        el.innerHTML = Lab.graph(PATH_G, {
          h: 260, maxw: 620,
          nodeCls: (v) => (f.done && f.path && f.path.includes(v) ? 'done' : v === f.cur ? 'cur' : f.seen.includes(v) ? 'front' : ''),
          edgeCls: (u, v) => (on(u, v) ? 'tree' : ''),
          badge: (v) => (f.prev[v] && !f.done ? { t: '←' + f.prev[v] } : null),
        }) + `<div class="pillrow" style="justify-content:center"><span>queue: ${f.q.length ? f.q.join(', ') : 'ว่าง'}</span><span>เจอแล้ว ${f.seen.length}/${N.length} จุด</span></div>`;
        return f.cap;
      },
    });
  }

  /* guess-then-verify: the two stages of an NP algorithm, on the slide's CNF */
  function satGuess(slot) {
    const wrap = document.createElement('div');
    wrap.className = 'stage';
    const clsText = SAT_CLAUSES.map((cl) => '(' + cl.map(litText).join(' ∨ ') + ')').join(' ∧ ');
    wrap.innerHTML = `<div class="pq">φ = ${K(clsText)}</div>
      <div class="mini-h">ขั้นที่ 1 · เดาคำตอบ (nondeterministic)</div>
      <div class="maybe" style="display:flex;gap:18px;flex-wrap:wrap">
        ${SAT_VARS.map((v) => `<div><div class="mini-h">${v}</div><div class="seg" data-v="${v}"><button data-b="T" class="on">T</button><button data-b="F">F</button></div></div>`).join('')}
      </div>
      <div class="pbar"><button class="btn">ขั้นที่ 2 · ตรวจสอบ</button><span class="sp"></span><span class="verdict"></span></div>
      <div class="out"></div>`;
    slot.append(wrap);
    const guess = {};
    wrap.querySelectorAll('.seg').forEach((seg) => seg.addEventListener('click', (e) => {
      const b = e.target.closest('button'); if (!b) return;
      guess[seg.dataset.v] = b.dataset.b === 'T';
      seg.querySelectorAll('button').forEach((x) => x.classList.toggle('on', x === b));
      wrap.querySelector('.out').innerHTML = '';
      wrap.querySelector('.verdict').innerHTML = '';
    }));
    wrap.querySelector('.btn').onclick = () => {
      const out = wrap.querySelector('.out'), vd = wrap.querySelector('.verdict');
      if (SAT_VARS.some((v) => guess[v] === undefined)) { out.innerHTML = '<div class="calc">เดาค่าให้ครบทั้ง 3 ตัวก่อน (นั่นคือขั้นที่ 1)</div>'; return; }
      const rows = SAT_CLAUSES.map((cl, i) => {
        const ok = clauseOk(cl, guess);
        return `<div class="calc">Clause ${i + 1}: ${cl.map(litText).join(' ∨ ')} = ${cl.map((l) => (litTrue(l, guess) ? 'T' : 'F')).join(' ∨ ')} → ${ok ? K('T', 'ok') : K('F', 'bad')}</div>`;
      }).join('');
      const all = formulaOk(guess);
      out.innerHTML = rows + `<div class="calc">φ = ${guess.x ? 'T' : 'F'} ∧ ... → ${all ? K('Satisfiable', 'ok') : K('ไม่ Satisfiable', 'bad')}</div>
        <div class="calc muted" style="color:var(--ink-3)">ตรวจสอบใช้แค่ ${K('O(n·m)')} (แทนค่าแล้วเช็คทีละ clause) แต่การ<b>หาคำตอบ</b>ต้องลองทุกชุด = 2³ = 8 ชุด (O(2ⁿ))</div>`;
      vd.innerHTML = all ? '<b style="color:var(--ok)">มีคำตอบ ✓</b>' : '<b style="color:var(--bad)">ชุดนี้ไม่ใช่คำตอบ</b> — ลองเดาใหม่';
    };
  }

  /* static picture of the 3-SAT → CLIQUE graph, with the x₃–x₃ edge highlighted */
  const cliqueGraph = () => {
    const pos = {};
    CLIQUE_LITS.forEach((l) => { pos[l.id] = [l.clause === 0 ? 110 : 330, 40 + CLIQUE_LITS.indexOf(l) % 3 * 60]; });
    const G = { pos, E: CLIQUE_E };
    const label = { x1c1: 'x₁', nx2c1: '¬x₂', x3c1: 'x₃', nx1c2: '¬x₁', x2c2: 'x₂', x3c2: 'x₃' };
    return Lab.graph(G, {
      w: 440, h: 230, r: 22,
      nodeCls: (v) => (v === 'x3c1' || v === 'x3c2' ? 'done' : ''),
      edgeCls: (u, v) => ((u === 'x3c1' && v === 'x3c2') || (u === 'x3c2' && v === 'x3c1') ? 'tree' : ''),
      badge: (v) => ({ t: label[v] || v }),
      badgeBelow: () => true, noW: true,
    });
  };

  const QUESTIONS = [
    { n: 1, q: 'NP ย่อมาจากอะไร', o: ['Not Polynomial', 'Nondeterministic Polynomial', 'Non-deterministic Problem', 'Numeric Polynomial'], a: 1,
      why: 'NP = Nondeterministic Polynomial ไม่ได้แปลว่า "ไม่ใช่ polynomial"' },
    { n: 2, q: 'ปัญหา PATH (มีเส้นทางจาก a ไป b ไหม) อยู่ในคลาสใด', o: ['P', 'NP-Complete', 'NP-Hard แต่ไม่ใช่ NP-Complete', 'ตัดสินใจไม่ได้'], a: 0,
      why: 'BFS/DFS แก้ได้ใน O(V + E) → อยู่ใน P' },
    { n: 3, q: 'ทำไม PATH จึงไม่ใช้ Dijkstra ในสไลด์', o: ['Dijkstra ช้ากว่า BFS', 'Dijkstra แก้ shortest path ซึ่งเป็น optimization ไม่ใช่ decision ของ PATH', 'Dijkstra ใช้กับกราฟมีทิศทางไม่ได้', 'Dijkstra ไม่ใช่กราฟ'], a: 1,
      why: 'PATH ถามแค่ "ไปถึงไหม" ไม่ได้ถามระยะสั้นสุด จึงใช้ BFS/DFS ก็พอ' },
    { n: 4, q: 'Nondeterministic algorithm มี 2 ขั้นตอน อะไรบ้าง', o: ['Guess แล้ว Verify', 'Sort แล้ว Search', 'Divide แล้ว Conquer', 'Relax แล้ว Extract-min'], a: 0,
      why: 'ขั้นเดาคำตอบ (ไม่จำกัด) แล้วตรวจในเวลา polynomial' },
    { n: 5, q: 'ข้อใดถูกเกี่ยวกับ NP-Hard', o: ['ต้องอยู่ใน NP เสมอ', 'ไม่จำเป็นต้องอยู่ใน NP (เช่น Halting Problem, TSP แบบ optimization)', 'เป็นสับเซตของ P', 'แก้ได้ด้วย BFS'], a: 1,
      why: 'NP-Complete = NP ∩ NP-Hard แต่ NP-Hard อย่างเดียวอาจไม่อยู่ใน NP' },
    { n: 6, q: 'NP-Complete เขียนเป็นสูตรได้ว่าอย่างไร', o: ['NP ∪ NP-Hard', 'NP ∩ NP-Hard', 'P ∩ NP', 'NP − P'], a: 1,
      why: 'ต้องอยู่ใน NP และเป็น NP-Hard พร้อมกัน' },
    { n: 7, q: 'เพิ่ม literal จาก 2-SAT เป็น 3-SAT ความยากเปลี่ยนอย่างไร', o: ['เท่าเดิม', 'จาก P → NP-Complete', 'จาก NP-Complete → P', 'เปลี่ยนจาก decision เป็น optimization'], a: 1,
      why: '2-SAT อยู่ใน P (SCC) แต่ 3-SAT เป็น NP-Complete' },
    { n: 8, q: 'ใครพิสูจน์ว่า SAT เป็น NP-Complete และปีใด', o: ['Karp, 1972', 'Cook, 1971 (Cook–Levin)', 'Levin, 1972', 'Turing, 1936'], a: 1,
      why: 'Cook (1971) — Levin ได้ผลเดียวกันอย่างอิสระในปี 1973 · Karp ต่อด้วย 21 ปัญหาในปี 1972' },
    { n: 9, q: 'พิสูจน์ว่าปัญหาใหม่เป็น NP-Complete ต้องลดรูปจากอะไร', o: ['จาก P มาหาปัญหาใหม่', 'จากปัญหาที่รู้แล้วว่า NP-Complete มาหาปัญหาใหม่', 'จากปัญหาใหม่ไปหา SAT', 'จาก NP-Hard ที่ไม่อยู่ใน NP'], a: 1,
      why: 'Known NPC ≤ₚ New Problem + แสดงว่า New Problem ∈ NP' },
    { n: 10, q: 'TSP แบบ optimization จัดเป็นอะไร', o: ['P', 'NP-Complete', 'NP-Hard (ไม่ใช่ NP-Complete)', 'Tractable'], a: 2,
      why: 'ไม่ใช่ decision problem จึงไม่อยู่ใน NP · แต่ยากอย่างน้อยเท่า NP-Complete' },
    { n: 11, q: 'ตรวจสอบว่า path ที่ให้มาผ่านทุก node ใช้เวลาเท่าไร', o: ['O(1)', 'O(V)', 'O(V!)', 'O(2^V)'], a: 1,
      why: 'เดินตาม path แล้วเช็คทีละ edge · แต่การหา path ต้องลองทุก permutation = O(n!)' },
    { n: 12, q: 'รางวัลสำหรับการพิสูจน์ P vs NP คืออะไร', o: ['Turing Award', 'Millennium Prize Problem ของ Clay ($1,000,000)', 'Fields Medal', 'Nobel Prize'], a: 1,
      why: 'หนึ่งใน 7 Millennium Prize Problems · ยังไม่มีใครพิสูจน์ได้' },
  ];

  const SEC = [
    { kick: 'นิยาม', title: 'ภาพรวม: สี่คลาสในหน้าเดียว', html: `${euler}
      <ul class="clean">
        <li><b>P</b> — decision problem ที่แก้ได้ด้วย deterministic algorithm ในเวลา O(nᵏ) · <i>ปัญหาที่เรามีวิธีแก้เร็ว</i></li>
        <li><b>NP</b> — decision problem ที่ <b>ตรวจสอบ</b> คำตอบ "ใช่" (certificate) ได้ในเวลาพหุนาม · <i>ถ้ามีคนบอกคำตอบ เราตรวจได้เร็ว</i></li>
        <li><b>NP-Complete</b> — อยู่ใน NP และทุกปัญหาใน NP ลดรูปมาหาได้ → "ยากที่สุดใน NP" · <b>แก้ได้ข้อเดียว = แก้ได้ทั้งหมด</b></li>
        <li><b>NP-Hard</b> — ยากอย่างน้อยเท่า NP-Complete แต่<b>ไม่จำเป็นต้องอยู่ใน NP</b> (Halting Problem, TSP แบบ optimization)</li>
      </ul>
      <p>ทุกปัญหาใน P อยู่ใน NP ด้วย (แก้ได้เร็ว → ตรวจได้เร็ว) แต่ <b>P = NP หรือไม่ ยังไม่มีใครพิสูจน์ได้</b></p>` },
    { kick: 'พื้นฐาน', title: 'Polynomial และ Polynomial Time', html: `${tbl(
      ['เวลา', 'เป็น polynomial time?', 'หมายเหตุ'],
      [['O(1), O(log n), O(n), O(n log n), O(n²), O(n³)', '<b style="color:var(--ok)">✓ ใช่</b>', 'รูป O(nᵏ) เมื่อ k เป็นค่าคงที่ · log n ≤ n จึงนับรวม'],
       ['O(2ⁿ), O(n!), O(nⁿ)', '<b style="color:var(--bad)">✗ ไม่ใช่</b>', 'ตัวแปรอยู่ในเลขชี้กำลัง หรือคูณกันเอง n ครั้ง']])}
      <p>Polynomial = นิพจน์ที่สร้างจากตัวแปรและค่าคงที่ด้วย +, −, × และยกกำลังด้วยจำนวนเต็มไม่ติดลบ ·
      ${K('x² − 4x + 7')} เป็นพหุนาม แต่ ${K('2ˣ')}, ${K('1/x')}, ${K('log x')} ไม่ใช่</p>` },
    { kick: 'พื้นฐาน', title: 'Decision Problem', html: `${tbl(
      ['เป็น decision problem ✓', 'ไม่ใช่ (optimization) ✗'],
      [['"มีเส้นทางจาก A ไป B หรือไม่?"', '"เส้นทางที่สั้นที่สุดคืออะไร?"'],
       ['"กราฟ G มี clique ขนาด k หรือไม่?"', '"clique ที่ใหญ่ที่สุดคืออะไร?"'],
       ['"สูตรนี้ satisfiable หรือไม่?"', '"ค่าต่ำสุด/สูงสุดคือเท่าไร?"']])}
      <p>คำตอบมีแค่ <b>Yes / No</b> · ทฤษฎี complexity สร้างบน decision problem เพราะคำตอบสั้นและเทียบกันได้ตรง ๆ
      (optimization แปลงเป็น decision ได้ โดยเพิ่มค่า k เข้าไป)</p>` },
    { kick: 'ดูมันทำงาน', title: 'ตัวอย่างใน P: PATH (BFS)', wide: true, anim: pathAnim },
    { kick: 'นิยาม', title: 'ตัวอย่างใน NP: SAT และการ "เดาแล้วตรวจ"', anim: satGuess, html: `${tbl(
      ['คำศัพท์', 'ความหมาย', 'ตัวอย่างจาก φ ด้านบน'],
      [['Literal', 'ตัวแปร หรือตัวแปรที่ใส่ NOT', 'x, x̄, y, ȳ'],
       ['Clause', 'literal หลายตัวเชื่อมด้วย OR', '(x ∨ y ∨ z̄)'],
       ['CNF', 'clause หลายตัวเชื่อมด้วย AND', 'x ∧ (x ∨ y ∨ z̄) ∧ (x̄ ∨ ȳ)'],
       ['Satisfying Assignment', 'ค่าตัวแปรที่ทำให้สูตรเป็น True', 'x=T, y=F, z=F'],
       ['Certificate / Witness', 'หลักฐานที่เอาไปตรวจได้', 'ชุดค่าตัวแปรที่ satisfying']])}
      <p>การ<b>หา</b>คำตอบต้องลองทุกชุด = ${K('O(2ⁿ)')} แต่การ<b>ตรวจ</b>ชุดที่ได้มาใช้แค่ ${K('O(n·m)')} → SAT อยู่ใน NP</p>` },
    { kick: 'พื้นฐาน', title: 'Tractable vs Intractable', html: `${tbl(
      ['✓ Tractable (poly time)', '✗ Intractable'],
      [['O(n log n) — Merge Sort', 'O(2ⁿ) — Brute-force SAT'],
       ['O(n²) — Bubble Sort', 'O(n!) — TSP brute force'],
       ['O(V + E) — BFS/DFS', 'O(nⁿ)'],
       ['O(n³) — Matrix Multiplication', '']])}
      <p>ทุกปัญหาใน P เป็น tractable · ปัญหาใน NP อาจเป็นได้ทั้งสองอย่าง — คำถามคือ NP ⊆ P หรือไม่</p>` },
    { kick: 'ไอเดีย', title: 'Polynomial Reduction (D₁ ≤ₚ D₂)', html: `<p>มีฟังก์ชัน f ที่</p>
      <ol><li>แปลง Yes-instance ของ D₁ → Yes-instance ของ D₂</li>
          <li>แปลง No-instance ของ D₁ → No-instance ของ D₂</li>
          <li>f ทำงานใน polynomial time</li></ol>
      <div class="rule"><span class="lbl">อ่านว่า</span>f : x ↦ f(x) ในเวลา poly · เอา x ไปถาม D₂ แล้วได้คำตอบเดียวกับที่ D₁ จะตอบ<br>
      ถ้าแก้ D₂ ได้ ก็แก้ D₁ ได้ → <b>D₂ ยากอย่างน้อยเท่า D₁</b></div>
      <p>ใช้พิสูจน์ NP-Completeness: ถ้า Y เป็น NP-Complete และ ${K('Y ≤ₚ X')} และ ${K('X ∈ NP')} แล้ว <b>X เป็น NP-Complete</b></p>` },
    { kick: 'แบบฝึก 8', title: 'คำถาม P vs NP', html: `${tbl(
      ['ถ้า P = NP', 'ถ้า P ≠ NP (ที่เชื่อกัน)'],
      [['ทุกปัญหาที่ตรวจได้เร็ว ก็แก้ได้เร็ว', 'มีปัญหาที่ตรวจได้เร็วแต่แก้ไม่ได้เร็ว'],
       ['ระบบเข้ารหัสปัจจุบัน (RSA/ECC) ไม่ปลอดภัย', 'NP-Complete ไม่มีวิธีแก้เร็ว → ใช้ approximation / heuristic'],
       ['AI, optimization, การพิสูจน์ทฤษฎี เปลี่ยนไปทั้งหมด', 'ยังต้องอยู่กับข้อจำกัดนี้ต่อไป']])}
      <blockquote style="border-left:3px solid var(--acc);padding-left:18px;margin:18px 0;color:var(--ink-2)">
      "If P = NP, then the world would be a profoundly different place than we usually assume it to be." — Scott Aaronson</blockquote>
      <p>เป็นหนึ่งใน 7 <b>Millennium Prize Problems</b> ของ Clay Mathematics Institute รางวัล <b>$1,000,000</b> · ยังไม่มีใครพิสูจน์ได้</p>` },
  ];

  const SEC2 = [
    { kick: 'ตารางสรุป', title: 'Certificate และ Verifier ของปัญหาเด่น ๆ', html: tbl(
      ['ปัญหา', 'Certificate (สิ่งที่เดา)', 'Verifier ตรวจอะไร', 'เวลา'],
      [['CLIQUE (ขนาด k)', 'เซตจุดยอด k จุด', 'ทุกคู่ในเซตมี edge', 'O(k²)'],
       ['SAT / 3-SAT', 'ค่าความจริงของตัวแปรทุกตัว', 'ทุก clause มี literal จริงอย่างน้อย 1 ตัว', 'O(n·m)'],
       ['HAMILTONIAN PATH', 'ลำดับจุดยอดทั้ง n จุด', 'เป็น permutation ของ V และทุก edge ติดกันมีจริง', 'O(V)'],
       ['VERTEX COVER (ขนาด ≤ k)', 'เซตจุดยอด S', '|S| ≤ k และทุก edge มีปลายใน S', 'O(E)'],
       ['SUBSET-SUM (ผลรวม = t)', 'เซตย่อย S′', 'Σ(S′) = t', 'O(n)']]) },
    { kick: 'ตัวอย่าง', title: 'การลดรูป: 3-SAT → CLIQUE', html: `${tbl(
      ['ขั้น', 'ทำอะไร'],
      [['1', 'รับ instance ของ 3-SAT ที่มี k clauses'],
       ['2', 'สร้างจุดยอดให้ literal ทุกตัวในทุก clause (clause ละ 3 จุด)'],
       ['3', `เชื่อม edge เมื่อ: อยู่ต่าง clause <b>และ</b> ไม่ใช่ negation ของกัน`],
       ['4', `k-clique มีอยู่ ⟺ สูตร satisfiable · ดังนั้นตั้ง ${K('k = จำนวน clause')}`]])}
      <div class="mini-h" style="margin-top:14px">φ = (x₁ ∨ ¬x₂ ∨ x₃) ∧ (¬x₁ ∨ x₂ ∨ x₃) · k = 2 (มี 2 clauses)</div>
      <div class="scroll">${cliqueGraph()}</div>
      <p>จุด${K('x₃')} ของทั้งสอง clause เชื่อมกัน (ไม่ขัดกัน) → ได้ 2-clique ซึ่งตรงกับ assignment ${K('x₃ = T')} ·
      คู่ที่ขัดกันเอง เช่น ${K('x₁')} กับ ${K('¬x₁')} จะ<b>ไม่มี</b> edge จึงเลือกพร้อมกันไม่ได้</p>` },
    { kick: 'ตัวอย่าง', title: 'การลดรูปอื่น ๆ และรายการปัญหา NP-Complete', html: `${tbl(
      ['Reduction', 'ไอเดีย'],
      [['CLIQUE ≤ₚ INDEPENDENT SET', 'independent set ขนาด k ใน G ⟺ clique ขนาด k ใน complement Ḡ'],
       ['3-SAT ≤ₚ HAMILTONIAN PATH', 'สร้าง gadget ต่อ literal/clause ให้เส้นทางที่ผ่านทุกจุด = assignment ที่ทำให้สูตรจริง'],
       ['HAMILTONIAN CYCLE ≤ₚ TSP (decision)', 'E′ = complete graph · w(e) = 1 ถ้า e ∈ E ไม่งั้น 2 · k = |V|']])}
      ${tbl(
      ['ปัญหา NP-Complete', 'คำอธิบาย', 'ประเภท'],
      [['SAT / 3-SAT', 'Boolean satisfiability', 'Logic'],
       ['CLIQUE', 'complete subgraph ขนาด k', 'Graph'],
       ['INDEPENDENT SET', 'จุดยอดที่ไม่เชื่อมกัน ขนาด k', 'Graph'],
       ['VERTEX COVER', 'จุดยอดที่ครอบคลุมทุก edge', 'Graph'],
       ['HAMILTONIAN PATH/CYCLE', 'เส้นทางที่ผ่านทุก node', 'Graph'],
       ['GRAPH COLORING (k ≥ 3)', 'ระบายสีด้วยสีน้อยที่สุด', 'Graph'],
       ['SUBSET-SUM / PARTITION', 'แบ่งกลุ่มตัวเลข', 'Number'],
       ['MINESWEEPER (generalized)', 'เกมกู้ระเบิด', 'Game']])}
      <p>ปัญหาเหล่านี้ "เท่ากัน" ในแง่ความยาก — ถ้าแก้ข้อใดข้อหนึ่งได้ใน polynomial time ก็แก้ได้ทั้งหมด (P = NP)</p>` },
    { kick: 'ระวัง', title: 'HAMILTONIAN PATH ≠ TSP', html: `${tbl(
      ['', 'Hamiltonian Path', 'TSP (Traveling Salesman)'],
      [['ประเภท', 'Decision problem', 'Optimization problem'],
       ['คำถาม', '"มี path ที่ผ่านทุก node ครั้งเดียวไหม?"', '"route ที่สั้นที่สุดที่ผ่านทุกเมืองแล้วกลับจุดเริ่มต้น?"'],
       ['คำตอบ', 'Yes / No', 'เส้นทาง + ระยะทาง'],
       ['คลาส', 'NP-Complete', 'NP-Hard (ไม่อยู่ใน NP)']])}
      <p>TSP เป็น generalization ของ Hamiltonian Cycle แต่ไม่ใช่ปัญหาเดียวกัน — TSP แบบ optimization เป็น NP-Hard เพราะไม่ใช่ decision problem จึงไม่อยู่ใน NP</p>` },
    { kick: 'แบบทดสอบสั้น', title: 'Self-test 12 ข้อ (จากสไลด์)', test: true },
  ];

  function render(root) {
    root.innerHTML = Lab.topbar('ทบทวน Week 10 · P · NP · NP-Complete') + `
      <main class="wrap">
        <section class="hero">
          <h1>P, NP และ NP-Complete</h1>
          <p class="lead">สรุปจากสไลด์ Week 10 (P, NP, and NP-Complete) โดย ผศ.พงศกร สุธาพันธ์ — 254383 Algorithm Design and Analysis ·
          อ่านทบทวนพร้อมของลองเล่น 2 อย่าง แล้วปิดท้ายด้วยแบบทดสอบสั้น</p>
          <div class="pbar"><div class="calc" style="margin-top:0">ตอบถูก <b class="score">0</b>/${QUESTIONS.length} ข้อ</div>
            <span class="sp"></span><button class="btn ghost" id="wkReset">เริ่มทำใหม่</button></div>
        </section>
        <div class="body"></div>
        <nav class="next"><a class="btn ghost" href="#">← ทุกบทเรียน</a><a class="btn" href="#np">ไปทำใบงาน (เฉลยละเอียด) →</a></nav>
      </main>`;
    const host = root.querySelector('.body');
    const beats = SEC.concat(SEC2);
    for (const sec of beats) {
      const slot = Lab.beat(host, { kick: sec.kick, title: sec.title, wide: !!sec.wide });
      if (sec.test) {
        QUESTIONS.forEach((Q, i) => { if (i) Lab.gap(slot); Lab.check(slot, { lesson: LESSON, key: 'q' + Q.n, label: `ข้อ ${Q.n}`, q: Q.q, options: Q.o, answer: Q.a, why: Q.why }); });
      } else if (sec.anim) {
        if (sec.html) slot.innerHTML = sec.html;
        sec.anim(slot);
      } else {
        slot.innerHTML = sec.html;
      }
    }
    Lab.recap(host, [
      'P = แก้ได้เร็ว · NP = ตรวจคำตอบได้เร็ว · NP-Complete = ยากสุดใน NP (แก้ข้อเดียว = แก้ได้หมด)',
      'พิสูจน์ NP-Complete: แสดงว่าอยู่ใน NP → เลือก NPC ที่รู้จัก → ลดรูปมาหาปัญหาใหม่ (ต้อง poly time)',
      'เจอ NPC ในงานจริง → approximation / heuristic · P = NP ยังเป็นคำถามเปิดรางวัลล้านดอลลาร์',
    ]);
    const refs = Lab.beat(host, { kick: 'อ้างอิง', title: 'แหล่งที่มาและอ่านเพิ่ม' });
    refs.innerHTML = `<ul class="clean">
      <li>สไลด์: <b>P, NP, and NP-Complete — Week 10</b> (week10_pnp_complete) โดย ผศ.พงศกร สุธาพันธ์ ภาควิชาวิทยาการคอมพิวเตอร์และเทคโนโลยีสารสนเทศ</li>
      <li>ตำรา: <i>Introduction to the Design &amp; Analysis of Algorithms</i>, 3rd Ed. — Anany Levitin</li>
      <li>อ่านเล่น: "March Madness is (NP-)Hard" · "Some Minesweeper Configurations" · "Pancakes, Puzzles, and Polynomials" · "Knuth's Complexity of Songs"</li>
    </ul>
    <p style="color:var(--ink-3);font-size:14.5px">หน้านี้เป็นสรุปเพื่อการทบทวน · ตารางเฉลยใบงานและแบบฝึกเต็มอยู่ที่ <a href="#np">#np</a> · ทุกตัวเลขที่คำนวณได้ถูกตรวจด้วยโปรแกรมใน ${K('test.js')}</p>`;
    Lab.scoreboard({ host, score: root.querySelector('.score'), lesson: LESSON, keys: QUESTIONS.map((Q) => 'q' + Q.n) });
    root.querySelector('#wkReset').onclick = () => { Lab.store.set('done:' + LESSON, []); render(root); };
  }

  Lab.week10Page = { render, questions: QUESTIONS };
  Lab.core = Lab.core || {}; Lab.core.week10 = { facts, questions: QUESTIONS };
})();
