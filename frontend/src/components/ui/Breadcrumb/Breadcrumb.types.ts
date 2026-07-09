import { HTMLAttributes, ReactNode } from 'react';

export interface BreadcrumbProps extends HTMLAttributes<HTMLElement> {
  separator?: ReactNode;
}

export interface BreadcrumbItemProps extends HTMLAttributes<HTMLLIElement> {}

export interface BreadcrumbLinkProps extends HTMLAttributes<HTMLAnchorElement> {
  href?: string;
  isCurrentPage?: boolean;
}

export interface BreadcrumbSeparatorProps extends HTMLAttributes<HTMLLIElement> {
  children?: ReactNode;
}
