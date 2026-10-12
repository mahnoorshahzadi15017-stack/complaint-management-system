export type ComplaintStatus = 'New' | 'Pending' | 'In Progress' | 'Resolved';
export type ComplaintPriority = 'Low' | 'Medium' | 'High';

export type ComplaintAttachment = {
  id: string;
  uri: string;
  fileName: string;
};

export type Complaint = {
  id: string;
  title: string;
  description: string;
  status: ComplaintStatus;
  college: string;
  department: string;
  category: string;
  priority: ComplaintPriority;
  student: string;
  attachments: ComplaintAttachment[];
  submittedAt: string;
};

export type NewComplaint = Omit<Complaint, 'id' | 'submittedAt'>;
