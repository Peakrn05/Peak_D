/**
 * Frontend pet domain types - used in UI components and business logic
 */

export interface Pet {
  id: string;
  userId: string;
  name: string;
  type: "DOG" | "CAT" | "RABBIT" | "BIRD" | "OTHER";
  breed: string;
  age: number;
  weight: number;
  color: string;
  vaccineStatus: boolean;
  notes?: string;
  photoUrl?: string;
  createdAt: string;
}

export interface PetFormValues {
  name: string;
  type: "DOG" | "CAT" | "RABBIT" | "BIRD" | "OTHER";
  breed: string;
  age: number;
  weight: number;
  color: string;
  notes?: string;
}

export type PetModalMode = "create" | "edit" | "view";

export interface PetListParams {
  page?: number;
  pageSize?: number;
  type?: string;
}
