import { promises as fs } from 'fs';
import path from 'path';
import { NextRequest, NextResponse } from 'next/server';

const RECENTS_PATH = path.join(process.cwd(), 'data', 'recents.json');

type Recent = {
    user: string;
    project: string;
    lastAccessedAt: string;
};

export async function GET() {
    const data = await fs.readFile(RECENTS_PATH, 'utf-8');
    const recents: Recent[] = JSON.parse(data);
    return NextResponse.json(recents);
}

export async function POST(req: NextRequest) {
    const { user, project } = await req.json();
    const data = await fs.readFile(RECENTS_PATH, 'utf-8');
    let recents: Recent[] = JSON.parse(data);
    // Remove any existing entry for this user/project
    recents = recents.filter((r) => !(r.user === user && r.project === project));
    // Add new entry at the start
    recents.unshift({ user, project, lastAccessedAt: new Date().toISOString() });
    // Optionally, limit the number of recents per user
    recents = recents.filter((r, i, arr) =>
        arr.findIndex(x => x.user === r.user && x.project === r.project) === i
    );
    await fs.writeFile(RECENTS_PATH, JSON.stringify(recents, null, 2));
    return NextResponse.json({ success: true });
}
