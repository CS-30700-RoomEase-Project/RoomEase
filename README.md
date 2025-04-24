# RoomEase

**CS 307 Software Engineering Project (Group 15)**

---

## 📖 Overview

RoomEase is a web application that allows users easily communicate with their roommates

---

## ⚙️ Tech Stack

- **Backend**: Node.js, Express  
- **Frontend**: React, CSS Modules  
- **API Calls**: `CallService` from `SharedMethods`  
- **Popup UI**: `reactjs-popup`  

---

## 🚀 Getting Started

### Prerequisites

- Node.js ≥ 14.x  
- npm ≥ 6.x  

### Installation

1. **Clone the repository**  
   ```bash
   git clone https://github.com/your-org/roomease.git
   cd roomease
   ```

2. **Install Dependencies**
    ```bash
    npm install
    cd backend && npm install && cd ../frontend && npm install && cd ..
    ```

3. **Run the backend**
    ```bash
    cd backend
    node index.js
    ```

4. **Run the frontend**
    ```bash 
    cd frontend
    npm start
    ```

### Project Structure

```plaintext
roomease/
├── backend/
│   ├── index.js
│   ├── routes/
│   └── controllers/
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/
│       │   ├── Pages/
│       │   │   ├── Dashboard.js
│       │   │   ├── RoomState/
│       │   │   │   ├── RoomState.js
│       │   │   │   └── RoomState.module.css
│       │   │   └── SubmitDispute/
│       │   │       └── SubmitDispute.js
│       │   └── RoomItems/
│       │       └── Clock.js
│       ├── SharedMethods/
│       │   └── CallService.js
│       └── App.js
├── .gitignore
└── README.md
