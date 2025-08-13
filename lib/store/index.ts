import { atomWithStorage } from "jotai/utils";
import { LoggedUser } from "../utils/constants/types";

export const loggedUserAtom = atomWithStorage<LoggedUser | null>(
  "loggedUser",
  null,
);
