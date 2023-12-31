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
import { APIClient, DeleteClient, GetClient, PostClient, UploadClient } from "@bunnyjs/core";
import { mock, mockClear } from "jest-mock-extended";

class BNVideoStream {
  constructor(private client: GetClient & PostClient & DeleteClient & UploadClient) {}

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

  public reencode(
    params: BNVideoStream.UpdateVideoParams
  ): Promise<APIClient.Response<VideoLibraryItem>> {
    const { libraryId, videoId } = params;

    const endpoint = `/library/${libraryId}/videos/${videoId}/reencode`;

    const options = {
      headers: {
        accept: "application/json",
      },
    };

    return this.client.post<VideoLibraryItem>(endpoint, options);
  }

  public create(
    params: BNVideoStream.CreateVideoParams
  ): Promise<APIClient.Response<VideoLibraryItem>> {
    const { libraryId, videoId, ...data } = params;

    const endpoint = `/library/${libraryId}/videos/${videoId}`;

    const options = {
      headers: {
        accept: "application/json",
        "content-type": "application/*+json",
      },
      data,
    };

    return this.client.post<VideoLibraryItem>(endpoint, options);
  }

  public setThumbnail(
    params: BNVideoStream.SetThumbnailVideoParams
  ): Promise<APIClient.Response<DefaultResponse>> {
    const { libraryId, videoId, ...data } = params;

    const endpoint = `/library/${libraryId}/videos/${videoId}/thumbnail`;

    const options = {
      headers: {
        accept: "application/json",
      },
      data,
    };

    return this.client.post<DefaultResponse>(endpoint, options);
  }

  public fetch(
    params: BNVideoStream.FetchVideoParams
  ): Promise<APIClient.Response<DefaultResponse>> {
    const { libraryId, videoId, collectionId, thumbnailTime, ...data } = params;

    const endpoint = `/library/${libraryId}/videos/fetch?collectionId=${collectionId}&thumbnailTime=${
      thumbnailTime || ""
    }`;

    const options = {
      headers: {
        accept: "application/json",
        "content-type": "application/*+json",
      },
      data,
    };

    return this.client.post<DefaultResponse>(endpoint, options);
  }

  public addCaption(
    params: BNVideoStream.AddCaptionParams
  ): Promise<APIClient.Response<DefaultResponse>> {
    const { libraryId, videoId, ...data } = params;
    const endpoint = `/library/${libraryId}/videos/${videoId}/captions/${data.caption.srclang}`;

    const options = {
      headers: {
        accept: "application/json",
        "content-type": "application/*+json",
      },
      data: {
        srclang: data.caption.srclang,
        label: data.caption.label,
        captionFile: data.caption.captionFile,
      },
    };

    return this.client.post<DefaultResponse>(endpoint, options);
  }

  public delete(
    params: BNVideoStream.DeleteVideoParams
  ): Promise<APIClient.Response<DefaultResponse>> {
    const { libraryId, videoId } = params;

    const endpoint = `/library/${libraryId}/videos/${videoId}`;

    const options = {
      headers: {
        accept: "application/json",
      },
    };

    return this.client.delete<DefaultResponse>(endpoint, options);
  }

  public deleteCaption(
    params: BNVideoStream.DeleteCaptionParams
  ): Promise<APIClient.Response<DefaultResponse>> {
    const { libraryId, videoId, srclang } = params;

    const endpoint = `/library/${libraryId}/videos/${videoId}/captions/${srclang}`;

    const options = {
      headers: {
        accept: "application/json",
      },
    };

    return this.client.delete<DefaultResponse>(endpoint, options);
  }

  public async upload(
    params: BNVideoStream.UploadVideoParams
  ): Promise<void> {
   
    await this.client.upload(params);
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

  export type ReencodeVideoParams = {
    libraryId: number;
    videoId: string;
  };

  export type CreateVideoParams = {
    libraryId: number;
    videoId: string;
    title: string;
    collectionId: string;
    thumbnailTime: number;
  };

  export type SetThumbnailVideoParams = {
    libraryId: number;
    videoId: string;
    thumbnailUrl: string;
  };

  export type FetchVideoParams = {
    libraryId: number;
    videoId: string;
    collectionId?: string;
    thumbnailTime?: number;
    url: string;
    headers?: Record<string, string>;
    title?: string;
  };

  export type AddCaptionParams = {
    libraryId: number;
    videoId: string;
    caption: {
      srclang: string;
      label: string;
      captionFile: string;
    };
  };

  export type DeleteVideoParams = {
    libraryId: number;
    videoId: string;
  };

  export type DeleteCaptionParams = {
    libraryId: number;
    videoId: string;
    srclang: string;
  };

  export type UploadVideoParams = {
    libraryId: number;
    videoId: string;
    file: File | Blob | Pick<ReadableStreamDefaultReader<any>, "read">;
    metadata: {
      filetype: string;
      title: string;
      collection?: string;
      thumbnailTime?: number;
    };
    expireTime?: number;
    retryDelays?: number[];
    onError?: (error: any) => void;
    onProgress?: (bytesUploaded: number, bytesTotal: number) => void;
    onSuccess?: () => void;
  };
}

describe("Video Stream", () => {
  let client: GetClient & PostClient & DeleteClient & UploadClient;
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

  it("should reencode a video", async () => {
    const params: BNVideoStream.ReencodeVideoParams = {
      libraryId: 123,
      videoId: "video12345",
    };

    sut.reencode(params);

    expect(client.post).toHaveBeenCalledWith(
      "/library/123/videos/video12345/reencode",
      {
        headers: {
          accept: "application/json",
        },
      }
    );
  });

  it("should create a video", async () => {
    const params: BNVideoStream.CreateVideoParams = {
      libraryId: 123,
      videoId: "video12345",
      title: "Example Video Title",
      collectionId: "collection123",
      thumbnailTime: 30,
    };

    sut.create(params);

    expect(client.post).toHaveBeenCalledWith("/library/123/videos/video12345", {
      headers: {
        accept: "application/json",
        "content-type": "application/*+json",
      },
      data: {
        title: "Example Video Title",
        collectionId: "collection123",
        thumbnailTime: 30,
      },
    });
  });

  it("should set thumbnails for a video", async () => {
    const params: BNVideoStream.SetThumbnailVideoParams = {
      libraryId: 123,
      videoId: "video12345",
      thumbnailUrl: "https://example.com/thumbnail.png",
    };

    sut.setThumbnail(params);

    expect(client.post).toHaveBeenCalledWith(
      "/library/123/videos/video12345/thumbnail",
      {
        headers: {
          accept: "application/json",
        },
        data: {
          thumbnailUrl: "https://example.com/thumbnail.png",
        },
      }
    );

    expect(client.post).toHaveBeenCalledTimes(1);
  });

  it("should fecth a video from url", async () => {
    const params: BNVideoStream.FetchVideoParams = {
      libraryId: 123,
      videoId: "456",
      collectionId: "231231",
      url: "https://example.com/video.mp4",
      title: "Example Video Title",
      headers: {
        "x-foo": "bar",
      },
    };

    sut.fetch(params);

    expect(client.post).toHaveBeenCalledWith(
      "/library/123/videos/fetch?collectionId=231231&thumbnailTime=",
      {
        headers: {
          accept: "application/json",
          "content-type": "application/*+json",
        },
        data: {
          url: "https://example.com/video.mp4",
          title: "Example Video Title",
          headers: {
            "x-foo": "bar",
          },
        },
      }
    );

    expect(client.post).toHaveBeenCalledTimes(1);
  });

  it("should add caption for a given video", async () => {
    const params: BNVideoStream.AddCaptionParams = {
      libraryId: 123,
      videoId: "456",
      caption: {
        srclang: "en",
        label: "English",
        captionFile: "caption_in_base64",
      },
    };

    sut.addCaption(params);

    expect(client.post).toHaveBeenCalledWith(
      "/library/123/videos/456/captions/en",
      {
        headers: {
          accept: "application/json",
          "content-type": "application/*+json",
        },
        data: {
          srclang: "en",
          label: "English",
          captionFile: "caption_in_base64",
        },
      }
    );

    expect(client.post).toHaveBeenCalledTimes(1);
  });

  it("should delete a video", async () => {
    const params: BNVideoStream.DeleteVideoParams = {
      libraryId: 123,
      videoId: "456",
    };

    sut.delete(params);

    expect(client.delete).toHaveBeenCalledWith("/library/123/videos/456", {
      headers: {
        accept: "application/json",
      },
    });

    expect(client.delete).toHaveBeenCalledTimes(1);
  });

  it("should delete a caption", async () => {
    const params: BNVideoStream.DeleteCaptionParams = {
      libraryId: 123,
      videoId: "456",
      srclang: "en",
    };

    sut.deleteCaption(params);

    expect(client.delete).toHaveBeenCalledWith(
      "/library/123/videos/456/captions/en",
      {
        headers: {
          accept: "application/json",
        },
      }
    );
  });

  it("should upload a video", async () => {
    const params: BNVideoStream.UploadVideoParams = {
      libraryId: 123,
      videoId: "456",
      file: new File([""], "video.mp4"),
      metadata: {
        filetype: "video/mp4",
        title: "Example Video Title",
        collection: "231231",
        thumbnailTime: 30,
      },
    };

    sut.upload(params);

    expect(client.upload).toHaveBeenCalledWith(params);
    expect(client.upload).toHaveBeenCalledTimes(1);

  })
});
