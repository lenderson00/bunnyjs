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

import {
  APIClient,
  DeleteClient,
  GetClient,
  PostClient,
  UploadClient,
} from "@bunnyjs/core";

export class BNVideoStream {
  constructor(
    private client: GetClient & PostClient & DeleteClient & UploadClient
  ) {}

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

  public async upload(params: BNVideoStream.UploadVideoParams): Promise<void> {
    await this.client.upload(params);
  }
}

export namespace BNVideoStream {
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
