import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Layout from '../components/Layout';
import { getCurrentUser } from '../services/authService';
import { getTasks } from '../services/taskService';
import { getUsers } from '../services/userService';
import {
  addGroupMember,
  assignGroupTask,
  createGroupTask,
  getGroupTask,
} from '../services/groupTaskService';

const emptyGroupForm = {
  judul: '',
  deskripsi: '',
  deadline: '',
  status: 'TODO',
  prioritas: 'MEDIUM',
};

function getInitials(name = 'User') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
}

function getType(task) {
  return String(task.type || task.taskType || 'TASK').toUpperCase();
}

function isCurrentUserInGroup(task, userId) {
  if (!userId) return false;
  return (
    task.owner?.id === userId ||
    task.assignedTo?.id === userId ||
    (task.members || []).some((member) => member.id === userId)
  );
}

function GroupsPage() {
  const currentUser = getCurrentUser();
  const [searchParams, setSearchParams] = useSearchParams();
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [message, setMessage] = useState('');
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [form, setForm] = useState(emptyGroupForm);
  const [query, setQuery] = useState(searchParams.get('q') || '');

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    setQuery(searchParams.get('q') || '');
  }, [searchParams]);

  async function loadData() {
    setLoading(true);
    try {
      const [taskData, userData] = await Promise.all([getTasks(), getUsers()]);
      setTasks(Array.isArray(taskData) ? taskData : []);
      setUsers(Array.isArray(userData) ? userData : []);
    } catch (err) {
      console.error('Gagal memuat workspace group:', err);
    } finally {
      setLoading(false);
    }
  }

  function updateSearch(value) {
    setQuery(value);
    const nextParams = new URLSearchParams(searchParams);
    if (value.trim()) nextParams.set('q', value);
    else nextParams.delete('q');
    setSearchParams(nextParams, { replace: true });
  }

  async function openGroup(task) {
    setSelectedUserId('');
    setMessage('');
    try {
      const detail = await getGroupTask(task.id);
      setSelectedGroup(detail);
    } catch (err) {
      console.error('Gagal memuat detail group:', err);
      setSelectedGroup(task);
      setMessage('Detail group belum lengkap, tampilkan data dasar dari task milik akun ini.');
    }
  }

  async function handleCreateGroupTask(e) {
    e.preventDefault();
    if (!form.judul.trim()) return;
    try {
      const created = await createGroupTask({
        judul: form.judul,
        deskripsi: form.deskripsi,
        deadline: form.deadline || null,
        status: form.status,
        prioritas: form.prioritas,
      });
      setShowCreateGroup(false);
      setForm(emptyGroupForm);
      await loadData();
      setSelectedGroup(created);
      setMessage('Group task berhasil dibuat.');
    } catch (err) {
      console.error('Gagal membuat group task:', err);
      setMessage('Gagal membuat group task. Pastikan backend /api/group-tasks aktif.');
    }
  }

  async function handleInviteMember() {
    if (!selectedGroup?.id || !selectedUserId) return;
    try {
      await addGroupMember(selectedGroup.id, selectedUserId);
      const updated = await getGroupTask(selectedGroup.id);
      setSelectedGroup(updated);
      setSelectedUserId('');
      setMessage('Member berhasil ditambahkan.');
      loadData();
    } catch (err) {
      console.error('Gagal invite member:', err);
      setMessage('Gagal menambahkan member. Pastikan user valid dan belum menjadi member.');
    }
  }

  async function handleAssignUser() {
    if (!selectedGroup?.id || !selectedUserId) return;
    try {
      await assignGroupTask(selectedGroup.id, selectedUserId);
      const updated = await getGroupTask(selectedGroup.id);
      setSelectedGroup(updated);
      setSelectedUserId('');
      setMessage('PIC berhasil di-assign.');
      loadData();
    } catch (err) {
      console.error('Gagal assign PIC:', err);
      setMessage('Gagal assign PIC. Pilih user yang valid.');
    }
  }

  const groups = useMemo(() => {
    const userId = currentUser?.id;
    const keyword = query.trim().toLowerCase();

    return tasks
      .filter((task) => getType(task) === 'GROUP')
      .filter((task) => isCurrentUserInGroup(task, userId))
      .filter((task) => {
        if (!keyword) return true;
        const memberText = (task.members || []).map((m) => `${m.nama || ''} ${m.email || ''}`).join(' ');
        const haystack = `${task.judul || ''} ${task.deskripsi || ''} ${task.status || ''} ${task.prioritas || ''} ${memberText} ${task.assignedTo?.nama || ''}`.toLowerCase();
        return haystack.includes(keyword);
      })
      .sort((a, b) => new Date(a.deadline || '9999-12-31') - new Date(b.deadline || '9999-12-31'));
  }, [tasks, query, currentUser]);

  const summary = useMemo(() => {
    const active = groups.filter((task) => task.status !== 'DONE').length;
    const done = groups.filter((task) => task.status === 'DONE').length;
    const assigned = groups.filter((task) => task.assignedTo?.id === currentUser?.id).length;
    const members = new Set();
    groups.forEach((task) => (task.members || []).forEach((member) => members.add(member.id)));
    return { total: groups.length, active, done, assigned, members: members.size };
  }, [groups, currentUser]);

  const availableUsers = users.filter((user) => {
    const members = selectedGroup?.members || [];
    return user.id !== currentUser?.id && !members.some((member) => member.id === user.id);
  });

  return (
    <Layout>
      <section className="page-hero compact-hero groups-hero">
        <div>
          <p className="eyebrow">Collaboration Workspace</p>
          <h1>Groups</h1>
          <p>Kelola group task, undang member, dan assign PIC tanpa mengganggu halaman Kanban.</p>
        </div>
        <button className="primary-btn" onClick={() => setShowCreateGroup(true)}>＋ New Group Task</button>
      </section>

      <section className="group-summary-grid">
        <div className="group-summary-card"><b>{summary.total}</b><span>Total Group</span></div>
        <div className="group-summary-card"><b>{summary.active}</b><span>Active</span></div>
        <div className="group-summary-card"><b>{summary.assigned}</b><span>Assigned to Me</span></div>
        <div className="group-summary-card"><b>{summary.members}</b><span>Unique Members</span></div>
      </section>

      <section className="panel-card page-section groups-panel">
        <div className="groups-toolbar">
          <div>
            <h3>My Group Tasks</h3>
            <p>Group yang kamu buat, kamu ikuti, atau ditugaskan ke akunmu.</p>
          </div>
          <div className="list-search groups-search">
            <span>⌕</span>
            <input
              value={query}
              onChange={(e) => updateSearch(e.target.value)}
              placeholder="Cari group, member, atau PIC..."
            />
          </div>
        </div>

        {loading && <p className="empty-state">Memuat group task...</p>}
        {!loading && groups.length === 0 && (
          <div className="empty-workspace">
            <h3>Belum ada group task untuk akun ini.</h3>
            <p>Buat group task pertama atau minta teman mengundang akunmu sebagai member.</p>
            <button className="primary-btn" onClick={() => setShowCreateGroup(true)}>Buat Group Task</button>
          </div>
        )}

        {!loading && groups.length > 0 && (
          <div className="group-grid">
            {groups.map((task) => (
              <article className="group-workspace-card" key={task.id}>
                <div className="group-card-topline">
                  <span className={`status-pill ${String(task.status || 'TODO').toLowerCase()}`}>{task.status || 'TODO'}</span>
                  <b className={`priority ${String(task.prioritas || 'LOW').toLowerCase()}`}>{task.prioritas || 'LOW'}</b>
                </div>
                <h3>{task.judul || 'Tanpa judul'}</h3>
                <p>{task.deskripsi || 'Tidak ada deskripsi.'}</p>
                <div className="group-card-meta">
                  <span>📅 {task.deadline || '-'}</span>
                  <span>👤 PIC: {task.assignedTo?.nama || 'Belum ada'}</span>
                </div>
                <div className="group-members-preview">
                  <div className="avatar-stack">
                    {(task.members || []).slice(0, 4).map((member) => <span key={member.id}>{getInitials(member.nama)}</span>)}
                    {(task.members || []).length === 0 && <span>＋</span>}
                  </div>
                  <small>{(task.members || []).length} member</small>
                </div>
                <button onClick={() => openGroup(task)}>Kelola Group</button>
              </article>
            ))}
          </div>
        )}
      </section>

      {showCreateGroup && (
        <div className="modal-backdrop">
          <div className="task-modal group-modal">
            <h3>Buat Group Task</h3>
            <p className="modal-subtitle">Group task otomatis dimiliki oleh akun login: {currentUser?.nama || 'User'}.</p>
            <form onSubmit={handleCreateGroupTask}>
              <label>Judul</label>
              <input required value={form.judul} onChange={(e) => setForm({ ...form, judul: e.target.value })} placeholder="Contoh: Project PlanWise" />
              <label>Deskripsi</label>
              <textarea rows={3} value={form.deskripsi} onChange={(e) => setForm({ ...form, deskripsi: e.target.value })} placeholder="Deskripsi group task..." />
              <label>Deadline</label>
              <input type="date" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} />
              <label>Status</label>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                <option value="TODO">To Do</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="REVIEW">Review</option>
                <option value="DONE">Done</option>
              </select>
              <label>Prioritas</label>
              <select value={form.prioritas} onChange={(e) => setForm({ ...form, prioritas: e.target.value })}>
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
              <div className="modal-actions">
                <button type="button" onClick={() => setShowCreateGroup(false)}>Batal</button>
                <button className="primary-btn" type="submit">Buat Group</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedGroup && (
        <div className="modal-backdrop">
          <div className="task-modal group-detail-modal groups-drawer-modal">
            <div className="modal-title-row">
              <div>
                <p className="eyebrow">Group Task</p>
                <h3>{selectedGroup.judul || selectedGroup.title}</h3>
              </div>
              <button onClick={() => setSelectedGroup(null)}>×</button>
            </div>
            <p className="modal-subtitle">{selectedGroup.deskripsi || 'Tidak ada deskripsi.'}</p>

            <div className="group-summary-strip">
              <span><b>{selectedGroup.status || 'TODO'}</b>Status</span>
              <span><b>{selectedGroup.prioritas || '-'}</b>Priority</span>
              <span><b>{selectedGroup.deadline || '-'}</b>Deadline</span>
            </div>

            <section className="collab-section">
              <div className="section-title-row">
                <h4>Members</h4>
                <span>{(selectedGroup.members || []).length}</span>
              </div>
              <div className="member-list">
                {(selectedGroup.members || []).length === 0 && <p>Belum ada member.</p>}
                {(selectedGroup.members || []).map((member) => (
                  <div className="member-row" key={member.id}>
                    <span>{getInitials(member.nama)}</span>
                    <div><strong>{member.nama}</strong><small>{member.email}</small></div>
                  </div>
                ))}
              </div>
            </section>

            <section className="collab-section">
              <h4>Assigned PIC</h4>
              {selectedGroup.assignedTo ? (
                <div className="member-row assigned-row">
                  <span>{getInitials(selectedGroup.assignedTo.nama)}</span>
                  <div><strong>{selectedGroup.assignedTo.nama}</strong><small>{selectedGroup.assignedTo.email}</small></div>
                </div>
              ) : <p className="empty-inline">Belum ada PIC.</p>}
            </section>

            <section className="invite-box">
              <label>Pilih user untuk invite / assign</label>
              <select value={selectedUserId} onChange={(e) => setSelectedUserId(e.target.value)}>
                <option value="">Pilih user...</option>
                {availableUsers.map((user) => <option key={user.id} value={user.id}>{user.nama} — {user.email}</option>)}
                {availableUsers.length === 0 && <option value="" disabled>Semua user sudah masuk member</option>}
              </select>
              <div className="invite-actions">
                <button onClick={handleInviteMember} disabled={!selectedUserId}>＋ Invite Member</button>
                <button onClick={handleAssignUser} disabled={!selectedUserId}>Assign PIC</button>
              </div>
              {message && <p className="group-message">{message}</p>}
            </section>
          </div>
        </div>
      )}
    </Layout>
  );
}

export default GroupsPage;
