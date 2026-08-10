(function () {
  'use strict';

  const PKG = '@andreasnicolaou/typescript-expression-language';

  // Every example below is verified to behave as described.
  const EXAMPLES = [
    { g: 'Basics', e: 'x + y', c: { x: 10, y: 5 } },
    { g: 'Basics', e: '(x + y) * 2', c: { x: 5, y: 3 } },
    { g: 'Basics', e: '1 * 2 + 3 * 4', c: {} },
    { g: 'Basics', e: '2 ** 10', c: {} },
    { g: 'Basics', e: '1_000_000 / 4', c: {} },

    {
      g: 'Strings',
      e: '"Hello " ~ user.name ~ "! You are " ~ user.age ~ "."',
      c: { user: { name: 'Alice', age: 28 } },
    },
    { g: 'Strings', e: "'foobar' starts with 'foo'", c: {} },
    { g: 'Strings', e: "'foobar' contains 'oba'", c: {} },
    { g: 'Strings', e: String.raw`date matches '/^\d{4}-\d{2}$/'`, c: { date: '2026-08' } },

    { g: 'Collections', e: 'items[0] + items[2] + items[4]', c: { items: [10, 20, 30, 40, 50] } },
    {
      g: 'Collections',
      e: 'user.city == "New York" ? "East Coast" : "Other"',
      c: { user: { city: 'New York' } },
    },
    {
      g: 'Collections',
      e: 'account.details.plan === "premium" and account.active',
      c: { account: { details: { plan: 'premium' }, active: true } },
    },
    { g: 'Collections', e: 'user.roles contains "admin"', c: { user: { roles: ['editor', 'admin'] } } },
    { g: 'Collections', e: 'tasks.length > 0', c: { tasks: [{ id: 1 }, { id: 2 }] } },
    { g: 'Collections', e: '1..5', c: {} },
    { g: 'Collections', e: '3 in [1, 2, 3]', c: {} },
    { g: 'Collections', e: '{"a": 1, "b": 2}', c: {} },

    { g: 'Null safety', e: 'user.middle ?? "n/a"', c: { user: { middle: null } } },
    { g: 'Null safety', e: 'user?.profile?.city', c: { user: { profile: null } } },
    { g: 'Null safety', e: 'nickname ?: "anon"', c: { nickname: '' } },
    { g: 'Null safety', e: 'isset(user.email)', c: { user: { email: 'a@b.c' } } },

    { g: 'Functions', e: 'max(min(9, 4), 2)', c: {} },
    { g: 'Functions', e: "constant('Math.PI')", c: {} },
    { g: 'Functions', e: 'square(5) < square(cart.tax)', c: { cart: { tax: 10 } } },

    { g: 'Providers', e: 'strtoupper(substr(name, 0, 3))', c: { name: 'andreas' }, p: true },
    { g: 'Providers', e: 'implode(", ", array_unique([1, 1, 2, 3]))', c: {}, p: true },
    { g: 'Providers', e: 'round(pow(2, 0.5), 4)', c: {}, p: true },
    { g: 'Providers', e: 'gmdate("Y", 0)', c: {}, p: true },
    { g: 'Providers', e: 'count(items)', c: { items: [1, 2, 3] }, p: true },
    { g: 'Providers', e: 'ucwords(trim(title))', c: { title: '  hello world  ' }, p: true },

    { g: 'Errors', e: '1 / 0', c: {} },
    { g: 'Errors', e: '10 % 0', c: {} },
    { g: 'Errors', e: 'a + b + ', c: {} },
    { g: 'Errors', e: 'unknownFunc()', c: {} },
  ];

  const $ = (id) => document.getElementById(id);
  const exprInput = $('expression-input');
  const valuesInput = $('values-input');
  const resultOut = $('result-output');
  const resultType = $('result-type');
  const compiledOut = $('compiled-output');
  const providersCheck = $('providers-check');

  const core = window.typescriptExpressionLanguage;
  const providers = window.typescriptExpressionLanguageProviders;
  const coreReady = !!(core && typeof core.ExpressionLanguage === 'function');
  const providersReady = !!(providers && typeof providers.StringProvider === 'function');

  /* ---------- status ---------- */

  const parts = [coreReady ? 'core loaded' : 'core failed', providersReady ? 'providers loaded' : 'providers n/a'];

  function renderStatus(version) {
    $('status').textContent = parts.concat(version || []).join('  ·  ');
  }

  renderStatus();

  fetch('https://unpkg.com/' + PKG + '/package.json')
    .then((r) => (r.ok ? r.json() : Promise.reject(new Error('unpkg'))))
    .then((p) => renderStatus('v' + p.version))
    .catch(() => renderStatus());

  if (!providersReady) {
    providersCheck.closest('.pg-check').classList.add('disabled');
    providersCheck.disabled = true;
    $('providers-hint').textContent =
      'Not available on the version unpkg is currently serving, so those examples are hidden.';
  }

  /* ---------- example picker ---------- */

  const select = $('example-select');
  const usable = EXAMPLES.filter((x) => !x.p || providersReady);
  let currentGroup = null;
  let optgroup = null;

  usable.forEach((ex, i) => {
    if (ex.g !== currentGroup) {
      currentGroup = ex.g;
      optgroup = document.createElement('optgroup');
      optgroup.label = ex.g;
      select.appendChild(optgroup);
    }
    const opt = document.createElement('option');
    opt.value = String(i);
    opt.textContent = ex.e.length > 52 ? ex.e.slice(0, 51) + '…' : ex.e;
    optgroup.appendChild(opt);
  });

  function loadExample(i) {
    const ex = usable[i];
    if (!ex) return;
    exprInput.value = ex.e;
    valuesInput.value = JSON.stringify(ex.c, null, 2);
    if (ex.p && !providersCheck.disabled) providersCheck.checked = true;
    run();
  }

  select.addEventListener('change', () => loadExample(Number(select.value)));

  /* ---------- evaluation ---------- */

  function buildEngine() {
    const list = [];
    if (providersReady && providersCheck.checked) {
      list.push(
        new providers.MathProvider(),
        new providers.StringProvider(),
        new providers.ArrayProvider(),
        new providers.DateProvider()
      );
    }
    const el = new core.ExpressionLanguage(undefined, list);
    el.addFunction(core.ExpressionFunction.fromJs('squareFn', (x) => x * x, 'square'));
    return el;
  }

  function show(el, text, cls) {
    el.className = cls || '';
    el.textContent = text;
  }

  function describeType(value) {
    if (value === null) return 'null';
    if (Array.isArray(value)) return 'array';
    return typeof value;
  }

  function run() {
    if (!coreReady) {
      show(resultOut, 'The library could not be loaded from unpkg.', 'err');
      return;
    }

    const expression = exprInput.value.trim();
    if (!expression) {
      show(resultOut, 'Type an expression, or pick one above.', 'idle');
      show(compiledOut, '—');
      resultType.textContent = '';
      return;
    }

    let values;
    try {
      values = valuesInput.value.trim() ? JSON.parse(valuesInput.value) : {};
    } catch (err) {
      show(resultOut, 'Variables are not valid JSON: ' + err.message, 'err');
      show(compiledOut, '—');
      resultType.textContent = '';
      return;
    }

    try {
      const result = buildEngine().evaluate(expression, values);
      resultType.textContent = describeType(result);
      show(resultOut, result === undefined ? 'undefined' : JSON.stringify(result, null, 2));
    } catch (err) {
      resultType.textContent = err.constructor ? err.constructor.name : 'Error';
      show(resultOut, err.message, 'err');
    }

    try {
      show(compiledOut, buildEngine().compile(expression, Object.keys(values)));
    } catch (err) {
      show(compiledOut, err.message, 'err');
    }
  }

  let timer;
  const debounced = () => {
    clearTimeout(timer);
    timer = setTimeout(run, 150);
  };

  exprInput.addEventListener('input', debounced);
  valuesInput.addEventListener('input', debounced);
  providersCheck.addEventListener('change', run);

  /* ---------- boot ---------- */

  select.value = '0';
  loadExample(0);
})();
