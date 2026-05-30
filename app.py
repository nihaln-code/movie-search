import os
import httpx
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles

load_dotenv()

app = FastAPI()

API_KEY = os.environ.get("TMDB_API_KEY")
BASE_URL = "https://api.themoviedb.org/3"


async def tmdb_get(path: str, params: dict = {}):
    async with httpx.AsyncClient() as client:
        res = await client.get(f"{BASE_URL}{path}", params={"api_key": API_KEY, **params})
    if not res.is_success:
        raise HTTPException(status_code=res.status_code, detail="TMDB error")
    return res.json()


@app.get("/api/search")
async def search(query: str):
    data = await tmdb_get("/search/multi", {"query": query, "include_adult": "false"})
    return [r for r in data["results"] if r["media_type"] in ("movie", "tv")]


@app.get("/api/trending")
async def trending():
    data = await tmdb_get("/trending/all/week")
    return [r for r in data["results"] if r["media_type"] in ("movie", "tv")]


@app.get("/api/watch-providers/{media_type}/{id}")
async def watch_providers(media_type: str, id: int):
    return await tmdb_get(f"/{media_type}/{id}/watch/providers")


app.mount("/", StaticFiles(directory="dist", html=True), name="static")
