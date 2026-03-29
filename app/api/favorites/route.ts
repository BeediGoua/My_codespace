import { promises as fs } from 'fs';
import path from 'path';
import { NextRequest, NextResponse } from 'next/server';

const FAVORITES_PATH = path.join(process.cwd(), 'data', 'favorites.json');

export async function GET(req: NextRequest) {
  const data = await fs.readFile(FAVORITES_PATH, 'utf-8');
  const favorites = JSON.parse(data);
  return NextResponse.json(favorites);
}

export async function POST(req: NextRequest) {
  const { user, project } = await req.json();
  const data = await fs.readFile(FAVORITES_PATH, 'utf-8');
  const favorites = JSON.parse(data);
  const exists = favorites.some((fav: any) => fav.user === user && fav.project === project);
  if (!exists) {
    favorites.push({ user, project, createdAt: new Date().toISOString() });
    await fs.writeFile(FAVORITES_PATH, JSON.stringify(favorites, null, 2));
  }
  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  const { user, project } = await req.json();
  const data = await fs.readFile(FAVORITES_PATH, 'utf-8');
  let favorites = JSON.parse(data);
  favorites = favorites.filter((fav: any) => !(fav.user === user && fav.project === project));
  await fs.writeFile(FAVORITES_PATH, JSON.stringify(favorites, null, 2));
  return NextResponse.json({ success: true });
}
