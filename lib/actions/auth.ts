import { getCookie, setCookie, deleteCookie } from "cookies-next/client"; // Import from cookies-next/server

import { LoggedUser } from "../utils/constants/types";

export async function saveLoggedUser(loggedUser: LoggedUser) {
  setCookie("loggedUser", loggedUser, {
    path: "/",
    maxAge: 7 * 24 * 60 * 60, // 7 days
    sameSite: "strict",
  });
}
export async function removeLoggedUser() {
  deleteCookie("loggedUser");
}
