import { NextRequest, NextResponse } from 'next/server';
import { readJSON, writeJSON, Post } from '@/lib/data';

function toSlug(title: string, id: string) {
  const base = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'post';
  return `${base}-${id}`;
}

export async function GET() {
  const posts = readJSON<Post[]>('posts.json');
  return NextResponse.json(posts);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const posts = readJSON<Post[]>('posts.json');
  const id = Date.now().toString();
  const newPost: Post = {
    id,
    title: body.title || '',
    slug: toSlug(body.title || '', id),
    excerpt: body.excerpt || '',
    content: body.content || '',
    publishedAt: new Date().toISOString(),
    published: body.published ?? false,
    coverImage: body.coverImage || undefined,
  };
  posts.unshift(newPost);
  writeJSON('posts.json', posts);
  return NextResponse.json(newPost, { status: 201 });
}
