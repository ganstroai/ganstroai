"use server";

import { revalidatePath } from "next/cache";
import { destroy, post, put } from "../server";

interface GenericDeleteActionProps {
  url: string;
  pathsToReValidate?: string[];
}

interface GenericAddUpdateActionProps {
  payload: any;
  url: string;
  pathsToReValidate?: string[];
  isEdit: boolean;
  notAuthenticated?: boolean;
  isUploadDocuments?: boolean;
  responseType?: "json" | "blob" | "arraybuffer";
}

export const createAndUpdateGenericAction = async ({
  payload,
  url,
  pathsToReValidate,
  isEdit,
  notAuthenticated = false,
  isUploadDocuments = false,
  responseType,
}: GenericAddUpdateActionProps) => {
  const apiFn = isEdit ? put : post;

  const { status, message, data } = await apiFn({
    url,
    payload,
    notAuthenticated,
    isUploadDocuments,
    responseType,
  });

  if (Array.isArray(pathsToReValidate) && pathsToReValidate.length > 0) {
    pathsToReValidate.forEach((path) => revalidatePath(path));
  }

  return { status, data, message };
};

export const deleteGenericAction = async ({
  url,
  pathsToReValidate,
}: GenericDeleteActionProps) => {
  const { status, message, data } = await destroy({ url });

  if (Array.isArray(pathsToReValidate) && pathsToReValidate.length > 0) {
    pathsToReValidate.forEach((path) => revalidatePath(path));
  }

  return { status, data, message };
};
