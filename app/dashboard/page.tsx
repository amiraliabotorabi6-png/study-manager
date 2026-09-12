export default function DashboardPage() {
  return (
    <main className="dashboard">
      <header className="dashboard-header">
        <div>
          <span className="dashboard-label">STUDY MANAGER</span>
          <h1>داشبورد</h1>
          <p>نمای کلی وضعیت مطالعه و برنامه امروز</p>
        </div>

        <div className="date-card">
          <span>امروز</span>
          <strong>شنبه ۲۱ شهریور</strong>
        </div>
      </header>

      <section className="stats-grid">
        <div className="stat-card">
          <span>مطالعه امروز</span>
          <strong>۰:۰۰</strong>
          <small>از هدف روزانه</small>
        </div>

        <div className="stat-card">
          <span>مطالعه این هفته</span>
          <strong>۰ ساعت</strong>
          <small>مجموع زمان خالص</small>
        </div>

        <div className="stat-card">
          <span>جلسات امروز</span>
          <strong>۰</strong>
          <small>جلسه ثبت‌شده</small>
        </div>

        <div className="stat-card">
          <span>پیشرفت اهداف</span>
          <strong>۰٪</strong>
          <small>درصد تحقق</small>
        </div>
      </section>

      <section className="dashboard-grid">
        <div className="panel large-panel">
          <div className="panel-header">
            <div>
              <h2>روند مطالعه</h2>
              <p>زمان مطالعه خالص در روزهای اخیر</p>
            </div>

            <select defaultValue="week">
              <option value="week">این هفته</option>
              <option value="month">این ماه</option>
              <option value="year">امسال</option>
            </select>
          </div>

          <div className="empty-chart">
            <div className="chart-line" />
            <span>هنوز داده‌ای برای نمایش وجود ندارد</span>
            <small>با ثبت اولین جلسه مطالعه، نمودار فعال می‌شود.</small>
          </div>
        </div>

        <div className="panel">
          <div className="panel-header">
            <div>
              <h2>برنامه امروز</h2>
              <p>جلسات و فعالیت‌های امروز</p>
            </div>
          </div>

          <div className="empty-state">
            <div className="empty-icon">📚</div>
            <strong>برنامه‌ای ثبت نشده</strong>
            <span>برای امروز هنوز جلسه‌ای در برنامه قرار نگرفته است.</span>
            <button>ساخت برنامه</button>
          </div>
        </div>
      </section>

      <section className="dashboard-grid bottom-grid">
        <div className="panel">
          <div className="panel-header">
            <div>
              <h2>اهداف فعال</h2>
              <p>پیگیری اهداف مطالعه</p>
            </div>
          </div>

          <div className="empty-state compact">
            <div className="empty-icon">🎯</div>
            <strong>هدف فعالی وجود ندارد</strong>
            <span>اولین هدف خودت را ایجاد کن.</span>
            <button>ایجاد هدف</button>
          </div>
        </div>

        <div className="panel">
          <div className="panel-header">
            <div>
              <h2>آزمون‌های پیش‌رو</h2>
              <p>نزدیک‌ترین آزمون‌ها</p>
            </div>
          </div>

          <div className="empty-state compact">
            <div className="empty-icon">📝</div>
            <strong>آزمونی ثبت نشده</strong>
            <span>آزمون‌های آینده اینجا نمایش داده می‌شوند.</span>
            <button>ثبت آزمون</button>
          </div>
        </div>
      </section>
    </main>
  );
}
