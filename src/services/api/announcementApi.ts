import { api } from "./api";

export type AnnouncementCategoryApi =
  | "ALL"
  | "NOTICE"
  | "MAINTENANCE"
  | "UPDATE";

export type NoticeCategoryLabel = "전체" | "안내" | "점검" | "업데이트";

export type NoticeListItem = {
  noticeId: number;
  title: string;
  category: NoticeCategoryLabel;
  categoryApi: Exclude<AnnouncementCategoryApi, "ALL">;
  isPinned: boolean;
  isNew: boolean;
  isRead: boolean;
  createdAt: string;
};

export type NoticePagination = {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  size: number;
};

const categoryLabelMap = {
  NOTICE: "안내",
  MAINTENANCE: "점검",
  UPDATE: "업데이트",
} as const;

const toBool = (value: boolean | number | undefined) => {
  return value === true || value === 1;
};

const formatDate = (date?: string) => {
  if (!date) return "";
  return date.slice(0, 10);
};

const mapNoticeListItem = (item: any): NoticeListItem => ({
  noticeId: item.announcement_id,
  title: item.title,
  category: categoryLabelMap[item.category as keyof typeof categoryLabelMap],
  categoryApi: item.category,
  isPinned: toBool(item.is_pinned),
  isNew: toBool(item.is_new),
  isRead: toBool(item.is_read),
  createdAt: formatDate(item.created_at),
});

type GetAnnouncementsParams = {
  category?: AnnouncementCategoryApi;
  keyword?: string;
  page?: number;
  size?: number;
};

export const getAnnouncements = async ({
  category = "ALL",
  keyword,
  page = 1,
  size = 10,
}: GetAnnouncementsParams) => {
  const res = await api.get("/admin/announcements", {
    params: {
      category,
      keyword,
      page,
      size,
    },
  });

  const data = res.data.data;

  return {
    pinnedAnnouncements: (data.pinned_announcements ?? []).map(
      mapNoticeListItem,
    ),
    announcements: (data.announcements ?? []).map(mapNoticeListItem),
    pagination: {
      currentPage: data.pagination?.current_page ?? page,
      totalPages: data.pagination?.total_pages ?? 1,
      totalCount: data.pagination?.total_count ?? 0,
      size: data.pagination?.size ?? size,
    },
  };
};

export type NoticeDetail = NoticeListItem & {
  content: string;
  createdBy: number;
  updatedAt: string;
};

const mapNoticeDetail = (item: any): NoticeDetail => ({
  noticeId: item.announcement_id,
  title: item.title,
  category: categoryLabelMap[item.category as keyof typeof categoryLabelMap],
  categoryApi: item.category,
  content: item.content,
  isPinned: toBool(item.is_pinned),
  isNew: toBool(item.is_new),
  isRead: true,
  createdBy: item.created_by,
  createdAt: formatDate(item.created_at),
  updatedAt: formatDate(item.updated_at),
});

export const getAnnouncementDetail = async (
  announcementId: number,
): Promise<NoticeDetail> => {
  const res = await api.get(`/admin/announcements/${announcementId}`);

  return mapNoticeDetail(res.data.data);
};

export const markAnnouncementAsRead = async (announcementId: number) => {
  const res = await api.post(`/admin/announcements/${announcementId}/read`);

  return {
    readAt: res.data.data?.read_at ?? "",
  };
};
