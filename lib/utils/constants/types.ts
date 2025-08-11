import React from "react";

export interface LoggedUser {
  user: {
    id: string;
    email: string;
  };
  token: string;
}

export interface MenuItem {
  title: string;
  icon: any;
  href: string;
}
