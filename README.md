#  Where to Watch

> Search any movie or TV show and instantly find where to stream, rent, or buy it — filtered by country.

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)

---

##  Demo

<img width="1901" height="913" alt="image" src="https://github.com/user-attachments/assets/7ed5f502-4e1d-4c07-892c-ac99a7261cd7" />

Link:
https://huggingface.co/spaces/NihalNimmagadda/WhereToWatch
---

##  What It Does

Where to Watch is a full-stack web app that lets you search any movie or TV show and see every platform where it's available, broken down by streaming, rental, and purchase options. Results are filtered by country, so you always see what's actually available where you are.

---

##  Tech Stack

| Layer     | Technology                        |
|-----------|-----------------------------------|
| Frontend  | React, Vite, Tailwind CSS         |
| Backend   | FastAPI, httpx, uvicorn           |
| Data      | TMDB API (The Movie Database)     |

---

##  Getting Started

### Prerequisites
- Node.js v18+
- Python 3.10+
- A free [TMDB API key](https://www.themoviedb.org/settings/api)

### Backend

```bash
cd backend
pip install -r requirements.txt
```

Create a `.env` file in `/backend`:
```
TMDB_API_KEY=your_api_key_here
```

```bash
uvicorn main:app --reload
```

The API will be running at `http://localhost:8000`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The app will be running at `http://localhost:5173`

---

##  Features

- **Search** movies and TV shows by title
- **See all platforms** — streaming, rental, and purchase options in one place
- **Filter by country** to see what's available in your region
- **Powered by TMDB** for up-to-date availability data

---

##  What I Learned

Building this project gave me hands-on experience connecting a React frontend to a Python backend via a REST API. I learned how to handle async requests with `httpx` in FastAPI, manage CORS between development servers, and structure API responses so the frontend only gets the data it needs. Filtering availability by country required understanding how TMDB structures its watch provider data, which pushed me to write cleaner data transformation logic on the backend.

---

##  Future Improvements

- Add user accounts to save and track a watchlist
- Support filtering by platform (e.g. "only show Netflix results")
- Show availability history or notify when something leaves a platform
- Mobile-responsive design improvements

