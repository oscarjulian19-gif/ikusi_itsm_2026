# P7M6 Incident Management Implementation

This document outlines the changes made to implement the **P7M6 Methodology** for Incident Management in the Antigravity platform.

## 1. Backend Changes (Python/FastAPI)

### Database Schema (`backend/app/models/models.py`)
- **Ticket Model Updated**:
  - Added `attention_start_at` (SLA Start).
  - Added `resolution_start_at` (P7M6 Start).
  - Added `closed_at` (SLA End).
  - Added `current_step` (1-7 Tracking).
  - Added `step_data` and `ai_scores` to store Wizard progress and AI feedback.
  - Added `pauses` relationship for SLA Clock Pauses.
- **New Model**: `TicketPause` to track reasons (Vendor/Client) and timestamps for clock stops.

### API Router (`backend/app/routers/incidents.py`)
- **Endpoints**:
  - `POST /tickets`: Create new incident.
  - `PUT /tickets/{id}/start_resolution`: Moves state to "En Resolución", starts P7M6 clock.
  - `POST /tickets/{id}/validate_step`: Uses **Gemini AI** to validate evidence against P7M6 criteria.
  - `PUT /tickets/{id}/submit_step`: Saves step data and advances wizard.
  - `POST /tickets/{id}/pause`: Pauses the SLA clock (Vendor/Client reason).
  - `POST /tickets/{id}/resume`: Resumes the SLA clock.
  - `PUT /tickets/{id}/close`: Finalizes the incident.

## 2. Frontend Changes (React)

### Store (`src/store/useIncidentStore.js`)
- Replaces mock `useCaseStore` with real API integration.
- Manages `incidents`, `currentIncident`, and `validationResult`.

### UI Components
- **List View (`src/pages/Incidents.jsx`)**:
  - Displays Real-time **Attention Time** (Creation -> Start Resolution).
  - Displays Real-time **Resolution Time** (Start Resolution -> Close).
  - Shows current Status and P7M6 Step progress.
- **Detail/Wizard View (`src/pages/IncidentForm.jsx`)**:
  - Implements **P7M6 Wizard** (`src/components/incidents/P7M6Wizard.jsx`).
  - **Contextual Help**: Specific instructions for each of the 7 steps.
  - **AI Validation**: Button to "Validar con IA" which provides scoring and feedback.
  - **Clock Pause**: Modal to pause SLA for "Fabricante" or "Cliente".

## 3. Workflow
1. **Agent** creates Incident (Status: *Abierto*). Time ticks for "Atención".
2. **Resolutor** clicks "Iniciar Resolución". Status: *En Resolución*. Attention Clock stops, Resolution Clock starts.
3. **P7M6 Wizard** activates. User fills Step 1 (Reporte), validates with AI, proceeds to Step 2, etc.
4. If blocked, user clicks "Pausar Reloj" -> Selects reason -> Resolution Clock pauses.
5. User completes Step 7 -> Incident Closes.

## Next Steps
- Implement `background_tasks` for real notifications.
- Refine AI Prompts for stricter validation in `incidents.py`.
