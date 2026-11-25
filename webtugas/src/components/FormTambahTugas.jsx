import { useState } from 'react';

const FORM_KOSONG = {
  judul: '',
  mataKuliah: '',
  deadline: '',
  prioritas: 'Sedang',
};

function FormTambahTugas({ onTambah }) {
  const [form, setForm] = useState(FORM_KOSONG);
  const [pesanError, setPesanError] = useState('');

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((sebelumnya) => ({ ...sebelumnya, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (form.judul.trim() === '' || form.mataKuliah.trim() === '') {
      setPesanError('Judul tugas dan mata kuliah wajib diisi.');
      return;
    }

    onTambah({
      judul: form.judul.trim(),
      mataKuliah: form.mataKuliah.trim(),
      deadline: form.deadline,
      prioritas: form.prioritas,
    });

    setForm(FORM_KOSONG);
    setPesanError('');
  }

  return (
    <section className="panel form-tugas">
      <h2 className="panel__judul">Tambah Tugas</h2>
      <p className="panel__deskripsi">Isi detail tugas kuliah yang perlu kamu kerjakan.</p>

      <form className="form-tugas__body" onSubmit={handleSubmit} noValidate>
        <div className="field">
          <label htmlFor="judul">Judul tugas</label>
          <input
            id="judul"
            name="judul"
            type="text"
            placeholder="Contoh: Laporan Praktikum Basis Data"
            value={form.judul}
            onChange={handleChange}
          />
        </div>

        <div className="field">
          <label htmlFor="mataKuliah">Mata kuliah</label>
          <input
            id="mataKuliah"
            name="mataKuliah"
            type="text"
            placeholder="Contoh: Pemrograman Web"
            value={form.mataKuliah}
            onChange={handleChange}
          />
        </div>

        <div className="form-tugas__baris">
          <div className="field">
            <label htmlFor="deadline">Tenggat</label>
            <input
              id="deadline"
              name="deadline"
              type="date"
              value={form.deadline}
              onChange={handleChange}
            />
          </div>

          <div className="field">
            <label htmlFor="prioritas">Prioritas</label>
            <select
              id="prioritas"
              name="prioritas"
              value={form.prioritas}
              onChange={handleChange}
            >
              <option value="Tinggi">Tinggi</option>
              <option value="Sedang">Sedang</option>
              <option value="Rendah">Rendah</option>
            </select>
          </div>
        </div>

        {pesanError !== '' && <p className="form-tugas__error">{pesanError}</p>}

        <button type="submit" className="tombol tombol--utama">
          Tambah
        </button>
      </form>
    </section>
  );
}

export default FormTambahTugas;
