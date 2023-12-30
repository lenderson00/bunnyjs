import { mock, mockClear } from "jest-mock-extended";
import { APIClient } from "@bunnyjs/core";

interface APIClientGet {
  get: <T> (
    endpoint: string,
    input?: APIClient.Request
  ) => Promise<APIClient.Response<T>>;
}

class BNCollection {
  constructor(private clientGet: APIClientGet) {}

  async getList(
    params: GetCollectionListParams
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

type GetCollectionListParams = {
  libraryId: string;
  page?: number;
  itemsPerPage?: number;
  search?: string;
  orderBy?: string;
};

type Collection = {
  videoLibraryId: number;
  guid: string;
  name: string;
  videoCount: number;
  totalSize: number;
  previewVideoIds: string;
};

type CollectionList = {
  totalItems: number;
  currentPage: number;
  itemsPerPage: number;
  items: Collection[];
};

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
    const params: GetCollectionListParams = {
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
    const params: GetCollectionListParams = {
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

    (clientGet.get as jest.Mock).mockResolvedValue({ ...response  })

    // Act
    const result = await sut.getList(params);

    // Assert
    expect(result).toEqual(response);
  })
});
