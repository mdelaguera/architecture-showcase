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
