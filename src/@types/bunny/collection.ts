export type Collection = {
  videoLibraryId: number;
  guid: string;
  name: string;
  videoCount: number;
  totalSize: number;
  previewVideoIds: string;
};

export type CollectionList = {
  totalItems: number;
  currentPage: number;
  itemsPerPage: number;
  items: Collection[];
};
