import React from 'react';

interface ArticleContentProps {
  content: string;
}

export const ArticleContent = ({ content }: ArticleContentProps) => {
  return (
    <article 
      className="prose prose-lg prose-emerald max-w-none text-gray-700 
        prose-headings:font-bold prose-headings:text-gray-900 
        prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
        prose-p:leading-relaxed prose-p:mb-6
        prose-li:my-2
        prose-img:rounded-2xl prose-img:shadow-lg prose-img:w-full prose-img:my-8
        prose-blockquote:border-l-4 prose-blockquote:border-emerald-500 prose-blockquote:bg-emerald-50 prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:rounded-r-xl prose-blockquote:text-gray-900 prose-blockquote:font-medium prose-blockquote:italic
        animate-in fade-in duration-1000"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
};
