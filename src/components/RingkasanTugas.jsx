function RingkasanTugas({ daftarTugas }) {
  const total = daftarTugas.length;
  const selesai = daftarTugas.filter((tugas) => tugas.selesai).length;
  const belumSelesai = total - selesai;
  const prioritasTinggi = daftarTugas.filter(
    (tugas) => !tugas.selesai && tugas.prioritas === 'Tinggi'
  ).length;
  const persentase = total === 0 ? 0 : Math.round((selesai / total) * 100);

  const kartuRingkasan = [
    { label: 'Total Tugas', nilai: total, varian: 'netral' },
    { label: 'Sudah Selesai', nilai: selesai, varian: 'selesai' },
    { label: 'Belum Selesai', nilai: belumSelesai, varian: 'belum' },
    { label: 'Prioritas Tinggi', nilai: prioritasTinggi, varian: 'tinggi' },
  ];

  return (
    <section className="ringkasan" aria-label="Ringkasan tugas">
      <div className="ringkasan__grid">
        {kartuRingkasan.map((kartu) => (
          <div className={`ringkasan__kartu ringkasan__kartu--${kartu.varian}`} key={kartu.label}>
            <span className="ringkasan__nilai">{kartu.nilai}</span>
            <span className="ringkasan__label">{kartu.label}</span>
          </div>
        ))}
      </div>

      <div className="ringkasan__progres">
        <div className="ringkasan__progres-teks">
          <span>Progres penyelesaian</span>
          <strong>{persentase}%</strong>
        </div>
        <div
          className="ringkasan__bar"
          role="progressbar"
          aria-valuenow={persentase}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Progres penyelesaian tugas"
        >
          <div className="ringkasan__bar-isi" style={{ width: `${persentase}%` }} />
        </div>
      </div>
    </section>
  );
}

export default RingkasanTugas;
