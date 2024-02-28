"use server";
import { prisma } from "@/lib/prisma/client";
import { cookies } from "next/headers";
import Iron from "@hapi/iron";
import { UnsealObject } from "@/lib/unsealed";
import { User } from "@/lib/user";

export default async function GetUser(): Promise<User> {
  const cookieStore = cookies();

  const IronPass: string = process.env.IRON_SESSION_PW as string;

  const unsealed: UnsealObject = await Iron.unseal(
    cookieStore.get("userSession")?.value as string,
    IronPass,
    Iron.defaults
  ); // unseales cookie to extract data

  const user = await prisma.user.findUnique({
    where: {
      email: unsealed.email,
    },
  }); // searches for users' ID based on email address obtained from unsealed cookie data

  await prisma.$disconnect();

  return user as User;
}