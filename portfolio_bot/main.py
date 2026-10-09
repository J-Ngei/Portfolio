"""
Portfolio chatbot backend.
Answers visitor questions using only the content in portfolio_data.json.
Deploy this on Render alongside your other FastAPI projects.
"""
import json
import os
import time
from collections import defaultdict
from pathlib import Path

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from groq import Groq

# ---- Config ----
# Load a local .env if present. In production (e.g. Render) the environment
# variables are set directly and this is a harmless no-op.
load_dotenv(Path(__file__).parent / ".env")

GROQ_API_KEY = os.environ["GROQ_API_KEY"]
ALLOWED_ORIGINS = os.environ.get(
    "ALLOWED_ORIGINS", "https://james-ngei.github.io"
).split(",")
RATE_LIMIT_PER_MINUTE = 10
MODEL = "openai/gpt-oss-120b"

client = Groq(api_key=GROQ_API_KEY)

# ---- Load portfolio content once at startup ----
DATA_PATH = Path(__file__).parent / "portfolio_data.json"
with open(DATA_PATH, encoding="utf-8") as f:
    PORTFOLIO = json.load(f)


def build_system_prompt(data: dict) -> str:
    lines = [
        "You are the assistant embedded on James Ngei's portfolio site.",
        "Answer visitor questions using ONLY the information below.",
        "If a question is unrelated to James's background, skills, "
        "projects, or how to get in touch, say you can only discuss "
        "James's portfolio and steer the conversation back.",
        "Keep answers concise and conversational.",
        "",
        "## About",
        data.get("about", ""),
        "",
        "## Projects",
    ]
    for p in data["projects"]:
        lines.append(f"- {p['title']}: {p['description']}")
        if p.get("details"):
            lines.append(f"  Details: {p['details']}")
        lines.append(f"  Tech: {', '.join(p['tags'])}")
        if p.get("code_url"):
            lines.append(f"  Code: {p['code_url']}")
        if p.get("demo_url"):
            lines.append(f"  Demo: {p['demo_url']}")

    contact = data.get("contact")
    if contact:
        lines += ["", "## Contact"]
        for label, key in (("Email", "email"), ("LinkedIn", "linkedin"), ("GitHub", "github")):
            if contact.get(key):
                lines.append(f"- {label}: {contact[key]}")
        if contact.get("notes"):
            lines.append(contact["notes"])

    if data.get("collaboration_areas"):
        lines += ["", "## Areas of Collaboration"]
        lines += [f"- {area}" for area in data["collaboration_areas"]]
    return "\n".join(lines)


SYSTEM_PROMPT = build_system_prompt(PORTFOLIO)

# ---- App ----
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_methods=["POST"],
    allow_headers=["*"],
)


class ChatMessage(BaseModel):
    role: str  # "user" or "assistant"
    content: str


class ChatRequest(BaseModel):
    message: str
    history: list[ChatMessage] = []


# ---- Simple in-memory rate limiting (per IP, per minute) ----
# Fine for portfolio-scale traffic. If you deploy multiple instances,
# swap this for a shared store (e.g. Redis) since in-memory state
# won't be consistent across processes.
request_log: dict[str, list[float]] = defaultdict(list)


def check_rate_limit(ip: str):
    now = time.time()
    window = [t for t in request_log[ip] if now - t < 60]
    if len(window) >= RATE_LIMIT_PER_MINUTE:
        raise HTTPException(status_code=429, detail="Too many requests, slow down.")
    window.append(now)
    request_log[ip] = window


@app.post("/chat")
async def chat(req: ChatRequest, request: Request):
    ip = request.client.host
    check_rate_limit(ip)

    if not req.message.strip():
        raise HTTPException(status_code=400, detail="Message cannot be empty.")

    messages = [{"role": "system", "content": SYSTEM_PROMPT}]
    messages += [{"role": m.role, "content": m.content} for m in req.history]
    messages.append({"role": "user", "content": req.message})

    response = client.chat.completions.create(
        model=MODEL,
        max_tokens=500,
        messages=messages,
    )

    reply = response.choices[0].message.content
    return {"reply": reply}


@app.get("/health")
async def health():
    return {"status": "ok"}