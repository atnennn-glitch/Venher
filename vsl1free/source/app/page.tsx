const Arrow = () => <span aria-hidden="true">↘</span>;
import VideoGate from "./VideoGate";
export default function Home() {
  return <main id="top">
    <header className="nav wrap"><a className="brand" href="#top">VENHER · EDU</a><nav aria-label="Навігація"><a href="#video">Дивитися</a><a href="#reviews">Відгуки</a><a href="#author">Про авторку</a></nav><a className="navCta" href="#video">Дивитися <Arrow /></a></header>
    <section className="hero wrap" id="hero">
      <div className="eyebrow"><i /> Безкоштовний відеорозбір для власників бізнесу</div>
      <h1>Твій менеджер з продажу = <em>довідкове бюро?</em></h1>
      <div className="heroGrid"><div className="heroCopy"><p>Подивись, де саме твій бізнес зливає до 40% рекламного бюджету — і як перетворити хаотичні переписки на систему продажів.</p><a className="button" href="#video">Дивитися безкоштовно <Arrow /></a><div className="micro"><b>Без води.</b> Реальні діалоги, цифри та рішення.</div></div>
      <div className="heroVisual"><img src="/olha-hero.jpg" alt="Ольга Венгерець — авторка відео" /><div className="authorBadge"><span>Авторка VSL</span><b>Ольга Венгерець</b><small>12 років у продажах</small></div><div className="roundMark">↘</div></div></div>
    </section>
    <VideoGate />
    <section className="loss section"><div className="wrap lossGrid"><p className="kicker">Знайома ситуація?</p><h2>Ви платите за рекламу, контент і менеджера.</h2><div className="lossCallout"><span>А на виході</span><strong>«Дякуємо, звертайтесь!»</strong></div><p className="lossText">Клієнт питає ціну, отримує суху відповідь і зникає. Менеджер чекає, що покупець сам поставить усі питання, сам прийме рішення і сам надішле чек.</p></div></section>
    <section className="numbers wrap section"><div className="numberIntro"><p className="kicker">Порахуємо втрати</p><h2>+5% до конверсії — це вже <em>+15 продажів</em></h2><p>За прикладом із відео: при середньому чеку $50 і бюджеті $1000 різниця між 15% і 20% конверсії коштує бізнесу $750 щомісяця.</p></div><div className="bigNumber"><span>до</span><b>$27 000</b><small>може недопродавати ваш бізнес за рік</small></div></section>
    <section className="choice wrap section"><p className="kicker">У вас завжди є два шляхи</p><div className="choiceGrid"><div className="muted"><span>Шлях 01</span><h2>Нічого не змінювати.</h2></div><div className="active"><span>Шлях 02</span><h2>Навести порядок.</h2><p>Оцифрувати діалоги, закрити дірки у воронці та впровадити тверді стандарти роботи.</p><b>↘</b></div></div></section>
    <section className="author wrap section" id="author"><div className="portrait"><img src="/olha-speaker.jpg" alt="Ольга Венгерець" /><span>12 років<small>досвіду</small></span></div><div><p className="kicker">Авторка курсу</p><h2>Ольга Венгерець</h2><p className="authorLead">Експертка з продажів і маркетингу — 12 років практичного досвіду на ринках України та США.</p><p>Авторка навчальних програм, які пройшли 1473 учні. Менторка Дія.Бізнес. Працювала з Netpeak, BetterMe, MacKeeper та Hacken Cybersecurity.</p><div className="stats"><div><b>1473</b><span>учні</span></div><div><b>12</b><span>років досвіду</span></div></div><blockquote>«Без маніпуляцій і шаблонних скриптів — екологічно та з турботою про клієнта»</blockquote></div></section>
    <section className="reviews section" id="reviews"><div className="wrap"><p className="kicker">Результати учнів</p><h2>Кейси після роботи з продажами</h2><div className="reviewGrid">
      <article><div><b>VENHER · EDU</b><span>01</span></div><p>Хотела сказать лично, но напишу: я продала обучение, на червень уже 2 забронировано. С первого запуска я уже отбила твоё обучение 🥰</p><time>13:08</time></article>
      <article><div><b>VENHER · EDU</b><span>02</span></div><p>Це набагато краще ніж попередня реклама)) Враховуючи те, що зроблена вона за вечір — це дуже добре. Дякую щиро тобі!</p><time>15:32</time></article>
      <article><div><b>VENHER · EDU</b><span>03</span></div><p>Зараз прям саме вчасно! Для людей-тривожників, яким треба чіткий план дій. Ви супер! Все занотувала.</p><time>15:47</time></article>
      <article><div><b>VENHER · EDU</b><span>04</span></div><p>Дякую тобі, що сьогодні підсвітила мені та пояснила. Це прям суперцінна інформація, думаю, для усіх.</p><time>21:15</time></article>
      <article><div><b>VENHER · EDU</b><span>05</span></div><p>Дякую безмежне! Ви — супер крута! Це прям туди-туди, дуже відгукнулось за цінностями 🤗</p><time>13:07</time></article>
      <article><div><b>VENHER · EDU</b><span>06</span></div><p>І були продажі: вчора 3 відправили, завтра ще 2 будуть їхати.</p><time>22:24</time></article>
    </div></div></section>
    <footer className="wrap"><a className="brand" href="#top">VENHER · EDU</a><span>Продажі без хаосу та маніпуляцій</span><a href="https://venher-education.space/public-offer" target="_blank" rel="noreferrer">Публічна оферта</a><a href="https://www.instagram.com/olha.venherets/" target="_blank" rel="noreferrer">@olha.venherets ↗</a></footer>
  </main>
}
