import AsyncStorage from '@react-native-async-storage/async-storage';
import {Complaint, ComplaintAttachment, ComplaintPriority, ComplaintStatus, NewComplaint} from '../types/complaint';

export const apiBaseUrl = 'https://staging-complain-bnq-student-p442.encr.app/api';

const apiOrigin = apiBaseUrl.replace(/\/api\/?$/, '');
const accessTokenStorageKey = '@complaint-management/access-token';

export type ApiUser = {
  id: string;
  email: string;
  app_metadata: {role?: string};
  user_metadata: {
    full_name?: string;
    college?: string;
    department?: string;
    avatar_url?: string | null;
  };
};

type AuthSession = {
  access_token: string;
  user: ApiUser;
};

type ApiAttachment = {
  id: string;
  fileName: string;
  url: string;
};

type ApiComplaint = {
  id: string;
  title: string;
  description: string;
  status: ComplaintStatus;
  college: string;
  department: string;
  category: string;
  priority: ComplaintPriority;
  student: string | {name?: string};
  attachments?: ApiAttachment[];
  submittedAt: string;
};

type ComplaintList = {
  items: ApiComplaint[];
  total: number;
};

type RequestOptions = {
  method?: string;
  body?: unknown;
  auth?: boolean;
  headers?: Record<string, string>;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function getErrorMessage(payload: unknown, status: number): string {
  if (isRecord(payload) && isRecord(payload.error) && typeof payload.error.message === 'string') {
    return payload.error.message;
  }
  if (isRecord(payload) && typeof payload.message === 'string') {
    return payload.message;
  }
  return `API request failed with status ${status}.`;
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const headers: Record<string, string> = {...options.headers};
  let hasAccessToken = false;
  if (options.body !== undefined && !(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }
  if (options.auth !== false) {
    const accessToken = await AsyncStorage.getItem(accessTokenStorageKey);
    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`;
      hasAccessToken = true;
    }
  }

  const response = await fetch(`${apiBaseUrl}${path}`, {
    method: options.method ?? 'GET',
    headers,
    body:
      options.body === undefined
        ? undefined
        : options.body instanceof FormData
          ? options.body
          : JSON.stringify(options.body),
  });
  const responseText = await response.text();
  let payload: unknown;
  if (responseText) {
    try {
      payload = JSON.parse(responseText);
    } catch {
      throw new Error('The API returned an invalid response.');
    }
  }
  if (!response.ok) {
    if (response.status === 401 && hasAccessToken) {
      await AsyncStorage.removeItem(accessTokenStorageKey);
    }
    throw new Error(getErrorMessage(payload, response.status));
  }
  return payload as T;
}

function apiFileUrl(url: string): string {
  if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?\//i.test(url)) {
    return `${apiOrigin}${url.replace(/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?/i, '')}`;
  }
  return url.startsWith('/') ? `${apiOrigin}${url}` : url;
}

function mapAttachment(attachment: ApiAttachment): ComplaintAttachment {
  return {
    id: attachment.id,
    fileName: attachment.fileName,
    uri: apiFileUrl(attachment.url),
  };
}

function mapComplaint(complaint: ApiComplaint): Complaint {
  return {
    id: complaint.id,
    title: complaint.title,
    description: complaint.description,
    status: complaint.status,
    college: complaint.college,
    department: complaint.department,
    category: complaint.category,
    priority: complaint.priority,
    student:
      typeof complaint.student === 'string'
        ? complaint.student
        : complaint.student.name ?? 'Student',
    attachments: (complaint.attachments ?? []).map(mapAttachment),
    submittedAt: complaint.submittedAt,
  };
}

export async function hasSavedSession(): Promise<boolean> {
  return (await AsyncStorage.getItem(accessTokenStorageKey)) !== null;
}

export async function login(email: string, password: string): Promise<ApiUser> {
  const session = await request<AuthSession>('/v1/auth/login', {
    method: 'POST',
    auth: false,
    body: {email, password},
  });
  if (!session.access_token || !session.user) {
    throw new Error('The API login response did not include a valid session.');
  }
  await AsyncStorage.setItem(accessTokenStorageKey, session.access_token);
  return session.user;
}

export async function signUp(name: string, email: string, password: string): Promise<void> {
  await request<unknown>('/v1/auth/signup', {
    method: 'POST',
    auth: false,
    body: {email, password, data: {full_name: name}},
  });
}

export async function getCurrentUser(): Promise<ApiUser> {
  const result = await request<unknown>('/v1/auth/user');
  const user = isRecord(result) && isRecord(result.user) ? result.user : result;
  if (!isRecord(user) || typeof user.id !== 'string' || typeof user.email !== 'string') {
    throw new Error('The API returned an invalid user profile.');
  }
  return user as ApiUser;
}

export async function logout(): Promise<void> {
  await request<unknown>('/v1/auth/logout', {method: 'POST'});
  await AsyncStorage.removeItem(accessTokenStorageKey);
}

export async function requestRecoveryCode(email: string): Promise<{dev_otp?: string}> {
  return request('/v1/auth/recover', {
    method: 'POST',
    auth: false,
    body: {email},
  });
}

export async function verifyRecoveryCode(email: string, token: string): Promise<void> {
  const session = await request<unknown>('/v1/auth/verify', {
    method: 'POST',
    auth: false,
    body: {email, token, type: 'recovery'},
  });
  const recoverySession = isRecord(session) && isRecord(session.session) ? session.session : session;
  if (!isRecord(recoverySession) || typeof recoverySession.access_token !== 'string') {
    throw new Error('The API did not return a recovery session.');
  }
  await AsyncStorage.setItem(accessTokenStorageKey, recoverySession.access_token);
}

export async function updateCurrentUser(updates: {
  email?: string;
  password?: string;
  data?: {full_name?: string; college?: string; department?: string};
}): Promise<void> {
  await request('/v1/auth/user', {method: 'PUT', body: updates});
}

export async function uploadAvatar(uri: string, fileName: string): Promise<string> {
  const formData = new FormData();
  const file = {
    uri,
    name: fileName,
    type: fileName.toLowerCase().endsWith('.png') ? 'image/png' : 'image/jpeg',
  };
  formData.append('file', file as unknown as Blob);
  const result = await request<{avatarUrl: string}>('/v1/profile/avatar', {
    method: 'POST',
    body: formData,
  });
  if (!result.avatarUrl) {
    throw new Error('The API did not return the uploaded avatar URL.');
  }
  return apiFileUrl(result.avatarUrl);
}

export async function listComplaints(): Promise<Complaint[]> {
  const pageSize = 100;
  let page = 1;
  let total = 0;
  const complaints: Complaint[] = [];
  do {
    const result = await request<ComplaintList>(
      `/v1/complaints?page=${page}&limit=${pageSize}`,
    );
    if (!Array.isArray(result.items) || typeof result.total !== 'number') {
      throw new Error('The API returned an invalid complaints list.');
    }
    complaints.push(...result.items.map(mapComplaint));
    total = result.total;
    page += 1;
  } while (complaints.length < total);
  return complaints;
}

export async function createComplaint(complaint: NewComplaint): Promise<string> {
  const result = await request<unknown>('/v1/complaints', {
    method: 'POST',
    body: {
      title: complaint.title,
      description: complaint.description,
      college: complaint.college,
      department: complaint.department,
      category: complaint.category,
      priority: complaint.priority,
      attachments: [],
    },
  });
  const created = isRecord(result) && isRecord(result.complaint) ? result.complaint : result;
  if (!isRecord(created) || typeof created.id !== 'string') {
    throw new Error('The complaint was created, but the API did not return its ID.');
  }
  return created.id;
}

export async function uploadComplaintAttachment(
  complaintId: string,
  attachment: ComplaintAttachment,
): Promise<void> {
  const formData = new FormData();
  const file = {
    uri: attachment.uri,
    name: attachment.fileName,
    type: attachment.fileName.toLowerCase().endsWith('.png') ? 'image/png' : 'image/jpeg',
  };
  formData.append('file', file as unknown as Blob);
  formData.append('fileName', attachment.fileName);
  await request(`/v1/complaints/${encodeURIComponent(complaintId)}/attachments`, {
    method: 'POST',
    body: formData,
  });
}

export async function updateComplaintStatus(
  complaintId: string,
  status: ComplaintStatus,
): Promise<void> {
  await request(`/v1/complaints/${encodeURIComponent(complaintId)}/status`, {
    method: 'PATCH',
    body: {status},
  });
}
