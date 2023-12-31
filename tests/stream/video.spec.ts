
import { DeleteClient, GetClient, PostClient, UploadClient } from "@bunnyjs/core";
import { BNVideoStream } from "@bunnyjs/stream/videos";
import { mock, mockClear } from "jest-mock-extended";


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
