import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { token: string } }
) {
  return NextResponse.json({
    token: params.token,
  });
}
