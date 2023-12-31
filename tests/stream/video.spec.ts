import {
  Chapter,
  DefaultResponse,
  Heatmap,
  MetaTag,
  Moment,
  PaginatedVideoLibraryResponse,
  VideoLibraryItem,
  VideoStatistics,
} from "@bunnyjs/@types/bunny";
import { APIClient, GetClient, PostClient } from "@bunnyjs/core";
import { mock, mockClear } from "jest-mock-extended";

class BNVideoStream {
  constructor(private client: GetClient & PostClient) {}

  public get(
    params: BNVideoStream.GetVideoParams
  ): Promise<APIClient.Response<VideoLibraryItem>> {
    const endpoint = `/library/${params.libraryId}/videos/${params.videoId}`;

    const options = {
      headers: {
        accept: "application/json",
      },
    };

    return this.client.get<VideoLibraryItem>(endpoint, options);
  }

  public getHeatmap(
    params: BNVideoStream.GetVideoHeatmapParams
  ): Promise<APIClient.Response<Heatmap>> {
    const endpoint = `/library/${params.libraryId}/videos/${params.videoId}/heatmap`;

    const options = {
      headers: {
        accept: "application/json",
      },
    };

    return this.client.get<Heatmap>(endpoint, options);
  }

  public getStatistics(
    params: BNVideoStream.GetVideoStatisticsParams
  ): Promise<APIClient.Response<VideoStatistics>> {
    const endpoint = `/library/${params.libraryId}/statistics`;

    const options = {
      headers: {
        accept: "application/json",
      },
    };

    return this.client.get<VideoStatistics>(endpoint, options);
  }

  public getList(
    params: BNVideoStream.GetVideoListParams
  ): Promise<APIClient.Response<PaginatedVideoLibraryResponse>> {
    const { libraryId, ...data } = params;

    const endpoint = `/library/${params.libraryId}/videos`;

    const options = {
      headers: {
        accept: "application/json",
      },
      data,
    };

    return this.client.get<PaginatedVideoLibraryResponse>(endpoint, options);
  }

  public update(
    params: BNVideoStream.UpdateVideoParams
  ): Promise<APIClient.Response<DefaultResponse>> {
    const { libraryId, videoId, ...data } = params;

    const endpoint = `/library/${libraryId}/videos/${videoId}`;

    const options = {
      headers: {
        accept: "application/json",
        "content-type": "application/*+json",
      },
      data,
    };

    return this.client.post<DefaultResponse>(endpoint, options);
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

  export type GetVideoStatisticsParams = {
    libraryId: number;
    videoGuid: string;
    dateFrom?: Date;
    dateTo?: Date;
    hourly?: boolean;
  };

  export type GetVideoListParams = {
    libraryId: number;
    page?: number;
    itemsPerPage?: number;
    search?: string;
    orderBy?: string;
    collection?: string;
  };

  export type UpdateVideoParams = {
    libraryId: number;
    videoId: string;
    title?: string;
    collectionId?: string;
    chapters?: Chapter[];
    moments?: Moment[];
    metaTags?: MetaTag[];
  };
}

describe("Video Stream", () => {
  let client: GetClient & PostClient;
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

    sut.get(params);

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

  it("should get the video statistics", async () => {
    const params: BNVideoStream.GetVideoStatisticsParams = {
      libraryId: 123,
      videoGuid: "456",
    };

    sut.getStatistics(params);

    expect(client.get).toHaveBeenCalledWith("/library/123/statistics", {
      headers: {
        accept: "application/json",
      },
    });

    expect(client.get).toHaveBeenCalledTimes(1);
  });

  it("should list all videos in a given library", async () => {
    const params: BNVideoStream.GetVideoListParams = {
      libraryId: 123,
      page: 1,
      itemsPerPage: 10,
      search: "foo",
    };

    sut.getList(params);

    expect(client.get).toHaveBeenCalledWith("/library/123/videos", {
      headers: {
        accept: "application/json",
      },
      data: {
        page: 1,
        itemsPerPage: 10,
        search: "foo",
      },
    });

    expect(client.get).toHaveBeenCalledTimes(1);
  });

  it("should update a video", async () => {
    const params: BNVideoStream.UpdateVideoParams = {
      libraryId: 123,
      videoId: "video12345",
      title: "Example Video Title",
      collectionId: "collection123",
      chapters: [
        { title: "Chapter 1", start: 0, end: 60 },
        { title: "Chapter 2", start: 61, end: 120 },
      ],
      moments: [{ label: "Interesting Moment", timestamp: 30 }],
      metaTags: [
        { property: "keyword", value: "education" },
        {
          property: "description",
          value: "An educational video about TypeScript",
        },
      ],
    };

    sut.update(params);

    expect(client.post).toHaveBeenCalledWith("/library/123/videos/video12345", {
      headers: {
        accept: "application/json",
        "content-type": "application/*+json",
      },
      data: {
        title: "Example Video Title",
        collectionId: "collection123",
        chapters: [
          { title: "Chapter 1", start: 0, end: 60 },
          { title: "Chapter 2", start: 61, end: 120 },
        ],
        moments: [{ label: "Interesting Moment", timestamp: 30 }],
        metaTags: [
          { property: "keyword", value: "education" },
          {
            property: "description",
            value: "An educational video about TypeScript",
          },
        ],
      },
    });
  });
});
