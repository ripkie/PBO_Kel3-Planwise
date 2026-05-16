# PlanWise Backend Structure Documentation

## Overview

Backend PlanWise menggunakan:

* Spring Boot
* Spring Data JPA
* PostgreSQL (Supabase)
* Layered Architecture

Struktur project dibuat agar:

* rapi
* scalable
* mudah maintenance
* mudah teamwork
* cocok untuk fullstack modern development

---

# Struktur Folder

```text
com.planwise.backend
├── config
├── controller
├── dto
├── entity
├── enums
├── exception
├── interfaces
├── repository
├── service
└── BackendApplication.java
```

---

# 1. controller/

Tempat endpoint API.

Controller menerima request dari frontend React lalu mengembalikan response JSON.

Contoh endpoint:

* GET /tasks
* POST /tasks
* DELETE /tasks/1

Contoh file:

* TaskController.java
* AuthController.java
* UserController.java

Tugas utama:

* menerima request
* validasi ringan
* memanggil service
* return response

---

# 2. service/

Tempat business logic aplikasi.

Semua logic utama diletakkan di service agar controller tetap bersih.

Contoh:

* login user
* create task
* assign task
* update progress

Contoh file:

* TaskService.java
* AuthService.java

---

# 3. repository/

Layer untuk komunikasi database PostgreSQL menggunakan Spring Data JPA.

Repository bertugas:

* save data
* delete data
* query database

Contoh:

* TaskRepository.java
* UserRepository.java

Biasanya menggunakan:

```java
extends JpaRepository<Entity, ID>
```

---

# 4. entity/

Representasi tabel database.

Setiap entity = satu tabel PostgreSQL.

Contoh:

* User.java
* Task.java
* Label.java

Biasanya menggunakan:

```java
@Entity
@Table(name = "tasks")
```

---

# 5. dto/

DTO = Data Transfer Object.

Digunakan untuk:

* request body
* response body
* validasi data API

Tujuan:

* entity database tidak langsung diexpose ke frontend

Contoh:

* LoginRequestDTO.java
* TaskResponseDTO.java
* CreateTaskDTO.java

---

# 6. enums/

Tempat enum/constants.

Digunakan agar value konsisten.

Contoh:

* TaskStatus
* Priority
* Role

Contoh:

```java
public enum TaskStatus {
    TODO,
    IN_PROGRESS,
    DONE
}
```

---

# 7. config/

Tempat konfigurasi aplikasi.

Biasanya berisi:

* SecurityConfig
* CorsConfig
* JWT Config
* Swagger Config

Fungsi:

* setup security
* setup CORS
* konfigurasi global backend

---

# 8. exception/

Tempat custom exception dan global error handler.

Tujuan:

* response error lebih rapi
* mudah debugging
* frontend mendapat JSON error yang jelas

Contoh:

* ResourceNotFoundException.java
* UnauthorizedException.java
* GlobalExceptionHandler.java

---

# 9. interfaces/

Tempat interface abstraction.

Biasanya dipakai untuk:

* service interface
* reusable contract

Contoh:

```java
public interface TaskService {
    List<Task> getAllTasks();
}
```

---

# 10. resources/

Berisi resource backend.

Paling penting:

```text
application.properties
```

Digunakan untuk:

* koneksi database
* port backend
* JWT secret
* konfigurasi Spring Boot

---

# 11. BackendApplication.java

Main entry point Spring Boot.

Dijalankan menggunakan:

```bash
./mvnw spring-boot:run
```

Fungsi:

* start backend server
* initialize Spring Boot application

---

# Backend Flow

```text
Frontend React
      ↓
Controller
      ↓
Service
      ↓
Repository
      ↓
PostgreSQL (Supabase)
```

---

# Teknologi yang Digunakan

## Frontend

* React
* Vite
* Axios
* React Router DOM
* Bootstrap

## Backend

* Spring Boot
* Spring Data JPA
* PostgreSQL
* Maven
* Lombok

## Database

* Supabase PostgreSQL

---

# Current Project Status

✅ Frontend setup selesai
✅ Backend setup selesai
✅ Supabase connected
✅ Struktur backend clean architecture selesai
✅ Ready untuk CRUD API development
