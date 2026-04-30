export interface Permission {
  _id: string;
  name: string;
  description: string;
  category: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Role {
  _id: string;
  name: string;
  description: string;
  permissions: Permission[];
  allowedPanels: string[];
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateRolePayload {
  name: string;
  description?: string;
  permissions?: string[];
  allowedPanels?: string[];
  isActive?: boolean;
}

export interface UpdateRolePayload {
  name?: string;
  description?: string;
  permissions?: string[];
  allowedPanels?: string[];
  isActive?: boolean;
}

