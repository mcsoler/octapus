import type { Alert, Evidence, AlertDetail } from '../types';

export const mockAlerts: Alert[] = [
  {
    id: 1,
    title: 'Phishing Attack Detected',
    severity: 'critical',
    status: 'open',
    created_at: '2026-01-20T10:00:00Z',
    owner: 1,
    evidences_count: 8
  },
  {
    id: 2,
    title: 'Suspicious Login Activity',
    severity: 'high',
    status: 'in_progress',
    created_at: '2026-01-20T11:30:00Z',
    owner: 1,
    evidences_count: 12
  },
  {
    id: 3,
    title: 'Malware Signature Found',
    severity: 'high',
    status: 'open',
    created_at: '2026-01-20T12:15:00Z',
    owner: 1,
    evidences_count: 5
  },
  {
    id: 4,
    title: 'Data Exfiltration Attempt',
    severity: 'critical',
    status: 'closed',
    created_at: '2026-01-19T08:00:00Z',
    owner: 1,
    evidences_count: 15
  },
  {
    id: 5,
    title: 'Unusual Network Traffic',
    severity: 'medium',
    status: 'open',
    created_at: '2026-01-20T14:00:00Z',
    owner: 1,
    evidences_count: 7
  },
  {
    id: 6,
    title: 'Port Scan Detected',
    severity: 'medium',
    status: 'open',
    created_at: '2026-01-20T15:30:00Z',
    owner: 1,
    evidences_count: 10
  },
  {
    id: 7,
    title: 'Brute Force Attack',
    severity: 'high',
    status: 'in_progress',
    created_at: '2026-01-20T16:45:00Z',
    owner: 1,
    evidences_count: 13
  },
  {
    id: 8,
    title: 'SQL Injection Attempt',
    severity: 'critical',
    status: 'closed',
    created_at: '2026-01-18T09:00:00Z',
    owner: 1,
    evidences_count: 9
  },
  {
    id: 9,
    title: 'Suspicious File Download',
    severity: 'medium',
    status: 'open',
    created_at: '2026-01-20T17:30:00Z',
    owner: 1,
    evidences_count: 6
  },
  {
    id: 10,
    title: 'Unauthorized Access Attempt',
    severity: 'high',
    status: 'open',
    created_at: '2026-01-20T18:15:00Z',
    owner: 1,
    evidences_count: 11
  },
  {
    id: 11,
    title: 'DDOS Attack Pattern',
    severity: 'critical',
    status: 'in_progress',
    created_at: '2026-01-20T19:00:00Z',
    owner: 1,
    evidences_count: 14
  },
  {
    id: 12,
    title: 'XSS Vulnerability Scan',
    severity: 'medium',
    status: 'closed',
    created_at: '2026-01-17T10:30:00Z',
    owner: 1,
    evidences_count: 8
  },
  {
    id: 13,
    title: 'Credential Stuffing',
    severity: 'high',
    status: 'open',
    created_at: '2026-01-20T20:00:00Z',
    owner: 1,
    evidences_count: 9
  },
  {
    id: 14,
    title: 'Zero-Day Exploit',
    severity: 'critical',
    status: 'in_progress',
    created_at: '2026-01-20T21:30:00Z',
    owner: 1,
    evidences_count: 12
  },
  {
    id: 15,
    title: 'Ransomware Detection',
    severity: 'critical',
    status: 'open',
    created_at: '2026-01-20T22:00:00Z',
    owner: 1,
    evidences_count: 16
  },
  {
    id: 16,
    title: 'Insider Threat Indicator',
    severity: 'medium',
    status: 'open',
    created_at: '2026-01-20T22:45:00Z',
    owner: 1,
    evidences_count: 7
  },
  {
    id: 17,
    title: 'Outbound Connection to Known C2',
    severity: 'high',
    status: 'in_progress',
    created_at: '2026-01-21T08:00:00Z',
    owner: 1,
    evidences_count: 11
  },
  {
    id: 18,
    title: 'Privilege Escalation',
    severity: 'high',
    status: 'open',
    created_at: '2026-01-21T09:30:00Z',
    owner: 1,
    evidences_count: 8
  },
  {
    id: 19,
    title: 'Certificate Revocation',
    severity: 'low',
    status: 'open',
    created_at: '2026-01-21T10:15:00Z',
    owner: 1,
    evidences_count: 5
  },
  {
    id: 20,
    title: 'Policy Violation',
    severity: 'low',
    status: 'closed',
    created_at: '2026-01-19T14:00:00Z',
    owner: 1,
    evidences_count: 4
  }
];

export const mockEvidences: Evidence[] = [
  {
    id: 1,
    source: 'twitter',
    summary: 'Suspicious tweet with malicious link detected',
    is_reviewed: false,
    created_at: '2026-01-20T10:00:00Z',
    reviewed_by: null,
    reviewed_at: null
  },
  {
    id: 2,
    source: 'email',
    summary: 'Phishing email targeting finance department',
    is_reviewed: true,
    created_at: '2026-01-20T10:15:00Z',
    reviewed_by: 1,
    reviewed_at: '2026-01-20T10:30:00Z'
  },
  {
    id: 3,
    source: 'network',
    summary: 'Unusual outbound traffic to unknown IP',
    is_reviewed: false,
    created_at: '2026-01-20T10:30:00Z',
    reviewed_by: null,
    reviewed_at: null
  },
  {
    id: 4,
    source: 'endpoint',
    summary: 'Malware signature detected on workstation',
    is_reviewed: true,
    created_at: '2026-01-20T10:45:00Z',
    reviewed_by: 1,
    reviewed_at: '2026-01-20T11:00:00Z'
  },
  {
    id: 5,
    source: 'darkweb',
    summary: 'Credential dump posted on dark web forum',
    is_reviewed: false,
    created_at: '2026-01-20T11:00:00Z',
    reviewed_by: null,
    reviewed_at: null
  },
  {
    id: 6,
    source: 'twitter',
    summary: 'Mentions of organization in threat actor tweets',
    is_reviewed: false,
    created_at: '2026-01-20T11:15:00Z',
    reviewed_by: null,
    reviewed_at: null
  },
  {
    id: 7,
    source: 'network',
    summary: 'Port scanning activity from external IP',
    is_reviewed: true,
    created_at: '2026-01-20T11:30:00Z',
    reviewed_by: 1,
    reviewed_at: '2026-01-20T12:00:00Z'
  },
  {
    id: 8,
    source: 'endpoint',
    summary: 'Suspicious process execution detected',
    is_reviewed: false,
    created_at: '2026-01-20T11:45:00Z',
    reviewed_by: null,
    reviewed_at: null
  }
];

export const mockAlertDetail: AlertDetail = {
  id: 1,
  title: 'Phishing Attack Detected',
  severity: 'critical',
  status: 'open',
  created_at: '2026-01-20T10:00:00Z',
  owner: 1,
  evidences: mockEvidences
};

export const createMockEvidencesForAlert = (alertId: number, count = 8): Evidence[] => {
  const sources = ['twitter', 'email', 'network', 'endpoint', 'darkweb'];
  const summaries = [
    'Suspicious activity detected',
    'Malicious content found',
    'Unauthorized access attempt',
    'Data breach indicator',
    'Threat intelligence match'
  ];

  return Array.from({ length: count }, (_, i) => ({
    id: alertId * 100 + i,
    source: sources[i % sources.length],
    summary: `${summaries[i % summaries.length]} #${i + 1}`,
    is_reviewed: i % 3 === 0,
    created_at: new Date(Date.now() - i * 3600000).toISOString(),
    reviewed_by: i % 3 === 0 ? 1 : null,
    reviewed_at: i % 3 === 0 ? new Date(Date.now() - i * 3600000 + 1800000).toISOString() : null
  }));
};

export const generateAlertId = (): number => mockAlerts.length + 1;
