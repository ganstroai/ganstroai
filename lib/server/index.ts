"use server";

import axios from "axios";
import { cookies } from "next/headers";
import { getCookie } from "cookies-next/client";
import { LoggedUser } from "../utils/constants/types";

// === Shared Types ===
type ResponseType = "json" | "blob" | "arraybuffer";

type ApiResponse<T> = {
  status: boolean;
  message: string;
  data: T | null;
};

interface BaseOptions {
  url: string;
  notAuthenticated?: boolean;
  headers?: Record<string, string>;
}

interface PostPutOptions<T> extends BaseOptions {
  payload?: any;
  isUploadDocuments?: boolean;
  responseType?: ResponseType;
}

interface GetOptions extends BaseOptions {}

interface FetchListingOptions {
  url: string;
  payload?: any;
}

interface DestroyOptions extends BaseOptions {}

interface FetchDataOptions {
  url: string;
}

// === Token Helper ===
const getTokenFromCookie = async () => {
  const cookieStore = await cookies();

  const loggedUserStr = cookieStore.get("loggedUser")?.value as any;
  if (!loggedUserStr) return null;
  const loggedUser = JSON.parse(loggedUserStr);

  return loggedUser?.token;
};

// === fetchData (GET with native fetch) ===
export const fetchData = async <T>({
  url,
}: FetchDataOptions): Promise<ApiResponse<T>> => {
  let data: T | null = null;
  let message = "";
  let status = false;
  let headers: Record<string, string> = {};

  const token = await getTokenFromCookie();
  headers = { Authorization: `Bearer ${token}` };

  try {
    const response = await fetch(url, {
      headers,
      cache: "no-store",
    });

    if (!response.ok) {
      message = `Network response was not ok: ${response.statusText}`;
    } else {
      data = await response.json();
      message = "Request successful";
      status = true;
    }
  } catch {
    message = "An unknown error occurred";
  }

  return { status, message, data };
};

// === fetchListingData (POST with native fetch) ===
export const fetchListingData = async <T>({
  url,
  payload,
}: FetchListingOptions): Promise<ApiResponse<T>> => {
  let data: T | null = null;
  let message = "";
  let status = false;

  const token = await getTokenFromCookie();

  const requestOptions: RequestInit = {
    method: "POST",
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: payload ? JSON.stringify(payload) : undefined,
  };

  try {
    const response = await fetch(url, requestOptions);

    if (!response.ok) {
      message = `Network response was not ok: ${response.statusText}`;
    } else {
      data = await response.json();
      message = "Request successful";
      status = true;
    }
  } catch {
    message = "An unknown error occurred";
  }

  return { status, message, data };
};

// === GET (Axios) ===
export const get = async <T>({
  url,
  headers = {},
}: GetOptions): Promise<ApiResponse<T>> => {
  let data: T | null = null;
  let message = "";
  let status = false;

  try {
    const token = await getTokenFromCookie();
    headers = { Authorization: `Bearer ${token}` };

    const response = await axios.get<T>(url, { headers });

    data = (response as any)?.data?.data;
    message = (response as any)?.data?.message || "Request successful";
    status = (response as any)?.data?.success || true;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      message = error.response?.data?.message || "Network response was not ok";
      data = error.response?.data?.data || null;
    } else {
      message = "An unknown error occurred";
    }
  }

  return { status, message, data };
};

// === POST (Axios) ===
export const post = async <T>({
  url,
  payload = {},
  isUploadDocuments = false,
  responseType = "json",
  headers = {},
}: PostPutOptions<T>): Promise<ApiResponse<T>> => {
  let data: T | null = null;
  let message = "";
  let status = false;

  const token = await getTokenFromCookie();
  headers = { ...headers, Authorization: `Bearer ${token}` };

  if (isUploadDocuments) {
    headers["content-type"] = "multipart/form-data";
  }

  if (responseType === "arraybuffer") {
    headers.Accept = "application/pdf";
    headers["Content-Type"] = "application/json";
  }

  try {
    const response = await axios.post<T>(url, payload, {
      headers,
      responseType,
    });

    data = (response as any)?.data?.data;
    message = (response as any)?.data?.message || "Request successful";
    status = (response as any)?.data?.success || true;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      message = error.response?.data?.message || "Network response was not ok";
      data = error.response?.data?.data || null;
    } else {
      message = "An unknown error occurred";
    }
  }

  return { status, message, data };
};

// === PUT (Axios) ===
export const put = async <T>({
  url,
  payload,
  isUploadDocuments = false,
  headers = {},
}: PostPutOptions<T>): Promise<ApiResponse<T>> => {
  let data: T | null = null;
  let message = "";
  let status = false;

  const token = await getTokenFromCookie();
  headers = { ...headers, Authorization: `Bearer ${token}` };

  if (isUploadDocuments) {
    headers["content-type"] = "multipart/form-data";
  }

  try {
    const response = await axios.put<T>(url, payload, { headers });

    data = response.data;
    message = (response as any)?.data?.message || "Request successful";
    status = (response as any)?.data?.success || true;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      message = error.response?.data?.message || "Network response was not ok";
      data = error.response?.data?.data || null;
    } else {
      message = "An unknown error occurred";
    }
  }

  return { status, message, data };
};

// === DELETE (Axios) ===
export const destroy = async <T>({
  url,

  headers = {},
}: DestroyOptions): Promise<ApiResponse<T>> => {
  let data: T | null = null;
  let message = "";
  let status = false;

  const token = await getTokenFromCookie();
  headers = { ...headers, Authorization: `Bearer ${token}` };

  try {
    const response = await axios.delete<T>(url, { headers });

    data = response.data;
    message = (response as any)?.data?.message || "Request successful";
    status = (response as any)?.data?.success || true;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      message = error.response?.data?.message || "Network response was not ok";
      data = error.response?.data?.data || null;
    } else {
      message = "An unknown error occurred";
    }
  }

  return { status, message, data };
};
