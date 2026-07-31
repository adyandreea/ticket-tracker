<h1 align="center"><strong><em>TicketTracker - Kanban Management System</strong></em></h1>

<p align="center">

  <img src="https://cdn-icons-png.flaticon.com/512/17008/17008681.png" alt="kanban-board-logo" height="300" width="300">

</p>



# 📖 Overview

**TicketTracker** is a professional task management application built with **Spring Boot** and **React**. It features a dynamic Kanban board, multi-language support (i18n), and a robust administrative system for project assignments and user management.



# 🚀 How to run the app?



### Backend (Spring Boot)

* Create a MySQL schema named `kanban_db`.

* Update `src/main/resources/application.properties` with your DB username and password.

* Run the application using your IDE or `./mvnw spring-boot:run`.



### Frontend (React)

* Navigate to the frontend folder: `cd frontend`

* Install dependencies: `npm install`

* Start the app: `npm start`



---



<h1 align="center"><strong>Demonstration</strong></h1>



<h2 align="center"><strong>🚀 Main Dashboard</strong></h2>

<p align="center">
  <img src="demo/dashboard.png" width="1000" alt="Dashboard" style="border-radius: 10px; box-shadow: 0px 4px 10px rgba(0,0,0,0.2);">
  <br>
  <br>
  <em>Manage your tasks effortlessly across <code>TODO</code>, <code>In Progress</code>, and <code>DONE</code> columns with a clean, intuitive Kanban interface.</em>
</p>



<h2 align="center"><strong>🔐 Admin Permissions & Security</strong></h2>

<table align="center">
  <tr>
    <td align="center" valign="top" width="50%">
      <img src="demo/permissions.png" alt="Permissions" style="border-radius: 8px; border: 1px solid #ddd;">
      <br>
      <strong>Project Permissions</strong>
      <p>Assign users to specific projects.</p>
    </td>
    <td align="center" valign="top" width="50%">
      <img src="demo/manage_users.png" alt="Manage Users" style="border-radius: 8px; border: 1px solid #ddd;">
      <br>
      <strong>User Management</strong>
      <p>Admins can register new members and manage system access.</p>
    </td>
  </tr>
</table>



<h2 align="center"><strong>User & Ticket Details</strong></h2>
<table align="center">
  <tr>
    <td align="center">
      <img src="demo/user_profile.png" width="450px" alt="User Profile"><br>
      <em>User Settings & Profile</em>
    </td>
    <td align="center">
      <img src="demo/ticket_details.png" width="450px" alt="Ticket Details"><br>
      <em>Detailed Ticket View</em>
    </td>
  </tr>
</table>



---



## ✨ Key Features

* **Full CRUD:** Create, edit, and delete Projects, Boards, and Tickets.

* **Role-Based Access:** Specialized views for Admins, Managers, and Users.

* **Internationalization:** Easily switch between languages (i18n).

* **Profile Management:** Users can update their avatars and view personal information.

* **Testing:** Unit and integration tests ensuring code quality and reliability.
  
* **Containerization:** Fully dockerized setup for consistent development and production environments.

* **CI/CD Pipeline:** Automated build, test, and deployment workflows using GitHub Actions.



## 🛠️ Tech Stack

* **Frontend:** React.js, i18next, Material UI.

* **Backend:** Java, Spring Boot, Maven, Spring Security (JWT/Session).

* **Testing:** JUnit, Mockito.

* **Database:** MySQL / Hibernate JPA.

* **DevOps & Infrastructure:** Docker, GitHub Actions (CI/CD).
