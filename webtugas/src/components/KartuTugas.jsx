function formatTanggal(tanggalIso) {
  if (!tanggalIso) {
    return 'Tanpa tenggat';
  }

  return new Date(`${tanggalIso}T00:00:00`).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function KartuTugas({ tugas, onToggleSelesai, onHapus }) {
  const kelasPrioritas = tugas.prioritas.toLowerCase();

  return (
    <article className={`kartu-tugas ${tugas.selesai ? 'kartu-tugas--selesai' : ''}`}>
      <div className="kartu-tugas__atas">
        <span className={`badge badge--${kelasPrioritas}`}>{tugas.prioritas}</span>
        <span className={`badge badge--status ${tugas.selesai ? 'badge--selesai' : ''}`}>
          {tugas.selesai ? 'Selesai' : 'Belum selesai'}
        </span>
      </div>

      <h3 className="kartu-tugas__judul">{tugas.judul}</h3>

      <dl className="kartu-tugas__detail">
        <div>
          <dt>Mata kuliah</dt>
          <dd>{tugas.mataKuliah}</dd>
        </div>
        <div>
          <dt>Tenggat</dt>
          <dd>{formatTanggal(tugas.deadline)}</dd>
        </div>
      </dl>

      <div className="kartu-tugas__aksi">
        <button type="button" className="tombol tombol--kecil" onClick={() => onToggleSelesai(tugas.id)}>
          {tugas.selesai ? 'Batalkan selesai' : 'Tandai selesai'}
        </button>
        <button
          type="button"
          className="tombol tombol--kecil tombol--bahaya"
          onClick={() => onHapus(tugas.id)}
        >
          Hapus
        </button>
      </div>
    </article>
  );
}

export default KartuTugas;
