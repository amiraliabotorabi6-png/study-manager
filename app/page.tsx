export default function Home() {
  return (
    <main>
      <section className="hero">
        <div>
          <span className="badge">STUDY MANAGER</span>

          <h1>
            مسیر مطالعه‌ات،
            <br />
            هوشمندتر از همیشه
          </h1>

          <p>
            برنامه‌ریزی، مطالعه، آزمون، تحلیل و پیشرفت
            <br />
            همه در یک سیستم یکپارچه.
          </p>

          <div className="buttons">
            <button>شروع مطالعه</button>
            <button className="secondary">مشاهده داشبورد</button>
          </div>
        </div>

        <div className="hero-card">
          <span>مطالعه امروز</span>
          <strong>۰:۰۰</strong>
          <small>از هدف روزانه</small>

          <div className="progress">
            <div />
          </div>

          <div className="mini-stats">
            <div>
              <b>۰</b>
              <span>جلسه</span>
            </div>

            <div>
              <b>۰٪</b>
              <span>پیشرفت</span>
            </div>
          </div>
        </div>
      </section>

      <section className="features">
        <div>
          <span>⏱</span>
          <h3>تایمر مطالعه</h3>
          <p>ثبت دقیق زمان مطالعه و جلسات</p>
        </div>

        <div>
          <span>📊</span>
          <h3>تحلیل پیشرفت</h3>
          <p>بررسی روند مطالعه و نتایج آزمون‌ها</p>
        </div>

        <div>
          <span>🗓</span>
          <h3>برنامه‌ریزی</h3>
          <p>ساخت برنامه متناسب با زمان واقعی</p>
        </div>

        <div>
          <span>🎯</span>
          <h3>اهداف</h3>
          <p>پیگیری اهداف کوتاه‌مدت و بلندمدت</p>
        </div>
      </section>
    </main>
  );
}
