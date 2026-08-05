import React, { ReactNode } from 'react';

export interface BreadcrumbProps extends React.HTMLAttributes<HTMLElement> {
  separator?: ReactNode;
}

export interface BreadcrumbLinkProps extends React.HTMLAttributes<HTMLAnchorElement> {
  href?: string;
  isCurrentPage?: boolean;
}

export type BreadcrumbItemProps = React.HTMLAttributes<HTMLLIElement>;

export type BreadcrumbSeparatorProps = React.HTMLAttributes<HTMLSpanElement>;
