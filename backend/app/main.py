from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import auth, brandguard, facesim

app = FastAPI(
    title="AesthetiCore API",
    description="医美诊所一体化 AI 智能操作系统",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 注册路由
app.include_router(auth.router)
app.include_router(brandguard.router)
app.include_router(facesim.router)


@app.get("/health")
async def health_check():
    return {"status": "ok"}
