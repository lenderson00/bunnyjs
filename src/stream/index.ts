import * as CORE from "../core";
import { BNVideoStream } from "./videos";
import { BNCollection } from "./collections";

type ClientOptions = {
  accessKey?: string;
  baseUrl?: string;
  libraryId?: string;
};

export class BunnyStreamClient extends CORE.APIClient {
  public videos: BNVideoStream;
  public collections: BNCollection;
  public libraryId?: string;

  constructor(options?: ClientOptions) {
    super({
      baseUrl:
        options?.baseUrl ||
        CORE.readEnv("BUNNY_STREAM_BASE_URL") ||
        "https://video.bunnycdn.com",
      accessKey: options?.accessKey || CORE.readEnv("BUNNY_STREAM_ACCESS_KEY"),
    });

    this.libraryId =
      options?.libraryId || CORE.readEnv("BUNNY_STREAM_LIBRARY_ID");

    this.videos = new BNVideoStream(this as any);
    this.collections = new BNCollection(this as any);
  }
}
