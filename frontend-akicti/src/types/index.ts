import { z } from 'zod';

export const severityEnum = z.enum(['critical', 'high', 'medium', 'low']);
export const statusEnum = z.enum(['open', 'closed', 'investigating', 'pending']);

export type Severity = z.infer<typeof severityEnum>;
export type Status = z.infer<typeof statusEnum>;

export const evidenceSchema = z.object({
  id: z.number(),
  source: z.string(),
  summary: z.string(),
  is_reviewed: z.boolean().default(false),
  created_at: z.string(),
  reviewed_by: z.number().nullable(),
  reviewed_at: z.string().nullable()
});

export const alertSchema = z.object({
  id: z.number(),
  title: z.string(),
  severity: severityEnum,
  status: statusEnum,
  created_at: z.string(),
  owner: z.number(),
  evidences_count: z.number().optional()
});

export const alertDetailSchema = z.object({
  id: z.number(),
  title: z.string(),
  severity: severityEnum,
  status: statusEnum,
  created_at: z.string(),
  owner: z.number(),
  evidences: z.array(evidenceSchema)
});

export const paginatedAlertsResponseSchema = z.object({
  count: z.number(),
  next: z.string().nullable(),
  previous: z.string().nullable(),
  results: z.array(alertSchema)
});

export const paginatedEvidencesResponseSchema = z.object({
  count: z.number(),
  next: z.string().nullable(),
  previous: z.string().nullable(),
  results: z.array(evidenceSchema)
});

export const authRegisterSchema = z.object({
  username: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(8),
  password_confirm: z.string(),
  first_name: z.string().optional(),
  last_name: z.string().optional()
});

export const authLoginSchema = z.object({
  username: z.string(),
  password: z.string()
});

export const authResponseSchema = z.object({
  access: z.string(),
  refresh: z.string(),
  user: z
    .object({
      id: z.number(),
      username: z.string(),
      email: z.string(),
      first_name: z.string(),
      last_name: z.string()
    })
    .optional()
});

export const tokenRefreshSchema = z.object({
  refresh: z.string()
});

export const tokenVerifySchema = z.object({
  token: z.string()
});

export const createAlertSchema = z.object({
  title: z.string().min(1),
  severity: severityEnum,
  status: statusEnum
});

export const updateEvidenceSchema = z.object({
  is_reviewed: z.boolean().optional()
});

export type Evidence = z.infer<typeof evidenceSchema>;
export type Alert = z.infer<typeof alertSchema>;
export type AlertDetail = z.infer<typeof alertDetailSchema>;
export type PaginatedAlertsResponse = z.infer<typeof paginatedAlertsResponseSchema>;
export type PaginatedEvidencesResponse = z.infer<typeof paginatedEvidencesResponseSchema>;
export type AuthRegister = z.infer<typeof authRegisterSchema>;
export type AuthLogin = z.infer<typeof authLoginSchema>;
export type AuthResponse = z.infer<typeof authResponseSchema>;
export type TokenRefresh = z.infer<typeof tokenRefreshSchema>;
export type TokenVerify = z.infer<typeof tokenVerifySchema>;
export type CreateAlert = z.infer<typeof createAlertSchema>;
export type UpdateEvidence = z.infer<typeof updateEvidenceSchema>;
