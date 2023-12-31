export type Caption = {
  srclang: string;
  label: string;
};

export type Chapter = {
  title: string;
  start: number;
  end: number;
};

export type Moment = {
  label: string;
  timestamp: number;
};

export type MetaTag = {
  property: string;
  value: string;
};

export type TranscodingMessage = {
  timeStamp: string;
  level: number;
  issueCode: number;
  message: string;
  value: string;
};

export type VideoLibraryItem = {
  videoLibraryId: number;
  guid: string;
  title: string;
  dateUploaded: string;
  views: number;
  isPublic: boolean;
  length: number;
  status: number;
  framerate: number;
  rotation: number;
  width: number;
  height: number;
  availableResolutions: string;
  thumbnailCount: number;
  encodeProgress: number;
  storageSize: number;
  captions: Caption[];
  hasMP4Fallback: boolean;
  collectionId: string;
  thumbnailFileName: string;
  averageWatchTime: number;
  totalWatchTime: number;
  category: string;
  chapters: Chapter[];
  moments: Moment[];
  metaTags: MetaTag[];
  transcodingMessages: TranscodingMessage[];
};
