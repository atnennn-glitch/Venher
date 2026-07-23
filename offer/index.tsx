"use client";

import { useState } from "react";
import { coursePrograms, type Audience } from "./course-programs";

type Plan = {
  name: string;
  total: string;
  monthly: string;
  access: string;
  eyebrow: string;
  features: string[];
  note?: string;
};

const plans: Record<Audience, Plan[]> = {
  solo: [
    {
      name: "База",
      total: "$480",
      monthly: "$160 × 3 місяці",
      access: "3 місяці доступу",
      eyebrow: "Самостійний темп",
      features: [
        "Повний доступ до навчальних матеріалів, відеоуроків та бази знань",
        "Шаблони й таблиці для побудови продажів",
        "Текстова перевірка домашніх завдань на платформі",
      ],
      note: "Без спільних зідзвонів, особистих відповідей у Telegram та залучення авторки.",
    },
    {
      name: "Супровід",
      total: "$640",
      monthly: "$160 × 4 місяці",
      access: "2 місяці супроводу + 2 місяці впровадження",
      eyebrow: "Найкращий баланс",
      features: [
        "Усе, що входить у пакет «База»",
        "Особисті зустрічі кожні 2 тижні: ситуації, скрипти й рішення в реальному часі",
        "Закритий чат для швидких відповідей текстом або аудіо",
        "Ще 2 повних місяці на спокійне впровадження",
      ],
    },
    {
      name: "Контроль",
      total: "$690",
      monthly: "$160 × 4 місяці",
      access: "4 місяці доступу",
      eyebrow: "Максимум уваги",
      features: [
        "Усе, що входить у пакет «Супровід»",
        "Додаткова стратегічна онлайн-сесія до 2 годин у кінці програми",
        "Точкова докрутка конверсій і впроваджень",
        "План масштабування на наступні пів року",
      ],
    },
  ],
  team: [
    {
      name: "База",
      total: "$690",
      monthly: "$230 × 3 місяці",
      access: "3 місяці для 3 осіб",
      eyebrow: "Фундамент системи",
      features: [
        "Доступ для власника та двох людей із команди",
        "Усі матеріали, відеоуроки, шаблони, регламенти й таблиці",
        "Текстова перевірка домашніх завдань на платформі",
      ],
      note: "Без спільних зідзвонів, трекінгу показників і залучення авторки у ваш бізнес.",
    },
    {
      name: "Супровід",
      total: "$920",
      monthly: "$230 × 4 місяці",
      access: "2 місяці супроводу + 2 місяці впровадження",
      eyebrow: "Найкращий баланс",
      features: [
        "Усе, що входить у пакет «База»",
        "Трекінг-зустрічі кожні 2 тижні для вас і РОПа або менеджера",
        "Аналіз метрик, докрутка скриптів і воронки",
        "Закритий чат щодо управління продажами",
        "Ще 2 місяці на інтеграцію процесів у команду",
      ],
    },
    {
      name: "Контроль",
      total: "$1290",
      monthly: "$230 × 4 місяці",
      access: "4 місяці для 3 осіб",
      eyebrow: "Повний контроль",
      features: [
        "Усе, що входить у пакет «Супровід»",
        "Стратегічна сесія до 2 годин у кінці програми",
        "Покроковий план масштабування відділу на пів року",
        "Трекінг прогресу команди проєктним менеджером",
        "Контроль ДЗ, перегляду уроків, нагадування та загального прогресу",
      ],
    },
  ],
};

export default function Home() {
  const [audience, setAudience] = useState<Audience>("solo");
  const [selected, setSelected] = useState<string | null>(null);
  const [openModule, setOpenModule] = useState("solo-0");

  const chooseAudience = (value: Audience) => {
    setAudience(value);
    setSelected(null);
    setOpenModule(`${value}-0`);
  };

  return (
    <main>
      <nav className="nav shell" aria-label="Головна навігація">
        <a className="brand" href="#top" aria-label="На початок">
          <span className="brand-dot" />
          SALES · EDU
        </a>
        <a className="nav-cta" href="#packages">
          Обрати пакет
        </a>
      </nav>

      <section className="hero shell" id="top">
        <div className="hero-copy">
          <p className="kicker">Система продажів під ваш масштаб</p>
          <h1>
            Пакети
            <br />
            <em>курсу</em>
          </h1>
          <h2>Від знань до впровадженої системи продажів</h2>
          <p className="hero-text">
            Оберіть формат під свою точку росту: самостійна робота,
            персональний супровід або повний контроль результату.
          </p>
          <a className="primary-button" href="#packages">
            Порівняти пакети <span>→</span>
          </a>
        </div>
      </section>

      <section className="proof">
        <div className="shell proof-inner">
          <span>Матеріали</span>
          <span>Шаблони</span>
          <span>Супровід</span>
          <span>Впровадження</span>
          <span>Масштабування</span>
        </div>
      </section>

      <section className="packages shell" id="packages">
        <header className="section-heading">
          <div>
            <p className="kicker">Оберіть свою траєкторію</p>
            <h2>
              Один курс.
              <br />
              <em>Два масштаби.</em>
            </h2>
          </div>
          <p>
            У кожному напрямі — три рівні залучення. Перемикайте аудиторію,
            щоб побачити актуальну комплектацію та вартість.
          </p>
        </header>

        <div className="audience-switch" role="group" aria-label="Оберіть аудиторію">
          <button
            className={audience === "solo" ? "active" : ""}
            onClick={() => chooseAudience("solo")}
            aria-pressed={audience === "solo"}
          >
            <span>01</span>
            Соло-підприємці
            <small>$160 / місяць</small>
          </button>
          <button
            className={audience === "team" ? "active" : ""}
            onClick={() => chooseAudience("team")}
            aria-pressed={audience === "team"}
          >
            <span>02</span>
            Власники з менеджерами
            <small>$230 / місяць</small>
          </button>
        </div>

        <div className="plan-grid">
          {plans[audience].map((plan, index) => (
            <article
              className={`plan-card ${index === 1 ? "featured" : ""}`}
              key={`${audience}-${plan.name}`}
            >
              <div className="plan-top">
                <span className="plan-number">0{index + 1}</span>
                {index === 1 && <span className="popular">Популярний</span>}
              </div>
              <p className="plan-eyebrow">{plan.eyebrow}</p>
              <h3>{plan.name}</h3>
              <div className="price">{plan.total}</div>
              <p className="monthly">{plan.monthly}</p>
              <div className="access">{plan.access}</div>
              <ul>
                {plan.features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
              {plan.note && <p className="plan-note"><b>Важливо:</b> {plan.note}</p>}
              <button
                className="select-button"
                onClick={() => setSelected(`${plan.name} · ${audience === "solo" ? "Соло-підприємці" : "Власники з менеджерами"}`)}
              >
                Обрати {plan.name.toLowerCase()} <span>→</span>
              </button>
            </article>
          ))}
        </div>

        {selected && (
          <div className="selection" role="status">
            <span className="selection-icon">✓</span>
            <div>
              <small>Ваш вибір</small>
              <strong>{selected}</strong>
              <p>Зафіксуйте цю назву у повідомленні менеджеру курсу.</p>
            </div>
            <button onClick={() => setSelected(null)} aria-label="Скасувати вибір">×</button>
          </div>
        )}
      </section>

      <section className="program-section" id="program">
        <div className="shell">
          <header className="section-heading program-heading">
            <div>
              <p className="kicker">Повна програма</p>
              <h2>
                Подивіться,
                <br />
                <em>що всередині</em>
              </h2>
            </div>
            <p>
              Відкривайте модулі та переглядайте кожен урок. Програма
              відрізняється залежно від того, навчаєтесь ви самостійно чи з
              командою.
            </p>
          </header>

          <div className="program-toggle" role="group" aria-label="Програма для аудиторії">
            <button
              className={audience === "solo" ? "active" : ""}
              onClick={() => chooseAudience("solo")}
              aria-pressed={audience === "solo"}
            >
              <span>01</span>
              <div>
                <strong>Для соло-підприємців</strong>
                <small>11 модулів · 61 урок</small>
              </div>
            </button>
            <button
              className={audience === "team" ? "active" : ""}
              onClick={() => chooseAudience("team")}
              aria-pressed={audience === "team"}
            >
              <span>02</span>
              <div>
                <strong>Для власників з менеджерами</strong>
                <small>11 модулів · 55 уроків</small>
              </div>
            </button>
          </div>

          <div className="module-list">
            {coursePrograms[audience].map((module, index) => {
              const moduleId = `${audience}-${index}`;
              const isOpen = openModule === moduleId;

              return (
                <article className={`module-item ${isOpen ? "open" : ""}`} key={module.title}>
                  <button
                    className="module-trigger"
                    onClick={() => setOpenModule(isOpen ? "" : moduleId)}
                    aria-expanded={isOpen}
                    aria-controls={`lessons-${moduleId}`}
                  >
                    <span className="module-index">{String(index + 1).padStart(2, "0")}</span>
                    <div className="module-title">
                      <small>{module.lessons.length} {module.lessons.length === 1 ? "урок" : "уроків"}</small>
                      <strong>{module.title}</strong>
                    </div>
                    <span className="module-arrow">↘</span>
                  </button>

                  {isOpen && (
                    <div className="lesson-list" id={`lessons-${moduleId}`}>
                      {module.lessons.map((lesson, lessonIndex) => (
                        <div className="lesson-row" key={lesson}>
                          <span>{String(lessonIndex + 1).padStart(2, "0")}</span>
                          <p>{lesson}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="path">
        <div className="shell">
          <header className="section-heading compact">
            <div>
              <p className="kicker">Як це працює</p>
              <h2>
                Від уроку
                <br />
                <em>до системи</em>
              </h2>
            </div>
          </header>
          <div className="steps">
            <article>
              <span>01</span>
              <i>▶</i>
              <h3>Засвоюєте</h3>
              <p>Відеоуроки, база знань і конкретні інструменти без зайвої теорії.</p>
            </article>
            <article>
              <span>02</span>
              <i>✦</i>
              <h3>Впроваджуєте</h3>
              <p>Шаблони, таблиці, регламенти й домашні завдання стають процесами.</p>
            </article>
            <article>
              <span>03</span>
              <i>↗</i>
              <h3>Масштабуєте</h3>
              <p>Докручуєте конверсії, команду та план росту на наступні пів року.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="final-cta shell">
        <p className="kicker">Ваш наступний крок</p>
        <h2>
          Оберіть рівень
          <br />
          <em>під свою ціль.</em>
        </h2>
        <p>Не переплачуйте за зайве й не залишайтеся без підтримки там, де вона справді потрібна.</p>
        <a className="primary-button" href="#packages">
          Переглянути пакети <span>↑</span>
        </a>
      </section>

      <footer>
        <div className="shell footer-inner">
          <a className="brand" href="#top">
            <span className="brand-dot" />
            SALES · EDU
          </a>
          <p>Пакети навчання для системного росту продажів.</p>
          <span>© 2026</span>
        </div>
      </footer>
    </main>
  );
}
