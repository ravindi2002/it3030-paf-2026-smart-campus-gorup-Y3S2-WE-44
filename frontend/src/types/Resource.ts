export type ResourceStatus = 'ACTIVE' | 'OUT_OF_SERVICE';

export interface Resource {
  id?: number;
  name: string;
  description?: string;
  location: string;
  resourceType?: string;
  status?: 'ACTIVE' | 'OUT_OF_SERVICE';
  imageUrl?: string;
  capacity?: number;
  availableFrom?: string;
  availableTo?: string;
  createdById?: number;
  createdByName?: string;
  createdAt?: string;
  updatedAt?: string;
}
