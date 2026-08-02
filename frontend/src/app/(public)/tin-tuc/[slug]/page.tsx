import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { mockNews } from '@/mock/news';
import { PageContainer } from '@/components/layout/core';
import { CallToAction } from '@/components/news/CallToAction';
import {
  ArticleHero,
  ArticleContent,
  TableOfContents,
  AuthorCard,
  ShareButtons,
  RelatedArticles,
  CommentsPreview,
  BackToNews
} from '@/components/news-detail';

interface NewsDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: NewsDetailPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const article = mockNews.find(n => n.slug === resolvedParams.slug);
  
  if (!article) {
    return {
      title: 'Không tìm thấy bài viết | AgriMarket'
    };
  }

  return {
    title: `${article.title} | AgriMarket`,
    description: article.description,
    openGraph: {
      title: article.title,
      description: article.description,
      images: [article.image]
    }
  };
}

export default async function NewsDetailPage({ params }: NewsDetailPageProps) {
  const resolvedParams = await params;
  const article = mockNews.find(n => n.slug === resolvedParams.slug);

  if (!article) {
    notFound();
  }

  // Get 4 related articles (excluding the current one)
  const relatedArticles = mockNews
    .filter(n => n.id !== article.id)
    .slice(0, 4);

  return (
    <div className="bg-white min-h-screen">
      <ArticleHero article={article} />

      <PageContainer>
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 py-6 text-sm text-gray-500 overflow-x-auto whitespace-nowrap">
          <Link href="/" className="hover:text-emerald-600 flex items-center gap-1">
            <Home className="w-4 h-4" />
            Trang chủ
          </Link>
          <ChevronRight className="w-4 h-4" />
          <Link href="/tin-tuc" className="hover:text-emerald-600">
            Tin tức
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 font-medium truncate max-w-[200px] sm:max-w-md">
            {article.title}
          </span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 pb-16">
          {/* Main Content Area */}
          <div className="lg:w-[70%]">
            <ArticleContent content={article.content} />
            <ShareButtons />
            <AuthorCard author={article.author} />
            <CommentsPreview />
            <BackToNews />
          </div>

          {/* Sidebar Area */}
          <div className="lg:w-[30%] hidden lg:block">
            <TableOfContents />
          </div>
        </div>

        <div className="border-t border-gray-100 pb-16">
          <RelatedArticles articles={relatedArticles} />
        </div>
      </PageContainer>
      
      <CallToAction />
    </div>
  );
}
