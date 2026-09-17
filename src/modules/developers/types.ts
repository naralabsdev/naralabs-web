export type APIKeyPublic = {
  id: string;
  label: string;
  prefix: string;
  lastUsedAt?: string;
  createdAt: string;
};

export type APIKeyListResponse = {
  items: APIKeyPublic[];
  total: number;
};

export type APIKeyCreateResult = {
  id: string;
  label: string;
  key: string;
  prefix: string;
  createdAt: string;
};

export type APIKeyRevokeResponse = {
  revoked: boolean;
};
