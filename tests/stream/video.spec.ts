import { VideoLibraryItem } from "@bunnyjs/@types/bunny";
import { APIClientGet } from "@bunnyjs/core";
import { mock, mockClear } from "jest-mock-extended";

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

  public getHeatmap(params: BNVideoStream.GetVideoHeatmapParams): Promise<any> {
    const endpoint = `/library/${params.libraryId}/videos/${params.videoId}/heatmap`;

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

  export type GetVideoHeatmapParams = {
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

  afterEach(() => {
    mockClear(client);
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

    expect(client.get).toHaveBeenCalledTimes(1);
  });

  it("should get a heatmap for a single video", async () => {
    const params: BNVideoStream.GetVideoParams = {
      libraryId: 123,
      videoId: "456",
    };

    sut.getHeatmap(params);

    expect(client.get).toHaveBeenCalledWith("/library/123/videos/456/heatmap", {
      headers: {
        accept: "application/json",
      },
    });

    expect(client.get).toHaveBeenCalledTimes(1);
  });
});
