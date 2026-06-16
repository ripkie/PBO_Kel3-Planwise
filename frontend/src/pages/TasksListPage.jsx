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

function getPriorityClass(priority) {
  return `priority ${(priority || 'LOW').toLowerCase()}`;
}

function getType(task) {
  return String(task.type || task.taskType || 'TASK').toUpperCase();
}

function getInitials(name = 'User') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
}

function isAssignedToCurrentUser(task, currentUser) {
  return Boolean(currentUser?.id && task?.assignedTo?.id === currentUser.id);
}

function TasksListPage() {
  const currentUser = getCurrentUser();
  const [searchParams, setSearchParams] = useSearchParams();
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [groupMessage, setGroupMessage] = useState('');
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [groupForm, setGroupForm] = useState(emptyGroupForm);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    setQuery(searchParams.get('q') || '');
  }, [searchParams]);

  function updateQuery(value) {
    setQuery(value);
    const nextParams = new URLSearchParams(searchParams);
    if (value.trim()) {
      nextParams.set('q', value);
    } else {
      nextParams.delete('q');
    }
    setSearchParams(nextParams, { replace: true });
  }

  async function loadData() {
    setLoading(true);
    try {
      const [taskData, userData] = await Promise.all([getTasks(), getUsers()]);
      setTasks(Array.isArray(taskData) ? taskData : []);
      setUsers(Array.isArray(userData) ? userData : []);
    } catch (err) {
      console.error('Gagal memuat task/user:', err);
    } finally {
      setLoading(false);
    }
  }

  async function openGroupDetail(task) {
    setGroupMessage('');
    setSelectedUserId('');
    try {
      const detail = await getGroupTask(task.id);
      setSelectedGroup(detail);
    } catch (err) {
      console.error('Gagal memuat detail group task:', err);
      setSelectedGroup({ ...task, members: [], assignedTo: null });
      setGroupMessage('Detail group belum bisa dimuat, tetapi data dasar task tetap ditampilkan.');
    }
  }

  async function handleCreateGroupTask(e) {
    e.preventDefault();
    if (!groupForm.judul.trim()) return;
    try {
      const created = await createGroupTask({
        judul: groupForm.judul,
        deskripsi: groupForm.deskripsi,
        deadline: groupForm.deadline || null,
        status: groupForm.status,
        prioritas: groupForm.prioritas,
      });
      setShowCreateGroup(false);
      setGroupForm(emptyGroupForm);
      await loadData();
      setSelectedGroup(created);
    } catch (err) {
      console.error('Gagal membuat group task:', err);
      setGroupMessage('Gagal membuat group task. Cek koneksi backend atau console.');
    }
  }

  async function handleInviteMember() {
    if (!selectedGroup?.id || !selectedUserId) return;
    try {
      await addGroupMember(selectedGroup.id, selectedUserId);
      const updated = await getGroupTask(selectedGroup.id);
      setSelectedGroup(updated);
      setGroupMessage('Member berhasil ditambahkan.');
      setSelectedUserId('');
      loadData();
    } catch (err) {
      console.error('Gagal invite member:', err);
      setGroupMessage('Gagal menambahkan member. Pastikan user belum ditambahkan dan task bertipe GROUP.');
    }
  }

  async function handleAssignUser() {
    if (!selectedGroup?.id || !selectedUserId) return;
    try {
      await assignGroupTask(selectedGroup.id, selectedUserId);
      const updated = await getGroupTask(selectedGroup.id);
      setSelectedGroup(updated);
      setGroupMessage('Task berhasil di-assign.');
      setSelectedUserId('');
      loadData();
    } catch (err) {
      console.error('Gagal assign user:', err);
      setGroupMessage('Gagal assign task. Pilih user yang valid.');
    }
  }

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const labelText = (task.labels || []).map((label) => label.nama || '').join(' ');
      const memberText = (task.members || []).map((member) => `${member.nama || ''} ${member.email || ''}`).join(' ');
      const ownerText = `${task.owner?.nama || ''} ${task.owner?.email || ''}`;
      const assignedText = `${task.assignedTo?.nama || ''} ${task.assignedTo?.email || ''}`;
      const keyword = `${task.judul || ''} ${task.deskripsi || ''} ${task.status || ''} ${task.prioritas || ''} ${labelText} ${memberText} ${ownerText} ${assignedText}`.toLowerCase();
      const matchQuery = keyword.includes(query.toLowerCase());
      const matchStatus = status ? task.status === status : true;
      const matchPriority = priority ? task.prioritas === priority : true;
      const type = getType(task);
      const matchTab =
        activeTab === 'all' ? true
          : activeTab === 'group' ? type === 'GROUP'
          : activeTab === 'deadline' ? type === 'DEADLINE' || Boolean(task.isOverdue)
          : activeTab === 'assigned' ? isAssignedToCurrentUser(task, currentUser)
          : type === 'PERSONAL' || type === 'TASK';
      return matchQuery && matchStatus && matchPriority && matchTab;
    });
  }, [tasks, query, status, priority, activeTab, currentUser]);

  const summary = useMemo(() => ({
    total: tasks.length,
    personal: tasks.filter((task) => ['PERSONAL', 'TASK'].includes(getType(task))).length,
    group: tasks.filter((task) => getType(task) === 'GROUP').length,
    deadline: tasks.filter((task) => getType(task) === 'DEADLINE' || task.isOverdue).length,
    assigned: tasks.filter((task) => isAssignedToCurrentUser(task, currentUser)).length,
  }), [tasks, currentUser]);

  const availableUsers = users.filter((user) => {
    const members = selectedGroup?.members || [];
    return !members.some((member) => member.id === user.id);
  });

  return (
    <Layout>
      <section className="page-hero compact-hero tasks-hero-pro">
        <div>
          <p className="eyebrow">Task Workspace</p>
          <h1>My Tasks</h1>
          <p>Task di halaman ini sudah difilter berdasarkan akun login: {currentUser?.nama || 'User'}.</p>
        </div>
        <div className="hero-actions-stack">
          <div className="hero-metrics">
            <span><b>{summary.total}</b>Total Saya</span>
            <span><b>{summary.group}</b>Group</span>
            <span><b>{summary.assigned}</b>Assigned</span>
          </div>
          <button className="primary-btn" onClick={() => setShowCreateGroup(true)}>＋ New Group Task</button>
        </div>
      </section>

      <section className="panel-card page-section task-list-panel tasks-workspace-panel">
        <div className="task-tabs">
          <button className={activeTab === 'all' ? 'active' : ''} onClick={() => setActiveTab('all')}>All Tasks <span>{summary.total}</span></button>
          <button className={activeTab === 'personal' ? 'active' : ''} onClick={() => setActiveTab('personal')}>Personal <span>{summary.personal}</span></button>
          <button className={activeTab === 'group' ? 'active' : ''} onClick={() => setActiveTab('group')}>Group <span>{summary.group}</span></button>
          <button className={activeTab === 'assigned' ? 'active' : ''} onClick={() => setActiveTab('assigned')}>Assigned <span>{summary.assigned}</span></button>
          <button className={activeTab === 'deadline' ? 'active' : ''} onClick={() => setActiveTab('deadline')}>Deadline <span>{summary.deadline}</span></button>
        </div>

        <div className="list-toolbar pro-toolbar">
          <div className="list-search">
            <span>⌕</span>
            <input
              placeholder="Cari task milik akun ini..."
              value={query}
              onChange={(e) => updateQuery(e.target.value)}
            />
          </div>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">Semua Status</option>
            <option value="TODO">To Do</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="REVIEW">Review</option>
            <option value="DONE">Done</option>
          </select>
          <select value={priority} onChange={(e) => setPriority(e.target.value)}>
            <option value="">Semua Prioritas</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>
        </div>

        {loading && <p className="empty-state">Memuat task...</p>}
        {!loading && filteredTasks.length === 0 && <p className="empty-state">Belum ada task yang sesuai filter untuk akun ini.</p>}

        {!loading && filteredTasks.length > 0 && (
          <div className="task-card-grid-pro">
            {filteredTasks.map((task) => {
              const type = getType(task);
              const isGroup = type === 'GROUP';
              return (
                <article className={`task-pro-card ${isGroup ? 'group-card' : ''}`} key={task.id}>
                  <div className="task-pro-top">
                    <span className={`type-badge ${type.toLowerCase()}`}>{type}</span>
                    <span className={`status-pill ${String(task.status || 'TODO').toLowerCase()}`}>{task.status || 'TODO'}</span>
                  </div>

                  <h3>{task.judul || 'Tanpa judul'}</h3>
                  <p>{task.deskripsi || 'Tidak ada deskripsi.'}</p>

                  <div className="task-pro-meta">
                    <span>📅 {task.deadline || 'Tidak ada deadline'}</span>
                    <b className={getPriorityClass(task.prioritas)}>{task.prioritas || 'LOW'}</b>
                  </div>

                  {isGroup ? (
                    <div className="collab-preview">
                      <div className="avatar-stack">
                        {(task.members || []).slice(0, 3).map((member) => (
                          <span key={member.id}>{getInitials(member.nama)}</span>
                        ))}
                        {(task.members || []).length === 0 && <span>＋</span>}
                      </div>
                      <small>{(task.members || []).length || 0} member · PIC: {task.assignedTo?.nama || 'Belum ada'}</small>
                    </div>
                  ) : (
                    <div className="solo-preview">Owner: {task.owner?.nama || currentUser?.nama || 'Saya'}</div>
                  )}

                  <div className="task-pro-actions">
                    {isGroup ? (
                      <button onClick={() => openGroupDetail(task)}>Kelola Group</button>
                    ) : (
                      <button disabled>Personal Task</button>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {showCreateGroup && (
        <div className="modal-backdrop">
          <div className="task-modal group-modal">
            <h3>Buat Group Task</h3>
            <p className="modal-subtitle">Task ini akan dimiliki oleh akun login dan bisa memiliki member/PIC.</p>
            <form onSubmit={handleCreateGroupTask}>
              <label>Judul</label>
              <input
                required
                value={groupForm.judul}
                onChange={(e) => setGroupForm({ ...groupForm, judul: e.target.value })}
                placeholder="Contoh: Project PlanWise"
              />
              <label>Deskripsi</label>
              <textarea
                rows={3}
                value={groupForm.deskripsi}
                onChange={(e) => setGroupForm({ ...groupForm, deskripsi: e.target.value })}
                placeholder="Deskripsi tugas kelompok..."
              />
              <label>Deadline</label>
              <input
                type="date"
                value={groupForm.deadline}
                onChange={(e) => setGroupForm({ ...groupForm, deadline: e.target.value })}
              />
              <label>Status</label>
              <select value={groupForm.status} onChange={(e) => setGroupForm({ ...groupForm, status: e.target.value })}>
                <option value="TODO">To Do</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="REVIEW">Review</option>
                <option value="DONE">Done</option>
              </select>
              <label>Prioritas</label>
              <select value={groupForm.prioritas} onChange={(e) => setGroupForm({ ...groupForm, prioritas: e.target.value })}>
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
              <div className="modal-actions">
                <button type="button" onClick={() => setShowCreateGroup(false)}>Batal</button>
                <button className="primary-btn" type="submit">Buat Group Task</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedGroup && (
        <div className="modal-backdrop">
          <div className="task-modal group-detail-modal">
            <div className="modal-title-row">
              <div>
                <p className="eyebrow">Group Task</p>
                <h3>{selectedGroup.judul || selectedGroup.title}</h3>
              </div>
              <button onClick={() => setSelectedGroup(null)}>×</button>
            </div>

            <p className="modal-subtitle">{selectedGroup.deskripsi || selectedGroup.description || 'Tidak ada deskripsi.'}</p>

            <div className="group-summary-strip">
              <span><b>{selectedGroup.status || 'TODO'}</b>Status</span>
              <span><b>{selectedGroup.prioritas || selectedGroup.priority || '-'}</b>Priority</span>
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
                    <div>
                      <strong>{member.nama}</strong>
                      <small>{member.email}</small>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="collab-section">
              <h4>Assigned To</h4>
              {selectedGroup.assignedTo ? (
                <div className="member-row assigned-row">
                  <span>{getInitials(selectedGroup.assignedTo.nama)}</span>
                  <div>
                    <strong>{selectedGroup.assignedTo.nama}</strong>
                    <small>{selectedGroup.assignedTo.email}</small>
                  </div>
                </div>
              ) : (
                <p className="empty-inline">Belum ada PIC.</p>
              )}
            </section>

            <section className="invite-box">
              <label>Pilih user</label>
              <select value={selectedUserId} onChange={(e) => setSelectedUserId(e.target.value)}>
                <option value="">Pilih anggota...</option>
                {availableUsers.map((user) => (
                  <option key={user.id} value={user.id}>{user.nama} — {user.email}</option>
                ))}
                {availableUsers.length === 0 && <option value="" disabled>Semua user sudah menjadi member</option>}
              </select>
              <div className="invite-actions">
                <button onClick={handleInviteMember} disabled={!selectedUserId}>＋ Invite Member</button>
                <button onClick={handleAssignUser} disabled={!selectedUserId}>Assign PIC</button>
              </div>
              {groupMessage && <p className="group-message">{groupMessage}</p>}
            </section>
          </div>
        </div>
      )}
    </Layout>
  );
}

export default TasksListPage;
