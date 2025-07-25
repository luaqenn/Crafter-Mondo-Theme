export type StaffFormInput = {
  name: string;
  type: string;
  index: number;
};

export type StaffFormApplicationValue = {
  inputId: string;
  value: string;
};

export type StaffFormApplicationStatus = "pending" | "approved" | "rejected";

export type StaffFormApplication = {
  id: string;
  userId: string;
  values: StaffFormApplicationValue[];
  status: StaffFormApplicationStatus;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    username: string;
    role: any;
  };
  form?: {
    id: string;
    title: string;
    slug: string;
  };
};

export type StaffForm = {
  id: string;
  title: string;
  slug: string;
  description: string;
  inputs: StaffFormInput[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};