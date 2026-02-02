# AesthetiCore

医美诊所一体化 AI 智能操作系统

## 技术栈

- **前端**: Next.js 14 + React 18 + TypeScript + TailwindCSS
- **后端**: Python FastAPI
- **数据库**: PostgreSQL + Redis

## 快速开始

### Docker 方式（推荐）

```bash
docker-compose up
```

访问：
- 前端: http://localhost:3000
- 后端 API: http://localhost:8000
- API 文档: http://localhost:8000/docs

### 本地开发

**前端**
```bash
cd frontend
pnpm install
pnpm dev
```

**后端**
```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

## 项目结构

```
yimei/
├── frontend/          # Next.js 前端
├── backend/           # FastAPI 后端
├── docker-compose.yml # Docker 编排
└── README.md
```
