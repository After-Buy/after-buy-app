import { api } from "./api";

export type FaqListItem = {
  faqId: number;
  title: string;
  createdAt: string;
  updatedAt: string;
};

export type FaqDetail = {
  faqId: number;
  title: string;
  content: string;
  createdBy: number;
  createdAt: string;
  updatedAt: string;
};

export type FaqPagination = {
  size: number;
  currentPage: number;
  totalPages: number;
  totalCount: number;
};

const formatDate = (date?: string) => {
  if (!date) return "";
  return date.slice(0, 10);
};

const normalizeFaqListItem = (item: any): FaqListItem => ({
  faqId: item.faq_id,
  title: item.title ?? "",
  createdAt: formatDate(item.created_at),
  updatedAt: formatDate(item.updated_at),
});

const normalizeFaqDetail = (item: any): FaqDetail => ({
  faqId: item.faq_id,
  title: item.title ?? "",
  content: item.content ?? "",
  createdBy: item.created_by,
  createdAt: formatDate(item.created_at),
  updatedAt: formatDate(item.updated_at),
});

export const getFaqList = async ({
  keyword = "",
  page = 1,
  size = 10,
}: {
  keyword?: string;
  page?: number;
  size?: number;
}) => {
  const response = await api.get("/admin/faqs", {
    params: {
      keyword: keyword || undefined,
      page,
      size,
    },
  });

  const data = response.data?.data;

  return {
    faqs: (data?.faqs ?? []).map(normalizeFaqListItem),
    pagination: {
      currentPage: data?.pagination?.current_page ?? page,
      totalPages: data?.pagination?.total_pages ?? 1,
      totalCount: data?.pagination?.total_count ?? 0,
      size: data?.pagination?.size ?? size,
    },
  };
};

export const getFaqDetail = async (faqId: number) => {
  const response = await api.get(`/admin/faqs/${faqId}`);

  return normalizeFaqDetail(response.data?.data);
};
