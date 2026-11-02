function Header() {
  const tanggalHariIni = new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <header className="app-header">
      <div className="app-header__text">
        <p className="app-header__eyebrow">Pemrograman Web · Bab 6 React Dasar</p>
        <h1 className="app-header__title">Manajemen Tugas Kuliah</h1>
        <p className="app-header__subtitle">
          Catat tugas, pantau tenggatnya, dan tandai yang sudah selesai.
        </p>
      </div>
      <div className="app-header__badge">
        <span className="app-header__badge-label">Hari ini</span>
        <span className="app-header__badge-value">{tanggalHariIni}</span>
      </div>
    </header>
  );
}

export default Header;
