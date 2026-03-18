import { NextRequest, NextResponse } from 'next/server';
import { readJSON, writeJSON, Post } from '@/lib/data';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const posts = readJSON<Post[]>('posts.json');
  const index = posts.findIndex((p) => p.id === id);
  if (index === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  posts[index] = {
    ...posts[index],
    title: body.title ?? posts[index].title,
    excerpt: body.excerpt ?? posts[index].excerpt,
    content: body.content ?? posts[index].content,
    published: body.published ?? posts[index].published,
    coverImage: body.coverImage !== undefined ? (body.coverImage || undefined) : posts[index].coverImage,
  };
  writeJSON('posts.json', posts);
  return NextResponse.json(posts[index]);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const posts = readJSON<Post[]>('posts.json');
  const filtered = posts.filter((p) => p.id !== id);
  if (filtered.length === posts.length) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  writeJSON('posts.json', filtered);
  return NextResponse.json({ success: true });
}
