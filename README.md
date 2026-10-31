# KAIRO

**Customer Intelligence & Post-Sale Management Platform**

KAIRO is a full-stack web application focused on customer intelligence, post-sale operations, and data-driven business decisions.

The project combines backend engineering with business-oriented functionality to help organizations manage customer relationships, monitor satisfaction, understand retention patterns, and identify revenue recovery opportunities.

## Overview

KAIRO brings together operational customer data and analytical capabilities in a centralized platform.

Its development emphasizes backend architecture, relational data modeling, API design, authentication, access control, and integration with a modern web interface.

## Core Features

- **Customer Management:** Manage customer records and related information.
- **Post-Sale Operations:** Track visits and customer service activity.
- **Customer Satisfaction:** Collect survey responses and monitor customer experience.
- **Customer Intelligence:** Explore customer segments and experience trends.
- **Retention Analytics:** Analyze customer retention indicators.
- **Revenue Recovery:** Monitor opportunities and metrics related to recovering revenue.
- **Staff Management:** Manage staff records, roles, and permissions.
- **Staff Invitations:** Invite eligible staff members to create accounts through a token-based activation process.
- **Authentication:** Account access, session management, and password recovery.
- **Bilingual Interface:** Spanish and English support.
- **Email Notifications:** Integrations for customer surveys, password recovery, and staff invitations.

## Technology Stack

### Backend

- Python 3.12
- FastAPI
- SQLAlchemy
- PostgreSQL 16
- Alembic
- Pydantic
- Pytest

### Frontend

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- Lucide React

### Infrastructure

- Docker and Docker Compose
- PostgreSQL persistent storage
- Dedicated notification worker
- Environment-based configuration

## Architecture

KAIRO is organized into two independent repositories:

- `pvip-frontend`: Next.js application providing the user interface and frontend API integration.
- `pvip-backend`: FastAPI application implementing business logic, authentication, database operations, and API endpoints.

The local Docker Compose environment orchestrates four services:

1. **Frontend:** Next.js application.
2. **Backend:** FastAPI REST API.
3. **Database:** PostgreSQL.
4. **Notification Worker:** Background processing for survey notifications.

## Local Development

The current development environment uses Docker Compose from the parent `pvip` directory.

```text
pvip/
├── compose.yaml
├── pvip-frontend/
└── pvip-backend/
```

The backend requires environment configuration, including database credentials and applicable email-provider settings.

Once the required configuration is available, start the services from the parent directory:

```bash
docker compose up -d --build
```

Local application endpoints:

- Frontend: `http://localhost:3001`
- Backend: `http://localhost:8001`

The frontend communicates with the backend through Docker's internal service network.

**Note:** The two repositories and the parent Compose configuration must be available in the expected directory structure. This README describes the existing development environment; it is not a standalone deployment guide.

## Testing

The backend includes automated tests covering areas such as:

- Authentication and authorization
- Business and staff permissions
- Customer and visit workflows
- Survey processing and notifications
- Customer segmentation and analytics
- Revenue recovery
- Staff invitations and concurrency scenarios

## Current Development Status

KAIRO is under active development and undergoing quality assurance and professional preparation.

Staff invitation workflows have been implemented and technically tested. Sending invitations to arbitrary external email addresses remains dependent on verified email-sender configuration, and the complete real-email activation flow has not yet been validated.

Public deployment and production configuration are separate from the current local Docker environment.

## Project Focus

KAIRO is developed as a portfolio project demonstrating the intersection of:

**Backend Development · Business Intelligence · Customer Experience · Post-Sale Operations · Full-Stack Integration**

Its purpose is to demonstrate how software engineering can support practical business processes and data-informed decisions.