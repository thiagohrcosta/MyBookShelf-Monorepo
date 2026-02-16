# My Bookshelf 
<img width="1342" height="890" alt="image" src="https://github.com/user-attachments/assets/2bc853d9-f146-48e7-99d7-c43979dc99a4" />

## Introduction

**My Bookshelf** is a product-oriented fullstack monorepo designed to demonstrate end-to-end software delivery across API, web, mobile, and supporting infrastructure.

The project combines:

- a Ruby on Rails API backend,

- a Next.js web client,

- an Expo/React Native mobile client,

- and container-based orchestration with Docker Compose.

This repository is intentionally structured to reflect real product development concerns: architecture, authentication, API contracts, testing, documentation, quality tooling, and multi-client integration.

---

## Why this project exists

The goal is not only to ship features, but to show a practical **human-guided AI development workflow**:

- AI tools (such as Copilot/Codex) are used to accelerate repetitive implementation.

- Technical decisions, architecture, and quality gates remain under explicit human ownership.

- Development focuses on SOLID/DRY-oriented design, maintainability, and production readiness.

In short: speed where automation helps, engineering judgment where it matters.

---

## Product vision

My Bookshelf aims to offer a personal reading platform where users can:

- manage books, authors, and publishers,

- keep personal reading lists and statuses,

- publish and discuss reviews,

- inspect personal and platform-level statistics,

- and access the same product from web and mobile surfaces.

---

## Monorepo architecture

```text

.

├── backend/ # Ruby on Rails API

├── web/ # Next.js web app

├── mobile/ # Expo / React Native app

├── recommendation_system/ # FastAPI recommendation service

├── docker-compose.yml # Local orchestration

└── README.md

```

### Backend (Rails API)

Key backend characteristics currently in the codebase:

- API versioning under `/api/v1`.

- JWT-based authentication flow for login/profile-protected endpoints.

- Admin-protected destructive operations in selected resources.

- RSwag/OpenAPI documentation mounted at `/api-docs`.

- RSpec-based automated test structure (`spec/`) with FactoryBot and Shoulda Matchers.

- Security and quality tooling via Brakeman and RuboCop.

- Caching strategies in endpoints such as books listing/details, with Redis cache store configured for production.

### Web client (Next.js)

The web app is built with **Next.js 15 + React 19** and organized with the App Router (`web/app`).

Current implementation includes pages and flows for:

- authentication (login/register),

- home/dashboard-like views,

- library management,

- book detail/review interactions,

- profile and statistics,

- subscription-related screens (success/cancel).

### Mobile client (Expo + React Native)

The mobile app uses Expo Router and includes implemented screens for:

- login,

- tab-based navigation,

- reading dashboard/statistics,

- library-related flows,

- review browsing,

- profile/subscription data.

This gives the project a practical cross-platform path with API integration and user-centric access in the palm of the hand.

### Recommendation service

A dedicated `recommendation_system` service (FastAPI) is included in the monorepo and orchestrated by Docker Compose. The current service exposes health and recommendation endpoints, providing a clear extension point for ML/recommendation evolution.

---

## API documentation and contracts

Backend API documentation is maintained in OpenAPI format (`backend/swagger/v1/swagger.yaml`) and exposed through RSwag at runtime.

This helps with:

- endpoint discoverability,

- contract clarity for web/mobile clients,

- and safer evolution of the API surface.

---

## Security and performance foundations

From what is currently implemented:

- Authentication is token-based (JWT).

- Access control includes role-aware checks for protected actions.

- Caching is applied in high-read book endpoints.

- Production cache configuration targets Redis.

- Static analysis tooling (Brakeman) is present for security scanning.

These are foundation layers for a secure and responsive product baseline.

---

## Quality strategy

The backend includes a dedicated RSpec setup and test suite organization for models/requests, alongside test-support tooling (FactoryBot, Shoulda Matchers, SimpleCov, Faker, Rswag Specs).

In addition, linting/security tooling is wired in the backend stack to keep code quality and consistency high as the project grows.

---

## Local development

### Prerequisites

- Docker + Docker Compose

- (Optional for non-Docker workflows) Ruby/Bundler, Node.js, and Expo toolchain

### Run the full stack with Docker

```bash

docker compose up --build

```

Default local services from `docker-compose.yml`:

- Backend API: `http://localhost:3000`

- Web app: `http://localhost:3001`

- Recommendation service: `http://localhost:8000`

- PostgreSQL: `localhost:5432`

### Useful app commands (per project)

Backend:

```bash

cd backend

bundle install

bundle exec rails db:prepare

bundle exec rspec

```

Web:

```bash

cd web

npm install

npm run dev

```

Mobile:

```bash

cd mobile

npm install

npm run start

```

---

## Engineering principles behind this repository

-  **Product-first architecture**: API + web + mobile + infra evolving together.

-  **Explicit contracts**: OpenAPI/Swagger as a shared language.

-  **Human-guided AI development**: automation for repetition, human ownership for design and trade-offs.

-  **Maintainability at scale**: conventions, tests, and quality gates for long-term growth.

---

## Current status

This monorepo is under active development. The foundation is already cross-platform and operational, while additional iterations are expected to keep improving depth, coverage, UX polish, and production hardening.

---

## Topics

`api`  `docker`  `docker-compose`  `ruby-on-rails`  `postgresql`  `nextjs`  `reactjs`  `typescript`  `react-native`  `expo`  `rspec`  `factorybot`  `shoulda-matchers`  `swagger`  `brakeman`  `rubocop-rails`  `ci-cd`  `monorepo`  `copilot-coding-agent`
