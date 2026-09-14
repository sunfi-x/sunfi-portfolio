import { NextResponse } from "next/server";

export const revalidate = 3600; // Cache for 1 hour

export async function GET() {
  let repos = 20;
  let followers = 2;
  let contributions = 206;

  try {
    const res = await fetch("https://api.github.com/users/sunfi-x", {
      headers: {
        "User-Agent": "sunfi-portfolio"
      },
      next: { revalidate: 3600 }
    });

    if (res.ok) {
      const data = await res.json();
      if (typeof data.public_repos === "number") {
        repos = data.public_repos;
      }
      if (typeof data.followers === "number") {
        followers = data.followers;
      }
    }
  } catch (e) {
    console.warn("Failed to fetch GitHub profile API:", e);
  }

  try {
    const contribRes = await fetch("https://github-contributions-api.jogruber.de/v4/sunfi-x", {
      next: { revalidate: 3600 }
    });

    if (contribRes.ok) {
      const contribData = await contribRes.json();
      if (contribData && contribData.total) {
        const values = Object.values(contribData.total) as number[];
        const totalSum = values.reduce((acc, curr) => acc + (typeof curr === "number" ? curr : 0), 0);
        if (totalSum > 0) {
          contributions = totalSum;
        }
      }
    }
  } catch (e) {
    console.warn("Failed to fetch GitHub contributions API:", e);
  }

  return NextResponse.json({
    repos,
    followers,
    contributions
  });
}
