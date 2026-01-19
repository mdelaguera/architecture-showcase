**Archive Pro: AI-Driven Historical Document Preservation**

_**Note:**_ This repository is a Technical Showcase and Architectural Overview. The source code is proprietary and currently deployed in production for enterprise clients (including national archives and museums).

(Replace the link above with a real screenshot of your "Enriched Content" view)

🚀 **Project Overview**

Archive Pro is a vertical SaaS platform architected to solve a massive data engineering challenge: modernizing terabytes of unstructured, legacy historical documents (TIF/PDF) into searchable, AI-enriched digital assets.

Unlike standard cloud storage (Google Drive/Dropbox), Archive Pro utilizes a custom Event-Driven Pipeline to perform heavy OCR (Optical Character Recognition) and Generative AI enrichment without freezing the user interface.

**Role:** Lead Solutions Architect & Full-Stack Developer
**Status:** Production (Patent-Pending Technology)
**Core Problem Solved:** Bridging the gap between physical deterioration of history and digital accessibility.

🛠 **Tech Stack & Architecture**

This project demonstrates a "Modern Monorepo" approach, balancing rapid iteration with strict enterprise compliance standards.

**Frontend:** Next.js 14 (App Router), Tailwind CSS, Shadcn UI

**Backend:** Node.js (Serverless), Supabase (PostgreSQL + Auth)

**Orchestration:** n8n (Workflow Automation), BullMQ (Job Queues)

**AI & Processing:** OpenAI (Context Enrichment), Tesseract/Vision AI (OCR)

**Infrastructure:** Vercel (Hosting), AWS S3 (Blob Storage), Redis (Caching)

🏗 **System Architecture**

The system uses a Decoupled Architecture to handle long-running processes (OCR can take 3-5 minutes per newspaper issue).

``` bash
 graph TD
    User[End User] -->|Uploads PDF| NextJS[Next.js Frontend]
    NextJS -->|Auth/RBAC| Supabase[Supabase Auth]
    NextJS -->|Direct Upload| S3[AWS S3 / Storage]
    
    subgraph "Async Processing Pipeline (n8n)"
        S3 -- Webhook Trigger --> n8n[n8n Workflow Engine]
        n8n -->|Step 1: OCR| OCR[Optical Character Recognition]
        n8n -->|Step 2: Clean| Sanitizer[Text Normalization]
        n8n -->|Step 3: Enrich| LLM[OpenAI GPT-4]
        n8n -->|Step 4: Index| DB[(PostgreSQL + pgvector)]
    end
    
    NextJS -- Polls Status --> DB
    NextJS -- Semantic Search --> DB
```

🧩 **Key Technical Challenges**

1. The "Browser Timeout" Problem

Challenge: High-resolution newspaper scans (600 DPI) take minutes to process. Standard HTTP requests timeout after 60 seconds.
Solution: Architected an Asynchronous Job Queue pattern.

Ingest: API returns 202 Accepted immediately upon upload.

Queue: A background job is dispatched to n8n via webhook.

Feedback: The frontend uses Realtime Subscriptions (Supabase) to listen for row updates (status: 'processing' -> 'complete') and update the progress bar live.

2. Polyglot Persistence for Search

Challenge: Storing millions of OCR'd words in a standard SQL TEXT column made queries painfully slow (>4 seconds) and inaccurate for historical spellings.
Solution:

Relational Data: User subscriptions, permissions, and metadata stored in PostgreSQL.

Vector Search: OCR text is embedded and stored using pgvector to allow for Semantic Search. This allows users to find "farming accidents" even if the article only mentions "agricultural mishap."

3. Compliance & Audit Trails (NIGC/Title 31 Standards)

Leveraging my background in compliance operations, I implemented:

Immutable Logs: Every document modification is versioned.

Data Sovereignty: Architecture supports "Bring Your Own Storage" (BYOS) for clients requiring on-premise data residency.

📸 **Feature Gallery**

Ingestion Pipeline

AI Enrichment

(Screenshot of Upload/Progress)

(Screenshot of "Fun Facts" or "Context")

Real-time async status tracking

Generative AI adding historical context

💻 **Code Highlights (Sanitized)**

While core logic is private, these snippets demonstrate my approach to Type Safety and Data Modeling.

Zod Schema for Archival Records

Ensuring strict validation between the AI pipeline and the UI.

``` bash
import { z } from 'zod';

export const ArchiveRecordSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1, "Title is required"),
  // Enum ensures state machine integrity
  processingStatus: z.enum(['pending', 'ocr_processing', 'ai_enriching', 'completed', 'failed']),
  
  // AI-Generated Metadata
  enrichmentData: z.object({
    historicalContext: z.string().optional(),
    keyEntities: z.array(z.string()),
    sentimentScore: z.number().min(-1).max(1),
  }).nullable(),
  
  // Security & Audit
  uploadedBy: z.string().uuid(),
  organizationId: z.string().uuid(),
  isPublic: z.boolean().default(false),
});

export type ArchiveRecord = z.infer<typeof ArchiveRecordSchema>;
```

📬 **Contact**

I am available for Senior Solutions Architect and Product Engineering roles.

**Portfolio:** github.com/mdelaguera/architecture-showcase

**Email:** michael.delaguera@gmail.com
