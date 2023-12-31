import { VideoLibraryItem } from "@bunnyjs/@types/bunny";
import { APIClientGet } from "@bunnyjs/core";
import { mock } from "jest-mock-extended";

class BNVideoStream {
  constructor(private client: APIClientGet) {}

  public getList(params: BNVideoStream.GetVideoParams): Promise<any> {
    const endpoint = `/library/${params.libraryId}/videos/${params.videoId}`;

    const options = {
      headers: {
        accept: "application/json",
      },
    };

    return this.client.get<VideoLibraryItem>(endpoint, options);
  }
}

namespace BNVideoStream {
  export type GetVideoParams = {
    libraryId: number;
    videoId: string;
  };
}

describe("Video Stream", () => {
  let client: APIClientGet;
  let sut: BNVideoStream;

  beforeAll(() => {
    client = mock();
  });

  beforeEach(() => {
    sut = new BNVideoStream(client);
  });
  
  it("should get a single video", async () => {
    const params: BNVideoStream.GetVideoParams = {
      libraryId: 123,
      videoId: "456",
    };

    sut.getList(params);

    expect(client.get).toHaveBeenCalledWith("/library/123/videos/456", {
      headers: {
        accept: "application/json",
      },
    });
  });
});
