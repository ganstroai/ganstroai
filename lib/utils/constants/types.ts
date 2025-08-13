import React from "react";

export interface LoggedUser {
  user: {
    _id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: "user" | "admin";
    createdAt: string;
  };
  token: string;
}

export interface MenuItem {
  title: string;
  icon: any;
  href: string;
}

export interface ParamsProps {
  params: { id: string };
}
