# PlanWise

PlanWise adalah aplikasi manajemen tugas dan kolaborasi tim berbasis web yang membantu pengguna mengatur pekerjaan, memantau progres proyek, mengelola deadline, serta berkolaborasi dalam tugas kelompok melalui antarmuka yang modern dan mudah digunakan.

## 🚀 Fitur Utama

### Authentication

* Login & Register pengguna
* Role-based access (Admin & User)
* Session management

### Dashboard

* Ringkasan tugas pengguna
* Statistik task
* Upcoming deadlines
* Progress overview
* Recent activity

### Task Management

* Membuat task baru
* Mengubah detail task
* Menghapus task
* Mengatur prioritas task
* Menentukan deadline
* Filter & sorting task

### Kanban Board

* To Do
* In Progress
* Review
* Done

### Labels

* Membuat label khusus
* Menambahkan label ke task
* Filter berdasarkan label

### History

* Riwayat perubahan task
* Tracking aktivitas pengguna

### Group Workspace

* Membuat group task
* Menambahkan anggota ke group
* Assign task ke anggota tertentu
* Kolaborasi dalam satu workspace

### Ownership System

* Setiap user hanya dapat melihat task miliknya sendiri
* Data task terisolasi antar pengguna
* Group task hanya dapat diakses oleh member group terkait

---

## 🛠️ Tech Stack

### Frontend

* React
* Vite
* React Router
* Axios
* Tailwind CSS

### Backend

* Spring Boot
* Spring Data JPA
* Hibernate
* Maven

### Database

* MySQL

---

## 📂 Project Structure

```text
planwise-website
│
├── frontend
│   ├── src
│   ├── components
│   ├── pages
│   ├── services
│   └── layouts
│
├── backend
│   ├── controller
│   ├── service
│   ├── repository
│   ├── entity
│   └── dto
│
└── database
```

---

## ⚙️ Installation

### Clone Repository

```bash
git clone <repository-url>
cd planwise-website
```

### Backend

```bash
cd backend
./mvnw spring-boot:run
```

Backend berjalan pada:

```text
http://localhost:8080
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend berjalan pada:

```text
http://localhost:5173
```

---

## 📌 API Endpoints

### Authentication

```http
POST /api/auth/register
POST /api/auth/login
```

### Tasks

```http
GET    /api/tasks
GET    /api/tasks/my/{userId}
POST   /api/tasks
PUT    /api/tasks/{id}
DELETE /api/tasks/{id}
```

### Labels

```http
GET    /api/labels
POST   /api/labels
DELETE /api/labels/{id}
```

### Group Tasks

```http
POST /api/group-tasks
GET  /api/group-tasks/{id}
POST /api/group-tasks/{taskId}/members/{userId}
POST /api/group-tasks/{taskId}/assign/{userId}
```

---

## 👨‍💻 Team

Project ini dikembangkan sebagai tugas mata kuliah Pemrograman Berorientasi Objek (PBO).

### Kelompok PlanWise

* Rifki
* Hakim
* Zhahir
* Ihsan
* Sylva

---

## 📈 Future Development

* Drag & Drop Kanban Board
* Real-time Notification
* Calendar Synchronization
* Team Workspace Dashboard
* Email Reminder
* Task Analytics
* Dark Mode
* Mobile Responsive Optimization

---

## 📄 License

Project ini dikembangkan untuk keperluan akademik dan pembelajaran.
