import { mock, mockClear } from "jest-mock-extended";
import { APIClient, APIClientGet } from "@bunnyjs/core";
import { CollectionList } from "@bunnyjs/@types/bunny";



class BNCollection {
  constructor(private clientGet: APIClientGet) {}

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

    return this.clientGet.get<CollectionList>(endpoint, input);
  }
}

namespace BNCollection {
  export type GetCollectionListParams = {
    libraryId: string;
    page?: number;
    itemsPerPage?: number;
    search?: string;
    orderBy?: string;
  };
}

describe("Collections Stream", () => {
  let clientGet: APIClientGet;
  let sut: BNCollection;

  beforeEach(() => {
    clientGet = mock();
    sut = new BNCollection(clientGet);
  });

  afterEach(() => {
    mockClear(clientGet);
  });

  it("should call Client.get with corrects params", async () => {
    const params: BNCollection.GetCollectionListParams = {
      libraryId: "123",
      orderBy: "date",
    };
    // Act
    await sut.getList(params);

    // Assert
    expect(clientGet.get).toHaveBeenCalledWith("/library/123/collections", {
      headers: {
        accept: "application/json",
      },
      data: {
        orderBy: "date",
      },
    });
    expect(clientGet.get).toHaveBeenCalledTimes(1);
  });

  it("should return a list of collections", async () => {
    const params: BNCollection.GetCollectionListParams = {
      libraryId: "123",
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

    (clientGet.get as jest.Mock).mockResolvedValue({ ...response });

    // Act
    const result = await sut.getList(params);

    // Assert
    expect(result).toEqual(response);
  });

});
