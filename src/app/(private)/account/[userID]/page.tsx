"use client";

import React, { useState, useEffect, useContext } from "react";
import Image from "next/image";
import FindUser from "@/components/Account/findUser";
import Iron from "@hapi/iron";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { AuthContext } from "@/context/AuthContextProvider/AuthContext";
import { SessionContext } from "@/context/SessionContextProvider/SessionContext";
import { User } from "@/lib/login/user";
import { UnsealObject } from "@/components/Account/unsealed";
import SessionData from "@/components/Server/sessionData";

export default function Account() {
  const [isAuth, setIsAuth] = useContext(AuthContext);
  const [session, setSession] = useContext(SessionContext);

  const [userData, setUserData] = useState<User>({
    id: "",
    username: "",
    email: "",
    emailVerified: false,
    password: "",
    race: "bat",
    money: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  const [unseal, setUnseal] = useState<{
    userID: string;
    email: string;
    userIP: string;
    randomNano: string;
  }>({
    userID: "",
    email: "",
    userIP: "",
    randomNano: "",
  });

  useEffect(() => {
    async function fetchData() {
      const unsealed = await SessionData(session);

      setUnseal((prevSeal) => ({
        ...prevSeal,
        userID: unsealed.userID,
        email: unsealed.email,
        userIP: unsealed.userIP,
        randomNano: unsealed.randomNano,
      }));
    }
    fetchData();
  }, []);

  // TODO replace this with React Query to avoid staleness
  // TODO enable caching
  useEffect(() => {
    async function fetchUser() {
      const user = await FindUser(unseal?.userID as string);
      setUserData(user as User);
      setUnseal({
        userID: "",
        email: "",
        userIP: "",
        randomNano: "",
      });
    }
    fetchUser();
  }, [unseal]);

  console.log("Session: ", session);
  console.log("Unseal: ", unseal);

  return (
    <>
      {isAuth && userData && (
        <>
          <div>Felhasználó ID: {userData.id}</div>
          <div>{userData.email}</div>
          <div>
            <Image
              src={`/race/${userData.race}.png`}
              alt={`${userData.race}-icon`}
              width={72}
              height={72}
              priority
            />
          </div>
          <div>Felhasználónév: {userData.username}</div>
          <div>
            Email ellenőrizve: {userData.emailVerified ? "Igen" : "Nem"}
          </div>
          <div>
            Regisztráció dátuma:{" "}
            {userData.createdAt.toLocaleDateString("hu-HU", {
              weekday: "long",
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </div>
        </>
      )}
      <ReactQueryDevtools initialIsOpen={false} />
    </>
  );
}
