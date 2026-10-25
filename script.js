(function () {
  "use strict";

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const narrowViewport = window.matchMedia("(max-width: 900px)").matches;

  /* ——— Typewriter ——— */
  const typeEl = document.getElementById("typewriter");
  const roles = [
    "пишу на Python",
    "собираю сервисы на Node.js",
    "обучаю ML-модели",
    "упаковываю всё в Docker",
    "веду историю в Git",
    "изучаю Rust",
    "пишу Telegram-ботов",
    "собираю протоколы агентов",
  ];
  let roleIndex = 0;
  let charIndex = 0;
  let deleting = false;

  function typeTick() {
    if (!typeEl || reducedMotion) {
      if (typeEl) typeEl.textContent = roles[0];
      return;
    }
    const current = roles[roleIndex];
    if (!deleting) {
      typeEl.textContent = current.slice(0, charIndex + 1);
      charIndex++;
      if (charIndex === current.length) {
        deleting = true;
        setTimeout(typeTick, 2000);
        return;
      }
      setTimeout(typeTick, 58);
    } else {
      typeEl.textContent = current.slice(0, charIndex - 1);
      charIndex--;
      if (charIndex === 0) {
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        setTimeout(typeTick, 450);
        return;
      }
      setTimeout(typeTick, 32);
    }
  }
  typeTick();

  /* ——— Reveal ——— */
  const revealEls = document.querySelectorAll(".reveal");
  if (reducedMotion) {
    revealEls.forEach((el) => el.classList.add("visible"));
  } else {
    const revealObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          const i = [...revealEls].indexOf(el);
          el.style.transitionDelay = `${(i % 6) * 70}ms`;
          el.classList.add("visible");
          revealObs.unobserve(el);
          el.addEventListener(
            "transitionend",
            () => {
              el.style.transitionDelay = "";
            },
            { once: true }
          );
        });
      },
      {
        threshold: narrowViewport ? 0.04 : 0.12,
        rootMargin: narrowViewport ? "0px 0px 8% 0px" : "0px",
      }
    );
    revealEls.forEach((el) => revealObs.observe(el));
    if (narrowViewport) {
      requestAnimationFrame(() => {
        document.querySelectorAll("#hero .reveal").forEach((el, i) => {
          el.style.transitionDelay = `${i * 90}ms`;
          el.classList.add("visible");
        });
      });
    }
  }

  /* ——— Project modal ——— */
  const PROJECTS = {
    newsparser: {
      title: "NewsParserAgent",
      category: "Автоматизация · LLM",
      tags: ["Python", "Docker", "YandexGPT", "Selenium", "Git"],
      images: [
        "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1200&q=80",
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80",
      ],
      desc: `
        <p>Сервис по расписанию читает ленту КубГУ, отбирает материалы по тематике и добавляет карточки в репозиторий статического сайта заказчика.</p>
        <ul>
          <li>Selenium + headless Chromium для ленты и статей</li>
          <li>Три роли YandexGPT: фильтр, редактор, верстальщик плана карточки</li>
          <li>Клон репозитория сайта, один коммит за проход, проверка diff и живого деплоя</li>
          <li>Состояние опросов в <code>data/state.json</code> внутри Docker-тома</li>
        </ul>
        <p><strong>Репозиторий:</strong> <a href="https://github.com/HomoNotSapiensY/NewsParserAgent" target="_blank" rel="noopener noreferrer">github.com/HomoNotSapiensY/NewsParserAgent</a></p>
      `,
    },
    aip: {
      title: "AgentSystemPrototype",
      category: "Pet · протокол AIP",
      tags: ["Python", "Docker", "mTLS", "Pydantic", "cryptography"],
      images: [
        "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=1200&q=80",
        "https://images.unsplash.com/photo-1633265486064-086b219458ec?w=1200&q=80",
      ],
      desc: `
        <p>Прототип взаимодействия агентных систем через пару <code>.aipkg</code> и <code>.aistorage</code>. Один юнит — четыре контейнера: unit, constructor, environment, receiver.</p>
        <ul>
          <li>Кадры hello / question / answer, канонический JSON и UUID v7</li>
          <li>Шифрованные контейнеры хранения, HPKE, сессии в SQLite</li>
          <li>Внутренний канал на HTTPS mTLS, наружу открыт только порт unit</li>
          <li>Модульные тесты криптографии и цепочки constructor → environment → receiver</li>
        </ul>
        <p><strong>Репозиторий:</strong> <a href="https://github.com/HomoNotSapiensY/AgentSystemPrototype" target="_blank" rel="noopener noreferrer">github.com/HomoNotSapiensY/AgentSystemPrototype</a></p>
      `,
    },
    agentlink: {
      title: "AgentLinkProto",
      category: "Open source · протокол 0.1",
      tags: ["Python", "FastAPI", "uvicorn", "pytest"],
      images: ["https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&q=80"],
      desc: `
        <p>Стенд минимальной подписки между тремя разными агентными средами и хабом. Общее только JSON-кадр и имена тем — среды не импортируют друг друга.</p>
        <ul>
          <li>Операции subscribe, unsubscribe, publish, acknowledge, error</li>
          <li>Система A публикует task.completed / task.failed, B — review.ready</li>
          <li>Система C: отдельные процессы notify, errors и опциональный audit</li>
          <li>pytest-сценарии и отчёт <code>results/protocol.json</code></li>
        </ul>
        <p><strong>Репозиторий:</strong> <a href="https://github.com/HomoNotSapiensY/AgentLinkProto" target="_blank" rel="noopener noreferrer">github.com/HomoNotSapiensY/AgentLinkProto</a></p>
      `,
    },
    postcodespace: {
      title: "PostcodeSpace",
      category: "GitLab · CV / ML",
      tags: ["Python", "Docker", "Postgres", "Prometheus"],
      images: ["https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1200&q=80"],
      desc: `
        <p>Учебный MVP: оценка загрузки грузового отсека по фото, XML API, микросервисы prepare / ml / out, мониторинг.</p>
        <p><strong>GitLab:</strong> <a href="https://fpm-gitlab.kubsu.ru/s0205540/postcodespace" target="_blank" rel="noopener noreferrer">postcodespace</a>
        · родственный репозиторий на GitHub: <a href="https://github.com/HomoNotSapiensY/SpaceEvaluatier" target="_blank" rel="noopener noreferrer">SpaceEvaluatier</a></p>
      `,
    },
    space: {
      title: "SpaceEvaluatier",
      category: "GitHub · CV",
      tags: ["Python", "Photo"],
      images: ["https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?w=1200&q=80"],
      desc: `
        <p>Выдача процента загрузки по фото — ранняя ветка задачи, развёрнутая в <strong>PostcodeSpace</strong> на GitLab.</p>
        <p><strong>Репозиторий:</strong> <a href="https://github.com/HomoNotSapiensY/SpaceEvaluatier" target="_blank" rel="noopener noreferrer">github.com/HomoNotSapiensY/SpaceEvaluatier</a></p>
      `,
    },
    pathfinder: {
      title: "PathFinder",
      category: "GitLab · Telegram-агент",
      tags: ["Python", "YandexGPT", "Telegram"],
      images: ["https://images.unsplash.com/photo-1532619675608-9dee815b6d2c?w=1200&q=80"],
      desc: `
        <p>Агент поиска статей по электромембранным системам: arXiv, Scopus, WoS, карточки и открытые PDF, команды <code>/digest</code>.</p>
        <p><strong>GitLab:</strong> <a href="https://fpm-gitlab.kubsu.ru/s0205540/pathfinder" target="_blank" rel="noopener noreferrer">pathfinder</a></p>
      `,
    },
    sciencehelper: {
      title: "ScienceHelper",
      category: "GitLab · RAG",
      tags: ["Python", "Embeddings", "SQLite", "Telegram"],
      images: ["https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=1200&q=80"],
      desc: `
        <p>Ответы только по проиндексированному корпусу PDF/MD с указанием документа и страницы; эмбеддинги Yandex, индекс в SQLite.</p>
        <p><strong>GitLab:</strong> <a href="https://fpm-gitlab.kubsu.ru/s0205540/sciencehelper" target="_blank" rel="noopener noreferrer">sciencehelper</a></p>
      `,
    },
    wildberries: {
      title: "WildberriesParser",
      category: "GitHub · парсер",
      tags: ["JavaScript", "Parser"],
      images: ["https://images.unsplash.com/photo-1472851294607-062e82485fe5?w=1200&q=80"],
      desc: `
        <p>Парсер корзины Wildberries.</p>
        <p><strong>Репозиторий:</strong> <a href="https://github.com/HomoNotSapiensY/WildberriesParser" target="_blank" rel="noopener noreferrer">github.com/HomoNotSapiensY/WildberriesParser</a></p>
      `,
    },
    meme: {
      title: "meme-parser",
      category: "GitHub · Telegram",
      tags: ["JavaScript", "Telegram"],
      images: ["https://images.unsplash.com/photo-1611162616475-46b635cb6848?w=1200&q=80"],
      desc: `
        <p>Бот: по ссылке в Telegram скачивает видео и отправляет в чат.</p>
        <p><strong>Репозиторий:</strong> <a href="https://github.com/HomoNotSapiensY/meme-parser" target="_blank" rel="noopener noreferrer">github.com/HomoNotSapiensY/meme-parser</a></p>
      `,
    },
    serverdaemon: {
      title: "ServerDaemonTg",
      category: "GitHub · DevOps",
      tags: ["Python", "Telegram"],
      images: ["https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&q=80"],
      desc: `
        <p>Telegram-бот: отслеживает процессы на сервере и запускает нужные.</p>
        <p><strong>Репозиторий:</strong> <a href="https://github.com/HomoNotSapiensY/ServerDaemonTg" target="_blank" rel="noopener noreferrer">github.com/HomoNotSapiensY/ServerDaemonTg</a></p>
      `,
    },
    spectra: {
      title: "spectra-parser",
      category: "GitHub · командный проект",
      tags: ["Parser"],
      images: ["https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80"],
      desc: `
        <p>Участие в глобальном командном проекте: личный модуль — разработка парсера.</p>
        <p><strong>Репозиторий:</strong> <a href="https://github.com/HomoNotSapiensY/spectra-parser" target="_blank" rel="noopener noreferrer">github.com/HomoNotSapiensY/spectra-parser</a></p>
      `,
    },
    repairer: {
      title: "Repairer",
      category: "GitHub · утилиты",
      tags: ["Python", "Utils"],
      images: ["https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=80"],
      desc: `
        <p>Утилиты для более стабильной работы окружения.</p>
        <p><strong>Репозиторий:</strong> <a href="https://github.com/HomoNotSapiensY/Repairer" target="_blank" rel="noopener noreferrer">github.com/HomoNotSapiensY/Repairer</a></p>
      `,
    },
    resfight: {
      title: "Res_fight",
      category: "GitHub · игра",
      tags: ["Godot", "GDScript", "Steam", "ENet"],
      images: ["https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1200&q=80"],
      desc: `
        <p>2D session strategy — онлайн RTS на Godot 4.7: меню, настройки, Steam Matchmaking и вход по IP.</p>
        <p><strong>Репозиторий:</strong> <a href="https://github.com/HomoNotSapiensY/Res_fight" target="_blank" rel="noopener noreferrer">github.com/HomoNotSapiensY/Res_fight</a></p>
      `,
    },
    visit: {
      title: "kontakt",
      category: "Portfolio · frontend",
      tags: ["HTML", "CSS", "JavaScript"],
      images: [
        "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=1200&q=80",
        "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=1200&q=80",
      ],
      desc: `
        <p>Персональная визитка в стиле агитплаката: 11 репозиториев GitHub и 3 на GitLab КубГУ в карточках и модалках.</p>
        <ul>
          <li>Полный каталог в <code>projects.md</code> в репозитории</li>
          <li>Чистый HTML/CSS/JS без сборщика</li>
        </ul>
        <p><strong>Репозиторий:</strong> <a href="https://github.com/HomoNotSapiensY/kontakt" target="_blank" rel="noopener noreferrer">github.com/HomoNotSapiensY/kontakt</a></p>
      `,
    },
  };

  const modal = document.getElementById("projectModal");
  const track = modal.querySelector(".carousel-track");
  const carousel = modal.querySelector(".carousel");
  const counter = modal.querySelector(".carousel-counter");
  const dotsWrap = modal.querySelector(".carousel-dots");
  const btnPrev = modal.querySelector(".carousel-btn.prev");
  const btnNext = modal.querySelector(".carousel-btn.next");
  const modalCategory = modal.querySelector(".modal-category");
  const modalTitle = modal.querySelector("#modalTitle");
  const modalTags = modal.querySelector(".modal-tags");
  const modalDesc = modal.querySelector(".modal-desc");

  let slideIndex = 0;
  let slideCount = 0;
  let touchStartX = 0;

  function setSlide(i) {
    if (slideCount === 0) return;
    slideIndex = (i + slideCount) % slideCount;
    track.style.transform = `translateX(-${slideIndex * 100}%)`;
    counter.textContent = `${slideIndex + 1} / ${slideCount}`;
    dotsWrap.querySelectorAll("button").forEach((btn, idx) => {
      btn.classList.toggle("active", idx === slideIndex);
    });
  }

  function buildCarousel(images) {
    track.innerHTML = "";
    dotsWrap.innerHTML = "";
    slideCount = images.length;
    carousel.classList.toggle("single", slideCount <= 1);

    images.forEach((src, idx) => {
      const img = document.createElement("img");
      img.src = src;
      img.alt = `Иллюстрация ${idx + 1} (заглушка)`;
      img.loading = "lazy";
      track.appendChild(img);

      const dot = document.createElement("button");
      dot.type = "button";
      dot.setAttribute("aria-label", `Слайд ${idx + 1}`);
      dot.addEventListener("click", () => setSlide(idx));
      dotsWrap.appendChild(dot);
    });
    slideIndex = 0;
    setSlide(0);
  }

  function openModal(id) {
    const data = PROJECTS[id];
    if (!data) return;
    modalCategory.textContent = data.category;
    modalTitle.textContent = data.title;
    modalTags.innerHTML = data.tags.map((t) => `<span>${t}</span>`).join("");
    modalDesc.innerHTML = data.desc;
    buildCarousel(data.images);
    modal.removeAttribute("hidden");
    modal.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    modal.classList.remove("open");
    modal.setAttribute("hidden", "");
    document.body.style.overflow = "";
  }

  document.querySelectorAll(".project-more").forEach((btn) => {
    btn.addEventListener("click", () => openModal(btn.getAttribute("data-project")));
  });

  modal.querySelectorAll("[data-close]").forEach((el) => {
    el.addEventListener("click", closeModal);
  });

  btnPrev.addEventListener("click", () => setSlide(slideIndex - 1));
  btnNext.addEventListener("click", () => setSlide(slideIndex + 1));

  document.addEventListener("keydown", (e) => {
    if (!modal.classList.contains("open")) return;
    if (e.key === "Escape") closeModal();
    if (e.key === "ArrowLeft") setSlide(slideIndex - 1);
    if (e.key === "ArrowRight") setSlide(slideIndex + 1);
  });

  const carouselViewport = modal.querySelector(".carousel-viewport");
  carouselViewport.addEventListener(
    "touchstart",
    (e) => {
      touchStartX = e.changedTouches[0].screenX;
    },
    { passive: true }
  );
  carouselViewport.addEventListener(
    "touchend",
    (e) => {
      const dx = e.changedTouches[0].screenX - touchStartX;
      if (Math.abs(dx) < 40) return;
      if (dx > 0) setSlide(slideIndex - 1);
      else setSlide(slideIndex + 1);
    },
    { passive: true }
  );
})();
