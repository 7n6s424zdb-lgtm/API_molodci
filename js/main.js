// Запасные данные: страница работает и при открытии файла напрямую (file://),
// где fetch к data/team.json блокируется браузером. Меняя состав, правьте оба места.
const FALLBACK_TEAM = [
  {
    "name": "Широбокова Анна",
    "role": "Team Lead / DevOps",
    "avatar": "assets/anna.png",
    "bio": "Капитан команды «API-молодцы» и фронтенд-разработчик. В мои задачи входит создание HTML-каркаса сайта, продумывание его архитектуры и настройка контейнеризации (Docker) для дополнительных баллов. Я координирую работу всей команды: помогаю ребятам не сбиться с дедлайнов, собираю проект воедино и слежу за порядком в репозитории. Для меня этот хакатон — отличный шанс применить полученные на первом курсе знания на реальном командном проекте и доказать, что мы способны на большее."
  },
  {
    "name": "Боронина Маргарита",
    "role": "UI/UX-дизайнер",
    "avatar": "assets/margarita.png",
    "bio": "UI/UX-дизайнер. Сочетаю творческий подход с техническим бэкграундом, чтобы создавать понятные и эстетичные интерфейсы под задачи бизнеса. Знание кода помогает говорить на одном языке с разработчиками и проектировать макеты, которые легко и точно переносятся в готовый продукт. Ответственно подхожу к каждому этапу и довожу проект до идеального результата"
  },
  {
    "name": "Кузнецов Роман",
    "role": "Менеджер проекта / Git",
    "avatar": "assets/roman.png",
    "bio": "Менеджер проекта/git. Как менеджер, я слежу за тем, чтобы наша работа велась последовательно: от создания каркаса до финальной сборки, а как тестировщик — проверяю каждую строчку интерфейса. В зоне моей ответственности настройка .gitignore, проверка адаптивности и поиск ошибок в работе скриптов. Я нахожу проблемы там, где другие видят готовый сайт, и помогаю команде довести продукт до идеала перед сдачей"
  },
  {
    "name": "Вольхина Екатерина",
    "role": "Frontend (CSS)",
    "avatar": "assets/ekaterina.png",
    "bio": "CSS-верстальщик Отвечаю за визуальную целостность и техническую реализацию дизайна. Моя задача — превратить макеты и структурную разметку команды в аккуратный, адаптивный и удобный интерфейс. Прописываю все стили в style.css, обеспечивая безупречное отображение сайта на любых устройствах — от смартфонов до широкоформатных мониторов. Внимательна к деталям, помогаю команде с финальной проверкой внешнего вида и довожу верстку до идеала перед сдачей проекта."
  },
  {
    "name": "Мангушева Аделина",
    "role": "Frontend (JS) / данные",
    "avatar": "assets/adelina.png",
    "bio": "Frontend-разработчик (JS) / данные. Соединяю интерфейс с данными: превращаю статичную верстку в рабочее приложение. Пишу на JavaScript загрузку данных из JSON, динамический рендер карточек команды и валидацию формы - чтобы сайт был живым и интерактивным. Отвечаю за то, чтобы данные и интерфейс были разделены, а сайт - удобным и надёжным."
  }
];

async function loadTeam() {
  try {
    const res = await fetch("data/team.json");
    if (!res.ok) throw new Error(res.status);
    return await res.json();
  } catch (e) {
    return FALLBACK_TEAM;
  }
}

/* ---------- Модальное окно участника ---------- */
const modal = document.getElementById("member-modal");
const modalPhoto = document.getElementById("modal-photo");
const modalName = document.getElementById("modal-name");
const modalBio = document.getElementById("modal-bio");

function openModal(member) {
  modalPhoto.src = member.avatar;
  modalPhoto.alt = "Фото: " + member.name;
  modalName.textContent = member.name;
  modalBio.textContent = member.bio || "Описание";
  modal.showModal();
  document.body.classList.add("is-locked");
}

modal.querySelector(".modal__close").addEventListener("click", () => modal.close());
// клик по затемнённому фону закрывает окно
modal.addEventListener("click", (e) => { if (e.target === modal) modal.close(); });
// срабатывает и при закрытии клавишей Esc
modal.addEventListener("close", () => document.body.classList.remove("is-locked"));

/* ---------- Карточки команды ---------- */
function renderTeam(members) {
  const grid = document.getElementById("team-grid");
  grid.innerHTML = "";
  members.forEach((m) => {
    const card = document.createElement("article");
    card.className = "card";

    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "card__photo-btn";
    btn.setAttribute("aria-label", "Открыть информацию: " + m.name);
    btn.addEventListener("click", () => openModal(m));

    const img = document.createElement("img");
    img.className = "card__photo";
    img.src = m.avatar;
    img.alt = "Фото: " + m.name;
    img.loading = "lazy";
    btn.appendChild(img);

    const name = document.createElement("h3");
    name.className = "card__name";
    name.textContent = m.name;

    const role = document.createElement("p");
    role.className = "card__role";
    role.textContent = m.role;

    card.append(btn, name, role);
    grid.appendChild(card);
  });
}

/* ---------- Плавная прокрутка по меню ---------- */
function initNav() {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      const id = link.getAttribute("href");
      const target = id.length > 1 ? document.querySelector(id) : null;
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: reduce.matches ? "auto" : "smooth", block: "start" });
      history.pushState(null, "", id);
    });
  });
}

document.getElementById("year").textContent = new Date().getFullYear();
loadTeam().then(renderTeam);
initNav();

/* ---------- ЭФФЕКТ ПЕЧАТАЮЩЕЙ МАШИНКИ С КЛИКОМ НА КАЖДУЮ БУКВУ ---------- */
function typeWriter() {
    const text = "API-молодцы";
    const typedText = document.getElementById('typed-text');
    const cursor = document.getElementById('cursor'); 
    let i = 0;

    const clickSound = new Audio('assets/type.mp3'); 
    clickSound.volume = 0.5; 

    if (cursor) cursor.style.display = "inline"; 

    // Небольшая пауза, чтобы страница прогрузилась
    setTimeout(type, 900);

    function type() {
        if (i < text.length) {
            // 1. Печатаем букву
            typedText.textContent += text.charAt(i);
            i++;
            
            // 2. Сразу играем звук (если файл короткий, он не будет отставать)
            try {
                clickSound.currentTime = 0; // Перематываем в начало
                clickSound.play().catch(() => {}); 
            } catch (error) {}

            // 3. Ждем 150 мс и печатаем следующую
	        setTimeout(type, 150); 
        } else {
            // Когда текст закончился, прячем курсор
            if (cursor) cursor.style.display = "none";
        }
    }
}
window.addEventListener('load', typeWriter);