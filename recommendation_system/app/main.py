from fastapi import FastAPI, Body
from collections import Counter

app = FastAPI()

# ==============================
# FAKE DATABASE (CATÁLOGO)
# ==============================

FAKE_BOOKS_DB = [
    {
        "id": 1,
        "title": "O Problema dos Três Corpos",
        "author": "Cixin Liu",
        "categories": ["ficção científica", "hard sci-fi"],
        "themes": ["ciência", "civilização"],
    },
    {
        "id": 2,
        "title": "A Floresta Sombria",
        "author": "Cixin Liu",
        "categories": ["ficção científica", "hard sci-fi"],
        "themes": ["sobrevivência", "estratégia"],
    },
    {
        "id": 3,
        "title": "Duna",
        "author": "Frank Herbert",
        "categories": ["ficção científica", "space opera"],
        "themes": ["política", "ecologia"],
    },
    {
        "id": 4,
        "title": "Blade Runner",
        "author": "Philip K. Dick",
        "categories": ["ficção científica"],
        "themes": ["IA", "humanidade"],
    },
    {
        "id": 5,
        "title": "1984",
        "author": "George Orwell",
        "categories": ["distopia"],
        "themes": ["autoritarismo", "controle social"],
    },
]

# ==============================
# HEALTHCHECK
# ==============================

@app.get("/health")
async def health():
    return {"status": "ok"}

# ==============================
# RECOMMENDATION ENDPOINT
# ==============================

@app.post("/recommend")
async def recommend(payload: dict = Body(...)):
    # ------------------------------
    # USER DATA
    # ------------------------------
    user_id = payload.get("user_id")
    user_books = payload.get("books", [])

    user_book_ids = {
        book["id"] for book in user_books if isinstance(book, dict) and "id" in book
    }

    user_categories = []
    user_themes = []
    user_authors = []

    for book in user_books:
        if not isinstance(book, dict):
            continue

        user_categories.extend(book.get("categories", []))
        user_themes.extend(book.get("themes", []))

        if book.get("author"):
            user_authors.append(book["author"])

    category_counter = Counter(user_categories)
    theme_counter = Counter(user_themes)

    # ------------------------------
    # SCORE BOOKS
    # ------------------------------
    scored_books = []

    for book in FAKE_BOOKS_DB:
        if not isinstance(book, dict):
            continue

        if book["id"] in user_book_ids:
            continue

        score = 0

        for category in book.get("categories", []):
            score += category_counter.get(category, 0) * 3

        for theme in book.get("themes", []):
            score += theme_counter.get(theme, 0) * 2

        if book.get("author") in user_authors:
            score += 1

        if score > 0:
            scored_books.append({
                "id": book["id"],
                "title": book["title"],
                "author": book["author"],
                "score": score,
            })

    recommendations = sorted(
        scored_books,
        key=lambda x: x["score"],
        reverse=True
    )[:3]

    # ------------------------------
    # RESPONSE
    # ------------------------------
    return {
        "user_id": user_id,
        "recommendations": recommendations,
    }
