import { HTMLAttributes, ReactNode } from 'react';

export interface AccordionItemProps {
  id: string;
  title: ReactNode;
  content: ReactNode;
}

export interface AccordionProps extends HTMLAttributes<HTMLDivElement> {
  items: AccordionItemProps[];
  /** Nếu true, cho phép mở nhiều tab cùng lúc. Nếu false, mở tab này sẽ đóng tab kia. */
  allowMultiple?: boolean;
}
