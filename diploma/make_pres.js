"use strict";
const pptxgen = require("pptxgenjs");
const path = require("path");
const outPath = path.join(__dirname, "presentation.pptx");

const pres = new pptxgen();
pres.layout = "LAYOUT_16x9"; // 10 × 5.625 inches
pres.author = "Иванов Муса Насирович";
pres.title = "Разработка мобильного приложения для рассылки новостей";

// ─── Palette ────────────────────────────────────────────────────────────────
const C = {
  navy:    "002060",
  burg:    "941100",
  white:   "FFFFFF",
  offWhite:"F5F7FA",
  cardBg:  "FFFFFF",
  text:    "1A2B4A",
  muted:   "64748B",
  light:   "E8EDF8",
  thinLine:"CBD5E1",
  footerTx:"8BAAD4",
  green:   "16A34A",
};

// ─── Shadow factories ────────────────────────────────────────────────────────
const sh  = () => ({ type:"outer", color:"000000", blur:14, offset:3, angle:135, opacity:0.09 });
const shS = () => ({ type:"outer", color:"000000", blur:8,  offset:2, angle:135, opacity:0.07 });

// ─── Slide chrome: top bar, title, bottom bar, slide number ─────────────────
function chrome(slide, num, title) {
  // top bar
  slide.addShape(pres.shapes.RECTANGLE, { x:0, y:0, w:10, h:0.055, fill:{color:C.burg}, line:{color:C.burg} });

  if (title) {
    slide.addText(title, {
      x:0.42, y:0.13, w:9.1, h:0.55,
      fontSize:20, bold:true, color:C.navy, fontFace:"Calibri",
      margin:0
    });
    // thin underline
    slide.addShape(pres.shapes.RECTANGLE, { x:0.42, y:0.66, w:9.1, h:0.025, fill:{color:C.burg}, line:{color:C.burg} });
  }

  // bottom bar
  slide.addShape(pres.shapes.RECTANGLE, { x:0, y:5.4, w:10, h:0.225, fill:{color:C.navy}, line:{color:C.navy} });

  // СКГА label
  slide.addText("СКГА  |  09.03.03 Прикладная информатика", {
    x:0.3, y:5.42, w:5, h:0.18,
    fontSize:8, color:C.footerTx, fontFace:"Calibri", margin:0
  });

  // slide number
  if (num) {
    slide.addText(String(num), {
      x:9.3, y:5.42, w:0.45, h:0.18,
      fontSize:8, color:C.footerTx, fontFace:"Calibri", align:"right", margin:0
    });
  }
}

// ─── White card helper ───────────────────────────────────────────────────────
function card(slide, x, y, w, h, opts) {
  const o = opts || {};
  slide.addShape(pres.shapes.RECTANGLE, {
    x, y, w, h,
    fill: { color: o.fill || C.cardBg },
    line: { color: o.border || C.thinLine, width: o.borderW || 0.5 },
    shadow: o.shadow !== false ? sh() : undefined,
    rectRadius: 0
  });
}

// ─── Left accent strip on a card ────────────────────────────────────────────
function cardAccent(slide, x, y, h, color) {
  slide.addShape(pres.shapes.RECTANGLE, {
    x, y, w:0.065, h,
    fill:{ color: color || C.burg }, line:{ color: color || C.burg }
  });
}

// ════════════════════════════════════════════════════════════════════════════
// SLIDE 1 — TITLE
// ════════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.navy };

  // Left accent bar
  s.addShape(pres.shapes.RECTANGLE, { x:0, y:0, w:0.07, h:5.625, fill:{color:C.burg}, line:{color:C.burg} });

  // Top-right decorative block
  s.addShape(pres.shapes.RECTANGLE, { x:8.5, y:0, w:1.5, h:0.07, fill:{color:C.burg}, line:{color:C.burg} });

  // University name
  s.addText("СЕВЕРО-КАВКАЗСКАЯ\nГОСУДАРСТВЕННАЯ АКАДЕМИЯ", {
    x:0.35, y:0.2, w:6, h:0.85,
    fontSize:13, bold:true, color:C.white, fontFace:"Calibri",
    charSpacing:1, margin:0
  });

  // Divider
  s.addShape(pres.shapes.RECTANGLE, { x:0.35, y:1.15, w:5.5, h:0.03, fill:{color:C.burg}, line:{color:C.burg} });

  // Main title
  s.addText([
    { text:"Разработка мобильного приложения для рассылки\nновостей и образовательных ресурсов\nвысшего учебного заведения\n", options:{fontSize:20, bold:true, color:C.white} },
    { text:"с использованием технологии React Native", options:{fontSize:20, bold:false, color:"8BAAD4"} }
  ], {
    x:0.35, y:1.28, w:9.3, h:2.65,
    fontFace:"Calibri", margin:0, valign:"top"
  });

  // Info block
  s.addShape(pres.shapes.RECTANGLE, { x:0.35, y:4.1, w:7.5, h:1.05, fill:{color:"FFFFFF", transparency:10}, line:{color:"FFFFFF", transparency:40} });

  s.addText([
    { text:"Направление:  ", options:{bold:true, color:"8BAAD4"} },
    { text:"09.03.03 — Прикладная информатика\n", options:{color:C.white} },
    { text:"Студент:  ", options:{bold:true, color:"8BAAD4"} },
    { text:"Иванов Муса Насирович\n", options:{color:C.white} },
    { text:"Руководитель:  ", options:{bold:true, color:"8BAAD4"} },
    { text:"_______________________", options:{color:"8BAAD4"} },
  ], {
    x:0.55, y:4.17, w:7.1, h:0.9,
    fontSize:11, fontFace:"Calibri", margin:0, valign:"top"
  });

  // Year
  s.addText("2026", {
    x:8.8, y:5.05, w:0.9, h:0.45,
    fontSize:26, bold:true, color:C.burg, fontFace:"Calibri",
    align:"right", margin:0
  });
}

// ════════════════════════════════════════════════════════════════════════════
// SLIDE 2 — АКТУАЛЬНОСТЬ
// ════════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.offWhite };
  chrome(s, 2, "Актуальность");

  // Three stat cards top row
  const stats = [
    { num:"94%", label:"студентов используют смартфон\nкак основной источник информации" },
    { num:"2×",  label:"рост числа мобильных\nобразовательных приложений за 3 года" },
    { num:"67%", label:"вузов планируют внедрение\nсобственных мобильных решений" },
  ];
  stats.forEach((st, i) => {
    const x = 0.42 + i * 3.14;
    card(s, x, 0.85, 2.95, 1.6);
    cardAccent(s, x, 0.85, 1.6);
    s.addText(st.num, {
      x: x+0.18, y:0.95, w:2.6, h:0.65,
      fontSize:38, bold:true, color:C.burg, fontFace:"Calibri", margin:0
    });
    s.addText(st.label, {
      x: x+0.18, y:1.6, w:2.65, h:0.75,
      fontSize:10, color:C.muted, fontFace:"Calibri", margin:0
    });
  });

  // Problem text card
  card(s, 0.42, 2.65, 9.16, 2.55);
  cardAccent(s, 0.42, 2.65, 2.55);

  s.addText("Проблематика", {
    x:0.65, y:2.76, w:8.7, h:0.35,
    fontSize:13, bold:true, color:C.navy, fontFace:"Calibri", margin:0
  });

  const problems = [
    "Отсутствие единого мобильного канала распространения новостей и учебных материалов в СКГА",
    "Студенты вынуждены посещать множество разрозненных источников информации (сайт, email, доски объявлений)",
    "Отсутствие персонализированных уведомлений приводит к пропуску важных событий и документов",
    "Необходимость цифровизации образовательного процесса в соответствии с требованиями ФГОС",
  ];
  s.addText(problems.map((t, i) => [
    { text:`${i+1}.  `, options:{ bold:true, color:C.burg } },
    { text:t + (i < problems.length-1 ? "\n" : ""), options:{ color:C.text } }
  ]).flat(), {
    x:0.65, y:3.16, w:8.7, h:1.95,
    fontSize:11.5, fontFace:"Calibri", margin:0, valign:"top",
    paraSpaceAfter:4
  });
}

// ════════════════════════════════════════════════════════════════════════════
// SLIDE 3 — ОБЪЕКТ / ПРЕДМЕТ / ЦЕЛЬ
// ════════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.offWhite };
  chrome(s, 3, "Объект, предмет и цель исследования");

  const rows = [
    {
      label:"ОБЪЕКТ",
      color: C.navy,
      title:"Процесс информационного взаимодействия участников образовательного процесса",
      sub:"Коммуникация между администрацией, преподавателями и студентами СКГА через цифровые каналы",
    },
    {
      label:"ПРЕДМЕТ",
      color: C.burg,
      title:"Технологии разработки кросс-платформенных мобильных приложений",
      sub:"Фреймворк React Native (Expo SDK 50) как инструмент реализации мобильного клиента",
    },
    {
      label:"ЦЕЛЬ",
      color: C.green,
      title:"Разработать и реализовать мобильное приложение для рассылки новостей и образовательных ресурсов СКГА",
      sub:"Обеспечить удобный персонализированный доступ к информации для студентов и преподавателей",
    },
  ];

  rows.forEach((r, i) => {
    const y = 0.92 + i * 1.47;
    card(s, 0.42, y, 9.16, 1.32);

    // Colored label block
    s.addShape(pres.shapes.RECTANGLE, { x:0.42, y, w:1.35, h:1.32, fill:{color:r.color}, line:{color:r.color} });
    s.addText(r.label, {
      x:0.42, y: y+0.42, w:1.35, h:0.48,
      fontSize:13, bold:true, color:C.white, fontFace:"Calibri",
      align:"center", margin:0
    });

    s.addText(r.title, {
      x:1.93, y: y+0.1, w:7.45, h:0.52,
      fontSize:12.5, bold:true, color:C.text, fontFace:"Calibri", margin:0
    });
    s.addText(r.sub, {
      x:1.93, y: y+0.63, w:7.45, h:0.55,
      fontSize:10.5, color:C.muted, fontFace:"Calibri", margin:0
    });
  });
}

// ════════════════════════════════════════════════════════════════════════════
// SLIDE 4 — ЗАДАЧИ
// ════════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.offWhite };
  chrome(s, 4, "Задачи исследования");

  const tasks = [
    { n:"01", t:"Анализ предметной области",    d:"Изучить существующие решения, выявить требования к функциональности приложения" },
    { n:"02", t:"Проектирование архитектуры",    d:"Разработать клиент-серверную архитектуру, спроектировать схему базы данных" },
    { n:"03", t:"Разработка серверной части",    d:"Реализовать REST API на Node.js + Express + TypeScript с Prisma ORM и PostgreSQL" },
    { n:"04", t:"Разработка мобильного клиента", d:"Создать интерфейс и логику приложения на React Native (Expo SDK 50)" },
    { n:"05", t:"Реализация аутентификации",     d:"Внедрить JWT-авторизацию, Expo SecureStore и ролевую модель доступа" },
    { n:"06", t:"Тестирование и документирование", d:"Провести функциональное тестирование и оформить пояснительную записку" },
  ];

  // 2 columns × 3 rows
  tasks.forEach((t, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = 0.42 + col * 4.74;
    const y = 0.92 + row * 1.47;

    card(s, x, y, 4.5, 1.32);
    cardAccent(s, x, y, 1.32, col === 0 ? C.navy : C.burg);

    s.addText(t.n, {
      x: x+0.22, y: y+0.1, w:0.65, h:0.45,
      fontSize:24, bold:true, color: col===0 ? C.navy : C.burg,
      fontFace:"Calibri", margin:0
    });
    s.addText(t.t, {
      x: x+0.22, y: y+0.53, w:4.12, h:0.32,
      fontSize:11, bold:true, color:C.text, fontFace:"Calibri", margin:0
    });
    s.addText(t.d, {
      x: x+0.22, y: y+0.83, w:4.12, h:0.4,
      fontSize:9.5, color:C.muted, fontFace:"Calibri", margin:0
    });
  });
}

// ════════════════════════════════════════════════════════════════════════════
// SLIDE 5 — СТЕК ТЕХНОЛОГИЙ
// ════════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.offWhite };
  chrome(s, 5, "Стек технологий");

  const groups = [
    {
      label:"КЛИЕНТ",
      color: C.navy,
      items: ["React Native", "Expo SDK 50", "TypeScript", "Zustand", "Axios", "Expo Router"],
    },
    {
      label:"СЕРВЕР",
      color: C.burg,
      items: ["Node.js", "Express", "TypeScript", "Prisma ORM", "JWT Auth", "REST API"],
    },
    {
      label:"ХРАНИЛИЩЕ",
      color: "0D7A5F",
      items: ["PostgreSQL 16", "Expo SecureStore", "Multer (файлы)", "", "", ""],
    },
  ];

  groups.forEach((g, gi) => {
    const x = 0.42 + gi * 3.14;

    // Header block
    s.addShape(pres.shapes.RECTANGLE, { x, y:0.88, w:2.95, h:0.52, fill:{color:g.color}, line:{color:g.color} });
    s.addText(g.label, {
      x, y:0.88, w:2.95, h:0.52,
      fontSize:13, bold:true, color:C.white, fontFace:"Calibri",
      align:"center", margin:0
    });

    // Items card
    card(s, x, 1.38, 2.95, 3.82, { border:"D1D9EE" });

    g.items.forEach((item, ii) => {
      if (!item) return;
      const iy = 1.5 + ii * 0.61;
      // item bg
      s.addShape(pres.shapes.RECTANGLE, {
        x: x+0.14, y: iy, w:2.66, h:0.46,
        fill:{ color: gi===0 ? "EEF2FF" : gi===1 ? "FFF0F0" : "EDFBF5" },
        line:{ color: gi===0 ? "C7D2F8" : gi===1 ? "FCCACA" : "A7EBCE", width:0.5 }
      });
      s.addText(item, {
        x: x+0.14, y: iy, w:2.66, h:0.46,
        fontSize:11.5, bold:true, color:g.color, fontFace:"Calibri",
        align:"center", margin:0
      });
    });
  });
}

// ════════════════════════════════════════════════════════════════════════════
// SLIDE 6 — БИЗНЕС-ПРОЦЕССЫ
// ════════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.offWhite };
  chrome(s, 6, "Бизнес-процессы системы");

  // Roles column
  const roles = [
    { role:"Студент",          color:C.navy,  acts:["Регистрация / вход", "Просмотр новостей", "Доступ к материалам", "Получение уведомлений"] },
    { role:"Преподаватель",    color:"0D7A5F", acts:["Публикация новостей", "Загрузка материалов", "Отправка уведомлений"] },
    { role:"Администратор",    color:C.burg,  acts:["Управление пользователями", "Модерация контента", "Настройка системы"] },
  ];

  roles.forEach((r, ri) => {
    const y = 0.9 + ri * 1.55;
    // Role label
    s.addShape(pres.shapes.RECTANGLE, { x:0.42, y, w:1.8, h:0.48, fill:{color:r.color}, line:{color:r.color} });
    s.addText(r.role, {
      x:0.42, y, w:1.8, h:0.48,
      fontSize:12, bold:true, color:C.white, fontFace:"Calibri",
      align:"center", margin:0
    });

    // Actions
    r.acts.forEach((act, ai) => {
      const ax = 2.48 + ai * 1.92;
      card(s, ax, y, 1.72, 0.48, { border: ri===0 ? "C7D2F8" : ri===1 ? "A7EBCE" : "FCCACA", shadow:false, fill: ri===0 ? "EEF2FF" : ri===1 ? "EDFBF5" : "FFF0F0" });
      s.addText(act, {
        x: ax+0.08, y: y+0.04, w:1.56, h:0.4,
        fontSize:9.5, color:r.color, fontFace:"Calibri",
        align:"center", bold:true, margin:0
      });
      // Arrow between boxes
      if (ai < r.acts.length - 1) {
        s.addShape(pres.shapes.LINE, {
          x: ax+1.72, y: y+0.24, w:0.2, h:0,
          line:{ color:C.muted, width:1 }
        });
      }
    });

    // Line from role to first action
    s.addShape(pres.shapes.LINE, {
      x: 2.22, y: y+0.24, w:0.26, h:0,
      line:{ color:r.color, width:1 }
    });
  });

  // API layer
  card(s, 0.42, 5.0, 9.16, 0.35, { fill:C.navy, shadow:false });
  s.addText("REST API  —  Node.js + Express + TypeScript  —  PostgreSQL 16", {
    x:0.42, y:5.0, w:9.16, h:0.35,
    fontSize:11, bold:true, color:C.white, fontFace:"Calibri",
    align:"center", margin:0
  });
}

// ════════════════════════════════════════════════════════════════════════════
// SLIDE 7 — СХЕМА ДАННЫХ
// ════════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.offWhite };
  chrome(s, 7, "Схема базы данных");

  const entities = [
    { name:"User",          color:C.navy,  fields:["id", "email", "password_hash", "role", "name", "created_at"] },
    { name:"News",          color:C.burg,  fields:["id", "title", "content", "author_id", "category", "published_at"] },
    { name:"Resource",      color:"0D7A5F",fields:["id", "title", "file_url", "type", "author_id", "created_at"] },
    { name:"Notification",  color:"7C3AED",fields:["id", "user_id", "message", "type", "is_read", "created_at"] },
    { name:"Category",      color:"D97706",fields:["id", "name", "description"] },
  ];

  entities.forEach((e, ei) => {
    const col = ei % 3;
    const row = Math.floor(ei / 3);
    const x = 0.38 + col * 3.22;
    const y = 0.92 + row * 2.45;
    const h = 2.2;

    card(s, x, y, 2.98, h, { shadow:false, border:"C8D3E8" });

    // Entity header
    s.addShape(pres.shapes.RECTANGLE, { x, y, w:2.98, h:0.42, fill:{color:e.color}, line:{color:e.color} });
    s.addText(e.name, {
      x, y, w:2.98, h:0.42,
      fontSize:13, bold:true, color:C.white, fontFace:"Calibri",
      align:"center", margin:0
    });

    e.fields.forEach((f, fi) => {
      const fy = y + 0.5 + fi * 0.27;
      if (fy + 0.27 > y + h) return;
      s.addText(f, {
        x: x+0.2, y: fy, w:2.58, h:0.26,
        fontSize:10, color: fi===0 ? C.burg : C.text,
        bold: fi === 0,
        fontFace:"Calibri", margin:0
      });
      if (fi > 0 && fi < e.fields.length - 1) {
        s.addShape(pres.shapes.LINE, {
          x: x+0.15, y: fy+0.265, w:2.68, h:0,
          line:{ color:"E2E8F0", width:0.5 }
        });
      }
    });
  });

  // Legend
  s.addText("PK = id (SERIAL PRIMARY KEY)  |  FK = *_id  |  Все таблицы: схема public, PostgreSQL 16", {
    x:0.38, y:5.2, w:9.24, h:0.22,
    fontSize:8.5, color:C.muted, fontFace:"Calibri", align:"center", margin:0
  });
}

// ════════════════════════════════════════════════════════════════════════════
// SLIDES 8-16 — ЭКРАННЫЕ ФОРМЫ (helper function)
// ════════════════════════════════════════════════════════════════════════════
function screenSlide(num, title, features, screenLabel, screenColor) {
  const s = pres.addSlide();
  s.background = { color: C.offWhite };
  chrome(s, num, title);

  // Phone mockup frame (left side)
  const px = 0.42, py = 0.92;
  const pw = 2.85, ph = 4.35;

  // Phone outer
  card(s, px, py, pw, ph, { fill:"1A2B4A", border:"1A2B4A" });

  // Screen area
  const sx = px+0.18, sy = py+0.22;
  const sw = pw-0.36, sh2 = ph-0.52;
  s.addShape(pres.shapes.RECTANGLE, {
    x:sx, y:sy, w:sw, h:sh2,
    fill:{ color: screenColor || "F0F4FF" },
    line:{ color:"C8D3E8", width:0.5 }
  });

  // Status bar
  s.addShape(pres.shapes.RECTANGLE, { x:sx, y:sy, w:sw, h:0.2, fill:{color:C.navy}, line:{color:C.navy} });
  s.addText("9:41", {
    x:sx+0.08, y:sy+0.02, w:0.5, h:0.16,
    fontSize:7, color:C.white, fontFace:"Calibri", bold:true, margin:0
  });

  // App bar
  s.addShape(pres.shapes.RECTANGLE, { x:sx, y:sy+0.2, w:sw, h:0.32, fill:{color:C.navy}, line:{color:C.navy} });
  s.addText("СКГА", {
    x:sx, y:sy+0.2, w:sw, h:0.32,
    fontSize:9, bold:true, color:C.white, fontFace:"Calibri",
    align:"center", margin:0
  });

  // Screen label
  s.addText(screenLabel || "Экран", {
    x:sx, y:sy+0.62, w:sw, h:0.36,
    fontSize:8, bold:true, color:C.navy, fontFace:"Calibri",
    align:"center", margin:0
  });

  // Screen content lines (placeholder)
  for (let li = 0; li < 6; li++) {
    const lineY = sy+1.1 + li*0.47;
    if (lineY + 0.35 > sy+sh2) break;
    s.addShape(pres.shapes.RECTANGLE, {
      x:sx+0.12, y:lineY, w:sw-0.24, h:0.35,
      fill:{ color:C.white }, line:{ color:"E2E8F0", width:0.5 }
    });
  }

  // Home indicator
  s.addShape(pres.shapes.RECTANGLE, { x:sx+0.8, y:sy+sh2-0.15, w:0.85, h:0.07, fill:{color:"C8D3E8"}, line:{color:"C8D3E8"} });

  // Right side — features
  const fx = px + pw + 0.35;
  const fw = 10 - fx - 0.25;

  s.addText("Функциональность экрана:", {
    x:fx, y:0.97, w:fw, h:0.35,
    fontSize:12, bold:true, color:C.navy, fontFace:"Calibri", margin:0
  });

  features.forEach((f, fi) => {
    const fy = 1.45 + fi * 0.72;
    if (fy + 0.65 > 5.25) return;
    card(s, fx, fy, fw, 0.65, { shadow:false, border:"D1D9EE" });
    cardAccent(s, fx, fy, 0.65, fi%2===0 ? C.navy : C.burg);
    s.addText([
      { text:f.title+"\n", options:{bold:true, color:C.text} },
      { text:f.desc, options:{color:C.muted} }
    ], {
      x:fx+0.2, y:fy+0.05, w:fw-0.25, h:0.56,
      fontSize:10, fontFace:"Calibri", margin:0, valign:"top"
    });
  });

  return s;
}

// Slide 8 — Авторизация
screenSlide(8, "Экранная форма: Авторизация и регистрация",
  [
    { title:"Форма входа",       desc:"Email + пароль, валидация полей, обработка ошибок" },
    { title:"Регистрация",       desc:"Создание аккаунта студента/преподавателя" },
    { title:"JWT-токены",        desc:"Сохранение в Expo SecureStore, автообновление" },
    { title:"Ролевой доступ",    desc:"Перенаправление по роли после входа" },
    { title:"Восстановление",    desc:"Сброс пароля через email" },
  ], "Авторизация", "F5F7FA"
);

// Slide 9 — Лента новостей
screenSlide(9, "Экранная форма: Лента новостей",
  [
    { title:"Список новостей",   desc:"Карточки с заголовком, датой и превью текста" },
    { title:"Фильтрация",        desc:"По категории и дате публикации" },
    { title:"Pull-to-refresh",   desc:"Обновление ленты жестом" },
    { title:"Lazy loading",      desc:"Постепенная подгрузка при прокрутке" },
    { title:"Поиск",             desc:"Полнотекстовый поиск по заголовку и содержанию" },
  ], "Новости", "FFF8F5"
);

// Slide 10 — Статья/Новость
screenSlide(10, "Экранная форма: Просмотр новости",
  [
    { title:"Полный текст",      desc:"Форматированный контент с изображениями" },
    { title:"Мета-данные",       desc:"Автор, дата, категория публикации" },
    { title:"Навигация",         desc:"Кнопка «Назад» и переход к следующей" },
    { title:"Шаринг",            desc:"Передача ссылки через нативный Share API" },
    { title:"Размер шрифта",     desc:"Настройка удобочитаемости текста" },
  ], "Статья", "F5FFF9"
);

// Slide 11 — Образовательные ресурсы
screenSlide(11, "Экранная форма: Образовательные ресурсы",
  [
    { title:"Каталог материалов",desc:"Структурированный список по дисциплинам" },
    { title:"Типы файлов",       desc:"PDF, DOCX, изображения с превью" },
    { title:"Поиск и фильтры",   desc:"Фильтрация по типу, дисциплине, преподавателю" },
    { title:"Сортировка",        desc:"По дате добавления, названию, популярности" },
    { title:"Избранное",         desc:"Сохранение материалов для быстрого доступа" },
  ], "Ресурсы", "F5F0FF"
);

// Slide 12 — Просмотр документа
screenSlide(12, "Экранная форма: Просмотр документа",
  [
    { title:"Встроенный просмотр",desc:"PDF/DOCX рендеринг без сторонних приложений" },
    { title:"Загрузка файла",    desc:"Скачивание в локальное хранилище устройства" },
    { title:"Прогресс загрузки", desc:"Визуальный индикатор при скачивании" },
    { title:"Открытие в приложении", desc:"Запуск нативного обработчика файла" },
    { title:"Детали файла",      desc:"Размер, формат, дата загрузки, автор" },
  ], "Документ", "FFFBF0"
);

// Slide 13 — Профиль
screenSlide(13, "Экранная форма: Профиль пользователя",
  [
    { title:"Личные данные",     desc:"Имя, email, группа/должность, аватар" },
    { title:"Редактирование",    desc:"Изменение профиля с валидацией" },
    { title:"Смена пароля",      desc:"Защищённое обновление с подтверждением" },
    { title:"Статистика",        desc:"Просмотренные материалы, активность" },
    { title:"Выход из аккаунта", desc:"Очистка токенов и данных сессии" },
  ], "Профиль", "F0F8FF"
);

// Slide 14 — Уведомления
screenSlide(14, "Экранная форма: Уведомления",
  [
    { title:"Список уведомлений",desc:"Хронологический список системных сообщений" },
    { title:"Типы сообщений",    desc:"Новости, документы, административные события" },
    { title:"Отметка прочитанных", desc:"Массовая и одиночная отметка" },
    { title:"Push-уведомления",  desc:"Expo Notifications, фоновые и foreground" },
    { title:"Фильтрация",        desc:"Отображение только непрочитанных" },
  ], "Уведомления", "FFF5F5"
);

// Slide 15 — Настройки
screenSlide(15, "Экранная форма: Настройки приложения",
  [
    { title:"Тема оформления",   desc:"Светлая / тёмная / системная тема" },
    { title:"Язык интерфейса",   desc:"Русский язык по умолчанию" },
    { title:"Уведомления",       desc:"Тонкая настройка категорий оповещений" },
    { title:"Кэш и данные",      desc:"Очистка загруженных файлов" },
    { title:"О приложении",      desc:"Версия, лицензии, ссылки на поддержку" },
  ], "Настройки", "F8F5FF"
);

// Slide 16 — Административная панель
screenSlide(16, "Экранная форма: Административная панель",
  [
    { title:"Управление пользователями", desc:"Просмотр, назначение ролей, блокировка" },
    { title:"Публикация новостей",desc:"Создание, редактирование, удаление" },
    { title:"Управление ресурсами", desc:"Загрузка и категоризация учебных материалов" },
    { title:"Массовые уведомления", desc:"Отправка push всем или отдельным группам" },
    { title:"Аналитика",         desc:"Просмотры, активность, популярные материалы" },
  ], "Администратор", "FFFAF0"
);

// ════════════════════════════════════════════════════════════════════════════
// SLIDE 17 — ВЫВОДЫ
// ════════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.offWhite };
  chrome(s, 17, "Выводы и результаты работы");

  const results = [
    { n:"01", t:"Проведён анализ предметной области",            d:"Изучены аналоги, сформированы функциональные и нефункциональные требования" },
    { n:"02", t:"Спроектирована архитектура системы",           d:"Разработана клиент-серверная архитектура, схема БД из 5 связанных таблиц" },
    { n:"03", t:"Реализован REST API на Node.js + TypeScript",  d:"Express-сервер, Prisma ORM, JWT-авторизация, ролевая модель (3 роли)" },
    { n:"04", t:"Разработано мобильное приложение React Native", d:"9 экранных форм, Expo SDK 50, Zustand, Expo Router, SecureStore" },
    { n:"05", t:"Внедрены Push-уведомления",                   d:"Expo Notifications, фоновая и foreground доставка, персонализация" },
    { n:"06", t:"Проведено тестирование и документирование",    d:"Функциональное тестирование, оформлена пояснительная записка по ГОСТ" },
  ];

  results.forEach((r, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = 0.42 + col * 4.74;
    const y = 0.92 + row * 1.48;

    card(s, x, y, 4.5, 1.32);
    cardAccent(s, x, y, 1.32, i < 2 ? C.navy : i < 4 ? C.burg : C.green);

    // Number badge
    s.addShape(pres.shapes.RECTANGLE, {
      x: x+0.22, y: y+0.12, w:0.42, h:0.42,
      fill:{ color: i<2 ? C.navy : i<4 ? C.burg : C.green },
      line:{ color: i<2 ? C.navy : i<4 ? C.burg : C.green }
    });
    s.addText(r.n, {
      x: x+0.22, y: y+0.12, w:0.42, h:0.42,
      fontSize:11, bold:true, color:C.white, fontFace:"Calibri",
      align:"center", margin:0
    });

    s.addText(r.t, {
      x: x+0.78, y: y+0.1, w:3.58, h:0.46,
      fontSize:11, bold:true, color:C.text, fontFace:"Calibri", margin:0
    });
    s.addText(r.d, {
      x: x+0.78, y: y+0.57, w:3.58, h:0.62,
      fontSize:9.5, color:C.muted, fontFace:"Calibri", margin:0
    });
  });
}

// ════════════════════════════════════════════════════════════════════════════
// SLIDE 18 — ДОКЛАДЧИК
// ════════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.offWhite };
  chrome(s, 18, "О докладчике");

  // Main card
  card(s, 0.42, 0.9, 9.16, 4.3);
  cardAccent(s, 0.42, 0.9, 4.3, C.navy);

  // Avatar placeholder circle
  s.addShape(pres.shapes.OVAL, {
    x:0.75, y:1.1, w:1.7, h:1.7,
    fill:{ color:C.light }, line:{ color:C.navy, width:2 }
  });
  s.addText("И.М.Н", {
    x:0.75, y:1.1, w:1.7, h:1.7,
    fontSize:20, bold:true, color:C.navy, fontFace:"Calibri",
    align:"center", margin:0
  });

  // Name
  s.addText("Иванов Муса Насирович", {
    x:2.65, y:1.05, w:6.7, h:0.6,
    fontSize:22, bold:true, color:C.navy, fontFace:"Calibri", margin:0
  });

  // Details
  const details = [
    { label:"Направление:", value:"09.03.03 — Прикладная информатика" },
    { label:"Форма обучения:", value:"Очная, 4 курс" },
    { label:"Учебное заведение:", value:"Северо-Кавказская государственная академия" },
    { label:"Год защиты:", value:"2026" },
  ];
  details.forEach((d, di) => {
    s.addText([
      { text:d.label+"  ", options:{bold:true, color:C.muted} },
      { text:d.value, options:{color:C.text} }
    ], {
      x:2.65, y:1.73 + di*0.38, w:6.7, h:0.36,
      fontSize:11.5, fontFace:"Calibri", margin:0
    });
  });

  // Divider
  s.addShape(pres.shapes.LINE, {
    x:0.65, y:3.1, w:8.93, h:0,
    line:{ color:C.thinLine, width:0.75 }
  });

  // Thesis title
  s.addText("Тема выпускной квалификационной работы:", {
    x:0.65, y:3.22, w:8.93, h:0.32,
    fontSize:11, bold:true, color:C.muted, fontFace:"Calibri", margin:0
  });
  s.addText("Разработка мобильного приложения для рассылки новостей и образовательных ресурсов высшего учебного заведения с использованием технологии React Native", {
    x:0.65, y:3.55, w:8.93, h:0.75,
    fontSize:12, bold:true, color:C.navy, fontFace:"Calibri", margin:0
  });

  // Supervisor
  s.addText([
    { text:"Научный руководитель:  ", options:{bold:true, color:C.muted} },
    { text:"_______________________________", options:{color:C.text} }
  ], {
    x:0.65, y:4.42, w:8.93, h:0.32,
    fontSize:11, fontFace:"Calibri", margin:0
  });
}

// ════════════════════════════════════════════════════════════════════════════
// SLIDE 19 — FINAL / THANK YOU
// ════════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.navy };

  // Left accent
  s.addShape(pres.shapes.RECTANGLE, { x:0, y:0, w:0.07, h:5.625, fill:{color:C.burg}, line:{color:C.burg} });

  // Top-right corner accent
  s.addShape(pres.shapes.RECTANGLE, { x:8.5, y:0, w:1.5, h:0.07, fill:{color:C.burg}, line:{color:C.burg} });

  // Main text
  s.addText("Спасибо\nза внимание!", {
    x:0.35, y:1.3, w:9.3, h:2.2,
    fontSize:52, bold:true, color:C.white, fontFace:"Calibri",
    margin:0, valign:"middle"
  });

  // Divider
  s.addShape(pres.shapes.RECTANGLE, { x:0.35, y:3.65, w:4.5, h:0.04, fill:{color:C.burg}, line:{color:C.burg} });

  // Subtitle
  s.addText("Иванов Муса Насирович  |  09.03.03 Прикладная информатика  |  СКГА, 2026", {
    x:0.35, y:3.82, w:9.3, h:0.4,
    fontSize:11.5, color:"8BAAD4", fontFace:"Calibri", margin:0
  });

  // Bottom bar
  s.addShape(pres.shapes.RECTANGLE, { x:0, y:5.4, w:10, h:0.225, fill:{color:"0A1535"}, line:{color:"0A1535"} });
}

// ─── Write output ─────────────────────────────────────────────────────────
pres.writeFile({ fileName: outPath })
  .then(() => console.log("OK: " + outPath))
  .catch(e => { console.error(e); process.exit(1); });
