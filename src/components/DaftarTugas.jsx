import KartuTugas from './KartuTugas';

function DaftarTugas({ daftarTugas, onToggleSelesai, onHapus }) {
  return (
    <section className="panel daftar-tugas">
      <div className="daftar-tugas__kepala">
        <h2 className="panel__judul">Daftar Tugas</h2>
        <span className="daftar-tugas__jumlah">{daftarTugas.length} tugas</span>
      </div>

      {daftarTugas.length === 0 ? (
        <div className="daftar-tugas__kosong">
          <span className="daftar-tugas__kosong-ikon" aria-hidden="true">
            🗒️
          </span>
          <p className="daftar-tugas__kosong-judul">Belum ada data Tugas</p>
          <p className="daftar-tugas__kosong-teks">
            Tambahkan tugas pertamamu melalui form di samping.
          </p>
        </div>
      ) : (
        <ul className="daftar-tugas__list">
          {daftarTugas.map((tugas) => (
            <li key={tugas.id}>
              <KartuTugas
                tugas={tugas}
                onToggleSelesai={onToggleSelesai}
                onHapus={onHapus}
              />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default DaftarTugas;
