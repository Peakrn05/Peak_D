/**
 * Pet Service - pet management and CRUD operations
 * Transforms pet API responses into domain objects
 */

import {
  getPetsApi,
  getPetApi,
  createPetApi,
  updatePetApi,
  deletePetApi,
} from "@/lib/api/api-main";
import type { Pet, PetFormValues, PetListParams } from "@/types/app/pet";

/**
 * Fetches all pets for current user
 * Returns list of pet objects
 */
export const getPetsService = async (
  params?: PetListParams,
): Promise<{ pets: Pet[]; total: number }> => {
  try {
    const response = await getPetsApi(params as Record<string, unknown>);

    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to fetch pets");
    }

    return {
      pets: response.data.data.content || [],
      total: response.data.data.totalElements || 0,
    };
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to fetch pets");
  }
};

/**
 * Fetches single pet by ID
 */
export const getPetService = async (petId: string): Promise<Pet> => {
  try {
    const response = await getPetApi(petId);

    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to fetch pet");
    }

    return response.data.data as Pet;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to fetch pet");
  }
};

/**
 * Creates new pet
 * Returns created pet object
 */
export const createPetService = async (values: PetFormValues): Promise<Pet> => {
  try {
    const response = await createPetApi(values);

    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to create pet");
    }

    return response.data.data as Pet;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to create pet");
  }
};

/**
 * Updates existing pet
 * Returns updated pet object
 */
export const updatePetService = async (
  petId: string,
  values: Partial<PetFormValues>,
): Promise<Pet> => {
  try {
    const response = await updatePetApi(petId, values);

    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to update pet");
    }

    return response.data.data as Pet;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to update pet");
  }
};

/**
 * Deletes pet by ID
 */
export const deletePetService = async (petId: string): Promise<void> => {
  try {
    const response = await deletePetApi(petId);

    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to delete pet");
    }
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to delete pet");
  }
};
