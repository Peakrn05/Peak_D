/**
 * Pet API types - defines pet information and pet-related API contracts
 */

export interface PetResponse {
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

export interface CreatePetRequest {
  name: string;
  type: "DOG" | "CAT" | "RABBIT" | "BIRD" | "OTHER";
  breed: string;
  age: number;
  weight: number;
  color: string;
  notes?: string;
}

export interface UpdatePetRequest extends Partial<CreatePetRequest> {
  vaccineStatus?: boolean;
}
