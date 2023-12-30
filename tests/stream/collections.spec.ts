import { mock } from "jest-mock-extended";
import { APIClient } from "@bunnyjs/core";

interface APIClientGet {
    get: (endpoint: string, input?: APIClient.Request) => Promise<APIClient.Response>;
}


class BNCollection {
  constructor(private clientGet: APIClientGet) {}

  async getList(params: GetCollectionListParams): Promise<void> {
    const { libraryId, ...data } = params;
    const endpoint = `/library/${libraryId}/collections`;

    const input = {
        headers: {
            accept: 'application/json'
        },
        data
    }

    this.clientGet.get(endpoint, input);
  }
}

type GetCollectionListParams = {
    libraryId: string;
    page?: number;
    itemsPerPage?: number;
    search?: string;
    orderBy?: string;
};

describe("Collections Stream", () => {
  let clientGet: APIClientGet;
  let sut: BNCollection

  beforeEach(() => {
    clientGet = mock<APIClientGet>();
    sut = new BNCollection(clientGet);
  }) 

  it("should call Client.get with corrects params", async () => {
    const params: GetCollectionListParams = {
        libraryId: "123",
        orderBy: "date"
    }
    // Act
    await sut.getList(params);

    // Assert
    expect(clientGet.get).toHaveBeenCalledWith("/library/123/collections", { 
        headers: {
            accept: 'application/json'
        },
        data: {
            orderBy: "date"
        }
    });
    expect(clientGet.get).toHaveBeenCalledTimes(1);

  });
});
