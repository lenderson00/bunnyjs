import { mock, mockClear } from "jest-mock-extended";
import { APIClient, APIClientGet } from "@bunnyjs/core";
import {
  Collection,
  CollectionList,
  DefaultResponse,
} from "@bunnyjs/@types/bunny";

class BNCollection {
  constructor(private client: APIClientGet & DeleteClient & PostClient) {}

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
}

namespace BNCollection {
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
}

interface DeleteClient {
  delete: <T>(
    endpoint: string,
    input?: APIClient.Request
  ) => Promise<APIClient.Response<T>>;
}

interface PostClient {
  post: <T>(
    endpoint: string,
    input?: APIClient.Request
  ) => Promise<APIClient.Response<T>>;
}

describe("Collections Stream", () => {
  let client: APIClientGet & DeleteClient & PostClient;
  let sut: BNCollection;

  beforeEach(() => {
    client = mock();
    sut = new BNCollection(client);
  });

  afterEach(() => {
    mockClear(client);
  });

  it("should call Client.get with corrects params", async () => {
    const params: BNCollection.GetCollectionListParams = {
      libraryId: 523,
      orderBy: "date",
    };
    // Act
    await sut.getList(params);

    // Assert
    expect(client.get).toHaveBeenCalledWith("/library/523/collections", {
      headers: {
        accept: "application/json",
      },
      data: {
        orderBy: "date",
      },
    });
    expect(client.get).toHaveBeenCalledTimes(1);
  });

  it("should return a list of collections", async () => {
    const params: BNCollection.GetCollectionListParams = {
      libraryId: 523,
    };
    const response: APIClient.Response<CollectionList> = {
      status: "success",
      statusCode: 200,
      data: {
        totalItems: 1,
        currentPage: 1,
        itemsPerPage: 10,
        items: [
          {
            videoLibraryId: 1,
            guid: "123",
            name: "Test",
            videoCount: 1,
            totalSize: 1,
            previewVideoIds: "123",
          },
        ],
      },
    };

    (client.get as jest.Mock).mockResolvedValue({ ...response });

    // Act
    const result = await sut.getList(params);

    // Assert
    expect(result).toEqual(response);
  });

  it("should return a single collection", async () => {
    const params: BNCollection.GetCollectionParams = {
      libraryId: 123,
      collectionId: "456",
    };

    sut.get(params);

    expect(client.get).toHaveBeenCalledWith("/library/123/collections/456", {
      headers: {
        accept: "application/json",
      },
    });

    expect(client.get).toHaveBeenCalledTimes(1);
  });

  it("should delete a collection", async () => {
    const params: BNCollection.DeleteCollectionParams = {
      libraryId: 123,
      collectionId: "456",
    };

    sut.delete(params);

    expect(client.delete).toHaveBeenCalledWith("/library/123/collections/456", {
      headers: {
        accept: "application/json",
      },
    });

    expect(client.delete).toHaveBeenCalledTimes(1);
  });

  it("should create a collection", async () => {
    const params: BNCollection.CreateCollectionParams = {
      libraryId: 123,
    };

    sut.create(params);

    expect(client.post).toHaveBeenCalledWith("/library/123/collections", {
      headers: {
        accept: 'application/json',
        'content-type': 'application/*+json',
      },
    });

    expect(client.post).toHaveBeenCalledTimes(1);
  });
});
