import {
  Chapter,
  DefaultResponse,
  Heatmap,
  MetaTag,
  Moment,
  PaginatedVideoLibraryResponse,
  VideoLibraryItem,
  VideoStatistics,
} from "../@types/bunny";

import {
  APIClient,
  DeleteClient,
  GetClient,
  PostClient,
  UploadClient,
} from "../core";

export interface LibraryIdClient {
  libraryId?: number;
}

export class BNVideoStream {
  constructor(
    private client: GetClient &
      PostClient &
      DeleteClient &
      UploadClient &
      LibraryIdClient
  ) {}

  public get(
    params: BNVideoStream.GetVideoParams
  ): Promise<APIClient.Response<VideoLibraryItem>> {
    const libraryId = this.client.libraryId || params.libraryId;

    if (!libraryId) {
      throw new Error("Library ID is required");
    }

    const endpoint = `/library/${libraryId}/videos/${params.videoId}`;

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
    const libraryId = this.client.libraryId || params.libraryId;

    if (!libraryId) {
      throw new Error("Library ID is required");
    }

    const endpoint = `/library/${libraryId}/videos/${params.videoId}/heatmap`;

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
    const libraryId = this.client.libraryId || params.libraryId;

    if (!libraryId) {
      throw new Error("Library ID is required");
    }

    const endpoint = `/library/${libraryId}/statistics`;

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

    const library = this.client.libraryId || libraryId;

    if (!library) {
      throw new Error("Library ID is required");
    }

    const endpoint = `/library/${library}/videos`;

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

    const library = this.client.libraryId || libraryId;

    if (!library) {
      throw new Error("Library ID is required");
    }

    const endpoint = `/library/${library}/videos/${videoId}`;

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

    const library = this.client.libraryId || libraryId;

    if (!library) {
      throw new Error("Library ID is required");
    }

    const endpoint = `/library/${library}/videos/${videoId}/reencode`;

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
    const { libraryId, ...data } = params;

    const library = this.client.libraryId || libraryId;

    if (!library) {
      throw new Error("Library ID is required");
    }

    const endpoint = `/library/${library}/videos`;

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

    const library = this.client.libraryId || libraryId;

    if (!library) {
      throw new Error("Library ID is required");
    }

    const endpoint = `/library/${library}/videos/${videoId}/thumbnail`;

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

    const library = this.client.libraryId || libraryId;

    if (!library) {
      throw new Error("Library ID is required");
    }

    const endpoint = `/library/${library}/videos/fetch?collectionId=${collectionId}&thumbnailTime=${
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

    const library = this.client.libraryId || libraryId;

    if (!library) {
      throw new Error("Library ID is required");
    }

    const endpoint = `/library/${library}/videos/${videoId}/captions/${data.caption.srclang}`;

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

    const library = this.client.libraryId || libraryId;

    if (!library) {
      throw new Error("Library ID is required");
    }

    const endpoint = `/library/${library}/videos/${videoId}`;

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

    const library = this.client.libraryId || libraryId;

    if (!library) {
      throw new Error("Library ID is required");
    }

    const endpoint = `/library/${library}/videos/${videoId}/captions/${srclang}`;

    const options = {
      headers: {
        accept: "application/json",
      },
    };

    return this.client.delete<DefaultResponse>(endpoint, options);
  }

  public async upload(params: BNVideoStream.UploadVideoParams): Promise<void> {
    const library = this.client.libraryId || params.libraryId;

    if (!library) {
      throw new Error("Library ID is required");
    }

    const newParams = {
      ...params,
      libraryId: library,
    };

    await this.client.upload(newParams);
  }
}

export namespace BNVideoStream {
  export type GetVideoParams = {
    libraryId?: number;
    videoId: string;
  };

  export type GetVideoHeatmapParams = {
    libraryId?: number;
    videoId: string;
  };

  export type GetVideoStatisticsParams = {
    libraryId?: number;
    videoGuid: string;
    dateFrom?: Date;
    dateTo?: Date;
    hourly?: boolean;
  };

  export type GetVideoListParams = {
    libraryId?: number;
    page?: number;
    itemsPerPage?: number;
    search?: string;
    orderBy?: string;
    collection?: string;
  };

  export type UpdateVideoParams = {
    libraryId?: number;
    videoId: string;
    title?: string;
    collectionId?: string;
    chapters?: Chapter[];
    moments?: Moment[];
    metaTags?: MetaTag[];
  };

  export type ReencodeVideoParams = {
    libraryId?: number;
    videoId: string;
  };

  export type CreateVideoParams = {
    libraryId?: number;
    title: string;
    collectionId?: string;
    thumbnailTime?: number;
  };

  export type SetThumbnailVideoParams = {
    libraryId?: number;
    videoId: string;
    thumbnailUrl: string;
  };

  export type FetchVideoParams = {
    libraryId?: number;
    videoId: string;
    collectionId?: string;
    thumbnailTime?: number;
    url: string;
    headers?: Record<string, string>;
    title?: string;
  };

  export type AddCaptionParams = {
    libraryId?: number;
    videoId: string;
    caption: {
      srclang: string;
      label: string;
      captionFile: string;
    };
  };

  export type DeleteVideoParams = {
    libraryId?: number;
    videoId: string;
  };

  export type DeleteCaptionParams = {
    libraryId?: number;
    videoId: string;
    srclang: string;
  };

  export type UploadVideoParams = {
    libraryId?: number;
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
