import { ReactNode } from 'react';

export interface Media {
  content: string;
  icon: ReactNode;
}
export interface Comment {
  image: string;
  userName: string;
  description: string;
}

export interface ADSlot {
  active: boolean;
  createdAt: string;
  _id: string;
  isCurrentStorage: boolean;
  name: string;
  numOfSlots: number;
  paypalPlan: string;
  price: number;
  updatedAt: string;
}
export interface IPaginate {
  page: number;
  pageSize: number;
}

export interface IPagination {
  total?: number;
  limit: number;
  start?: number;
  currentPage: number;
  totalPages?: number;
}

export interface IOption {
  label: string;
  value: string | number;
  name?: string;
}

export interface IRadioOption {
  content: ReactNode;
  value: string;
}

export interface IPostLike {
  avatar: string;
  firstName: string;
  lastName: string;
  username: string;
  _id: string;
}

export interface DataOptionPassEdit {
  song: object;
  _id: string;
}

export interface OptionsFiltersProps {
  value: string;
  label: string;
}
export interface FiltersProps {
  title: string;
  name: string;
  label: string;
  multi: boolean;
  all: string;
  opions: IOption[];
}
