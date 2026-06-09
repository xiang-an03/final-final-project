import { NextResponse } from "next/server";

type WikiPage = {
  title?: string;
  thumbnail?: {
    source?: string;
  };
};

async function findWikiThumbnail(name: string, host: string) {
  const params = new URLSearchParams({
    action: "query",
    format: "json",
    generator: "search",
    gsrsearch: name,
    gsrnamespace: "0",
    gsrlimit: "1",
    prop: "pageimages",
    piprop: "thumbnail",
    pithumbsize: "640"
  });
  const response = await fetch(`https://${host}/w/api.php?${params.toString()}`, {
    headers: { "User-Agent": "ideal-type-match-demo/1.0" }
  });

  if (!response.ok) {
    return null;
  }

  const data = await response.json();
  const pages = data.query?.pages ? (Object.values(data.query.pages) as WikiPage[]) : [];
  return pages.find((page) => page.thumbnail?.source)?.thumbnail?.source || null;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get("name");

  if (!name) {
    return NextResponse.json({ imageUrl: null }, { status: 400 });
  }

  for (const host of ["en.wikipedia.org", "zh.wikipedia.org", "ja.wikipedia.org"]) {
    try {
      const imageUrl = await findWikiThumbnail(name, host);
      if (imageUrl) {
        return NextResponse.json({ imageUrl, source: host });
      }
    } catch {
      // Try the next public encyclopedia endpoint.
    }
  }

  return NextResponse.json({ imageUrl: null });
}
