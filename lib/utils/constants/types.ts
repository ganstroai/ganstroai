import React from "react";

export interface LoggedUser {
  user: {
    _id: string;
    email: string;
  };
  token: string;
}

export interface MenuItem {
  title: string;
  icon: any;
  href: string;
}
