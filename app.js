const SUPABASE_URL = 'https://ggpjhrfeujjsloelerax.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdncGpocmZldWpqc2xvZWxlcmF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE2Njg2MTgsImV4cCI6MjA5NzI0NDYxOH0.2RfIIvMqLnlywBq1otepXRRFI5U91pAJVKnYS3YI9uE';

const { createClient } = supabase;
const db = createClient(SUPABASE_URL, SUPABASE_KEY);

let todos = [];
let currentPriority = 'mid';
let currentFilter = 'all';

// ── 날짜 ──────────────────────────────────────
document.getElementById('date').textContent =
  new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' });

// ── 버블 생성 ──────────────────────────────────
(function () {
  const wrap = document.getElementById('bubbles');
  for (let i = 0; i < 18; i++) {
    const b = document.createElement('div');
    b.className = 'bubble';
    const size = Math.random() * 40 + 10;
    b.style.cssText = `
      width:${size}px; height:${size}px;
      left:${Math.random() * 100}%;
      --op:${(Math.random() * 0.12 + 0.05).toFixed(2)};
      --dur:${(Math.random() * 8 + 6).toFixed(1)}s;
      --delay:-${(Math.random() * 10).toFixed(1)}s;
    `;
    wrap.appendChild(b);
  }
})();

// ── 우선순위 버튼 ──────────────────────────────
document.getElementById('priority-btns').addEventListener('click', (e) => {
  const btn = e.target.closest('.p-btn');
  if (!btn) return;
  document.querySelectorAll('.p-btn').forEach((b) => b.classList.remove('active'));
  btn.classList.add('active');
  currentPriority = btn.dataset.priority;
});

// ── 필터 탭 ────────────────────────────────────
document.querySelectorAll('.tab').forEach((tab) => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach((t) => t.classList.remove('active'));
    tab.classList.add('active');
    currentFilter = tab.dataset.filter;
    render();
  });
});

// ── 추가 이벤트 ────────────────────────────────
document.getElementById('add-btn').addEventListener('click', addTodo);
document.getElementById('todo-input').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') addTodo();
});

// ── CRUD ───────────────────────────────────────
async function addTodo() {
  const input = document.getElementById('todo-input');
  const text = input.value.trim();
  if (!text) return;

  const { data, error } = await db
    .from('todos')
    .insert({ text, completed: false, priority: currentPriority })
    .select()
    .single();

  if (error) { console.error(error); return; }

  todos.unshift(data);
  render();
  input.value = '';
  input.focus();
}

async function toggleTodo(id) {
  const t = todos.find((t) => t.id === id);
  if (!t) return;

  const { error } = await db.from('todos').update({ completed: !t.completed }).eq('id', id);
  if (error) { console.error(error); return; }

  t.completed = !t.completed;
  render();
}

async function deleteTodo(id) {
  const el = document.querySelector(`[data-id="${id}"]`);
  if (!el) return;

  el.classList.add('removing');
  el.addEventListener('animationend', async () => {
    const { error } = await db.from('todos').delete().eq('id', id);
    if (error) { console.error(error); return; }
    todos = todos.filter((t) => t.id !== id);
    render();
  }, { once: true });
}

// ── 렌더 ───────────────────────────────────────
const PRIORITY_META = {
  high: { label: '🔴 높음', cls: 'high' },
  mid:  { label: '🟡 보통', cls: 'mid'  },
  low:  { label: '🟢 낮음', cls: 'low'  },
};

const PRIORITY_ORDER = { high: 0, mid: 1, low: 2 };

function filtered() {
  const sorted = [...todos].sort((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]);
  if (currentFilter === 'active') return sorted.filter((t) => !t.completed);
  if (currentFilter === 'done')   return sorted.filter((t) =>  t.completed);
  return sorted;
}

function render() {
  const list     = document.getElementById('todo-list');
  const emptyMsg = document.getElementById('empty-msg');
  const counter  = document.getElementById('counter');
  const items    = filtered();

  list.innerHTML = '';
  emptyMsg.style.display = items.length === 0 ? 'block' : 'none';

  items.forEach((todo) => {
    const meta = PRIORITY_META[todo.priority] || PRIORITY_META.mid;
    const li = document.createElement('li');
    li.className = `todo-item priority-${todo.priority}${todo.completed ? ' done' : ''}`;
    li.dataset.id = todo.id;

    li.innerHTML = `
      <label class="checkbox-wrap" aria-label="완료 표시">
        <input type="checkbox" ${todo.completed ? 'checked' : ''} />
        <span class="checkbox-custom">
          <svg viewBox="0 0 14 11"><polyline points="1.5,5.5 5,9 12.5,1.5"></polyline></svg>
        </span>
      </label>
      <span class="todo-text">${escapeHtml(todo.text)}</span>
      <span class="priority-badge ${meta.cls}">${meta.label}</span>
      <button class="delete-btn" aria-label="삭제">✕</button>
    `;

    li.querySelector('input[type="checkbox"]').addEventListener('change', () => toggleTodo(todo.id));
    li.querySelector('.delete-btn').addEventListener('click', () => deleteTodo(todo.id));
    list.appendChild(li);
  });

  const done = todos.filter((t) => t.completed).length;
  counter.textContent = todos.length ? `${done} / ${todos.length} 완료 🐾` : '';
}

function escapeHtml(s) {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
          .replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}

// ── 초기 로드 ──────────────────────────────────
async function init() {
  const { data, error } = await db
    .from('todos')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) { console.error(error); return; }
  todos = data;
  render();
}

init();
