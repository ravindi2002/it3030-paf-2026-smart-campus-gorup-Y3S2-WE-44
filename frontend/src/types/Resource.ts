export enum ResourceStatus {
  ACTIVE = 'ACTIVE',
  OUT_OF_SERVICE = 'OUT_OF_SERVICE',
}

export interface Resource {
  id?: number;
  name: string;
  description?: string;
  location: string;
  resourceType?: string;
  status: ResourceStatus;
  imageUrl?: string;
  capacity?: number;
  createdById?: number;
  createdByName?: string;
  createdAt?: string;
  updatedAt?: string;
}