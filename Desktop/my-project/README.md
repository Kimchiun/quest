# ITMS Desktop (Intelligent Test Management System)

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)]()
[![Platform](https://img.shields.io/badge/platform-Electron%20%7C%20React%20%7C%20Node.js-blue)]()
[![License](https://img.shields.io/badge/license-MIT-green)]()

---

## Overview

**ITMS Desktop** is an all-in-one, cross-platform desktop application for modern test management. It streamlines test planning, execution, result tracking, and defect management, combining a user-friendly UX with AI-powered insights to boost QA productivity, software quality, and team collaboration.

---

## Key Features

- **Test Case Management**: CRUD, version history, advanced search/filtering (Elasticsearch)
- **Release & Suite Planning**: Drag-and-drop assignment, aggregated status, executor/environment/due date management
- **Test Execution & Result Logging**: State selection (Pass/Fail/Blocked/Untested), failure details (repro steps, screenshots, logs)
- **Offline Support**: IndexedDB caching, automatic sync on reconnect
- **AI Integration**: Case generation suggestions, impact analysis (via Python microservice)
- **External System Integration**: Jira/Redmine (REST API), webhooks
- **User & Role Management**: RBAC, SSO (SAML/OAuth2)
- **Collaboration**: Comments, @mentions, notification center
- **Security**: AES-256 at rest, TLS 1.3 in transit, OWASP Top 10 compliance

---

## Architecture

```mermaid
graph TD
    A[ITMS Desktop App] --> B[Internal Backend (Node.js)]
    B --> C[Local PostgreSQL DB]
    B --> D[Local Elasticsearch]
    B --> E[AI Service (Python)]
    B --> F[External System API (Jira, GitLab, etc.)]
    A --> G[IndexedDB (Offline Cache)]
    F --> H[External Systems]
```

- **Frontend**: Electron (React, Redux)
- **Backend**: Node.js (Express)
- **Database**: PostgreSQL
- **Search**: Elasticsearch
- **AI Service**: Python (Flask/FastAPI)
- **Communication**: REST API, gRPC, Electron IPC

---

## Tech Stack

| Layer         | Technology                        |
| -------------| ---------------------------------- |
| Desktop App  | Electron                          |
| UI           | React, Redux Toolkit              |
| Backend      | Node.js, Express                  |
| Database     | PostgreSQL                        |
| Search       | Elasticsearch                     |
| AI Service   | Python (Flask/FastAPI, HuggingFace, TensorFlow Lite) |
| Auth         | Passport.js (local, JWT, SAML/OAuth2) |
| Offline      | IndexedDB                         |
| Testing      | Jest, React Testing Library, Supertest |

---

## Folder Structure

```
my-project/
├── src/
│   ├── main/         # Electron Main Process (Node.js backend)
│   ├── renderer/     # Electron Renderer (React frontend)
│   ├── ai-service/   # (Optional) Python AI microservice
│   └── types/        # Global TypeScript types
├── config/           # Environment configs
├── scripts/          # Build/deploy scripts
├── tests/            # Test files
├── package.json
├── tsconfig.json
├── .env
└── README.md
```

---

## Getting Started

### Prerequisites
- Node.js (>=16)
- npm or yarn
- PostgreSQL
- Elasticsearch
- (Optional) Python 3.8+ for AI service

### Installation

```bash
# Install dependencies
npm install

# (Optional) Set up environment variables in .env
cp .env.example .env
```

### Database & Search Setup
- Ensure PostgreSQL and Elasticsearch are running.
- Run migrations:
  ```bash
  psql -U postgres -d itms -f src/main/app/infrastructure/database/migrations/001_create_executions.sql
  ```

### Development

```bash
# Start Electron app in development mode
npm run dev
```

### Build

```bash
npm run build
```

---

## Usage

- **Test Case Management**: Create, edit, search, and version test cases.
- **Release Planning**: Organize test cases into releases and suites with drag-and-drop.
- **Test Execution**: Log results, attach screenshots/logs, and sync offline records automatically.
- **Integrations**: Connect with Jira/Redmine for defect management.
- **AI Features**: (Planned) Generate test cases and analyze impact using AI microservice.

---

## Contribution

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a new branch (`feat/your-feature`)
3. Commit your changes (`git commit -m 'feat: add new feature'`)
4. Push to your branch (`git push origin feat/your-feature`)
5. Open a Pull Request

**Coding Guidelines:**
- Follow the [Clean Code](./.cursor/rules/vooster__clean-code.mdc) and [Commit Message](./.cursor/rules/vooster__git-commit-message.mdc) rules in this repo.
- Write tests for new features and bug fixes.
- Keep PRs focused and well-documented.

---

## License

This project is licensed under the MIT License.

---

## Contact

- **Maintainer:** zkz258@naver.com
- **GitHub Issues:** [itms-desktop Issues](https://github.com/Kimchiun/itms-desktop/issues)

---

> ITMS Desktop — The next-generation intelligent test management solution for QA teams. 