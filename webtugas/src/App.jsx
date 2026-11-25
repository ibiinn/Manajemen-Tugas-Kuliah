import { useState } from 'react';
import Header from './components/Header';
import RingkasanTugas from './components/RingkasanTugas';
import FormTambahTugas from './components/FormTambahTugas';
import DaftarTugas from './components/DaftarTugas';
import tugasAwal from './data/tugasAwal';

function App() {
  const [daftarTugas, setDaftarTugas] = useState(tugasAwal);

  function tambahTugas(dataTugas) {
    const tugasBaru = {
      id: Date.now(),
      ...dataTugas,
      selesai: false,
    };

    setDaftarTugas((sebelumnya) => [tugasBaru, ...sebelumnya]);
  }

  function toggleSelesai(id) {
    setDaftarTugas((sebelumnya) =>
      sebelumnya.map((tugas) =>
        tugas.id === id ? { ...tugas, selesai: !tugas.selesai } : tugas
      )
    );
  }

  function hapusTugas(id) {
    setDaftarTugas((sebelumnya) => sebelumnya.filter((tugas) => tugas.id !== id));
  }

  return (
    <div className="app">
      <Header />

      <main className="app__main">
        <RingkasanTugas daftarTugas={daftarTugas} />

        <div className="app__grid">
          <FormTambahTugas onTambah={tambahTugas} />
          <DaftarTugas
            daftarTugas={daftarTugas}
            onToggleSelesai={toggleSelesai}
            onHapus={hapusTugas}
          />
        </div>
      </main>

      <footer className="app__footer">
        Manajemen Tugas Kuliah · Tugas 6 React Dasar
      </footer>
    </div>
  );
}

export default App;
