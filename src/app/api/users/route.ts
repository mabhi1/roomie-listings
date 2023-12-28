import { createDBUser, getAllDBUsers, getUserByEmailAndProvider, getUserById } from "@/prisma/db/users";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const uid: string = searchParams.get("uid")!;
  const email: string = searchParams.get("email")!;
  const provider: string = searchParams.get("provider")!;
  let res;
  try {
    if (email && provider) res = await getUserByEmailAndProvider(email, provider);
    else if (uid) res = await getUserById(uid);
    res = await getAllDBUsers();
    return NextResponse.json({ data: res, error: null });
  } catch (error: any) {
    return NextResponse.json({ data: null, error: error.message });
  }
}

export async function POST(request: Request) {
  const body = await request.json();
  try {
    const user = await createDBUser(body);
    return NextResponse.json({ data: user, error: null });
  } catch (error: any) {
    return NextResponse.json({ data: null, error: error.message });
  }
}
