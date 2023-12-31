import {
  Collection,
  CollectionList,
  DefaultResponse,
} from "@bunnyjs/@types/bunny";
import { APIClient, GetClient, DeleteClient, PostClient } from "@bunnyjs/core";

export class BNCollection {
  constructor(private client: GetClient & DeleteClient & PostClient) {}

  async getList(
    params: BNCollection.GetCollectionListParams
  ): Promise<APIClient.Response<CollectionList>> {
    const { libraryId, ...data } = params;

    const endpoint = `/library/${libraryId}/collections`;

    const input = {
      headers: {
        accept: "application/json",
      },
      data,
    };

    return this.client.get<CollectionList>(endpoint, input);
  }

  async get(
    params: BNCollection.GetCollectionParams
  ): Promise<APIClient.Response<Collection>> {
    const { libraryId, collectionId } = params;

    const endpoint = `/library/${libraryId}/collections/${collectionId}`;

    const input = {
      headers: {
        accept: "application/json",
      },
    };

    return this.client.get<Collection>(endpoint, input);
  }

  async delete(
    params: BNCollection.GetCollectionParams
  ): Promise<APIClient.Response<DefaultResponse>> {
    const { libraryId, collectionId } = params;

    const endpoint = `/library/${libraryId}/collections/${collectionId}`;

    const input = {
      headers: {
        accept: "application/json",
      },
    };

    return this.client.delete<DefaultResponse>(endpoint, input);
  }

  async create(
    params: BNCollection.CreateCollectionParams
  ): Promise<APIClient.Response<Collection>> {
    const { libraryId } = params;

    const endpoint = `/library/${libraryId}/collections`;

    const input = {
      headers: {
        accept: "application/json",
        "content-type": "application/*+json",
      },
    };

    return this.client.post<Collection>(endpoint, input);
  }

  async update(
    params: BNCollection.UpdateCollectionParams
  ): Promise<APIClient.Response<DefaultResponse>> {
    const { libraryId, collectionId, name } = params;

    const endpoint = `/library/${libraryId}/collections/${collectionId}`;

    const input = {
      headers: {
        accept: "application/json",
        "content-type": "application/*+json",
      },
      data: {
        name,
      },
    };

    return this.client.post<DefaultResponse>(endpoint, input);
  }
}

export namespace BNCollection {
  export type GetCollectionListParams = {
    libraryId: number;
    page?: number;
    itemsPerPage?: number;
    search?: string;
    orderBy?: string;
  };

  export type GetCollectionParams = {
    libraryId: number;
    collectionId: string;
  };

  export type DeleteCollectionParams = {
    libraryId: number;
    collectionId: string;
  };

  export type CreateCollectionParams = {
    libraryId: number;
  };

  export type UpdateCollectionParams = {
    libraryId: number;
    collectionId: string;
    name: string;
  };
}
