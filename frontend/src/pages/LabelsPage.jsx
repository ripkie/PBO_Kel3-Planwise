import { useEffect, useMemo, useState } from 'react';
import Layout from '../components/Layout';
import { createLabel, deleteLabel, getLabels } from '../services/taskService';

const emptyLabelForm = { nama: '', warna: '#996633' };

function LabelsPage() {
  const [labels, setLabels] = useState([]);
  const [form, setForm] = useState(emptyLabelForm);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLabels();
  }, []);

  async function loadLabels() {
    try {
      const data = await getLabels();
      setLabels(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Gagal memuat label:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.nama.trim()) return;
    await createLabel(form);
    setForm(emptyLabelForm);
    loadLabels();
  }

  async function handleDelete(id) {
    if (!confirm('Hapus label ini?')) return;
    await deleteLabel(id);
    loadLabels();
  }

  const labelPreview = useMemo(() => form.nama.trim() || 'Preview Label', [form.nama]);

  return (
    <Layout>
      <section className="page-hero labels-hero">
        <div>
          <p className="eyebrow">Workspace Labels</p>
          <h1>Labels</h1>
          <p>Buat label berwarna untuk mengelompokkan task berdasarkan mata kuliah, project, atau prioritas kerja.</p>
        </div>
        <div className="label-preview-card">
          <span style={{ background: form.warna }} />
          <div>
            <small>Preview</small>
            <strong>{labelPreview}</strong>
          </div>
        </div>
      </section>

      <section className="labels-layout page-section">
        <div className="panel-card label-create-card">
          <h2>Tambah Label Baru</h2>
          <p>Gunakan nama singkat agar label mudah terbaca di task card.</p>

          <form className="label-create-form" onSubmit={handleSubmit}>
            <label>Nama Label</label>
            <input
              placeholder="Contoh: PBO, Database, Urgent"
              value={form.nama}
              onChange={(e) => setForm({ ...form, nama: e.target.value })}
            />

            <label>Warna Label</label>
            <div className="color-row">
              <input
                type="color"
                value={form.warna}
                onChange={(e) => setForm({ ...form, warna: e.target.value })}
              />
              <span>{form.warna}</span>
            </div>

            <button className="primary-btn" type="submit">＋ Tambah Label</button>
          </form>
        </div>

        <div className="panel-card label-list-card">
          <div className="panel-title-row">
            <div>
              <h2>Daftar Label</h2>
              <p>{labels.length} label tersimpan di backend.</p>
            </div>
          </div>

          {loading && <p className="empty-state">Memuat label...</p>}
          {!loading && labels.length === 0 && (
            <div className="empty-label-state">
              <div>🏷️</div>
              <h3>Belum ada label</h3>
              <p>Tambahkan label pertama untuk mulai mengelompokkan task.</p>
            </div>
          )}

          {!loading && labels.length > 0 && (
            <div className="label-card-grid">
              {labels.map((label) => (
                <article className="modern-label-card" key={label.id}>
                  <div className="label-card-top">
                    <span style={{ background: label.warna }} />
                    <button onClick={() => handleDelete(label.id)}>Hapus</button>
                  </div>
                  <h3>{label.nama}</h3>
                  <p>Warna: {label.warna}</p>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}

export default LabelsPage;
