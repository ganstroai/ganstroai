const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
export const API_PUBLIC_URL = process.env.NEXT_PUBLIC_API_PUBLIC_URL;

const AUTH = "auth";
const LOGIN = "login";
const SIGN_UP = "signup";
const FORGOT_PASSWORD = "forgot-password";
const RESET_PASSWORD = "reset-password";
const TEMPLATES = "templates";
export const CREATE = "create";
const USERS = "users";
const VOICE = "voice";
const UPLOAD = "upload";

export const SIGN_UP_URL = `${API_BASE_URL}/${AUTH}/${SIGN_UP}`;
export const LOGIN_URL = `${API_BASE_URL}/${AUTH}/${LOGIN}`;
export const FORGOT_PASSWORD_URL = `${API_BASE_URL}/${AUTH}/${FORGOT_PASSWORD}`;
export const RESET_PASSWORD_URL = `${API_BASE_URL}/${AUTH}/${RESET_PASSWORD}`;

export const TEMPLATES_URL = `${API_BASE_URL}/${TEMPLATES}`;

export const ADMIN_USERS_URL = `${API_BASE_URL}/${USERS}`;

export const UPLOAD_VOICE_URL = `${API_BASE_URL}/${VOICE}/${UPLOAD}`;
