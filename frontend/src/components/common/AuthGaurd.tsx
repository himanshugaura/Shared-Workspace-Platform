"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { getProfile } from "@/api/auth";

type Props = {
  children: React.ReactNode;
  requireAuth?: boolean;
};

export default function AuthGuard({ children, requireAuth = true }: Props) {
  const router = useRouter();
    const { user } = useAppSelector((state) => state.auth);
    const dispatch = useAppDispatch();
  useEffect(() => {
   const fetchUser = async () => {
    const res = await dispatch(getProfile());

    if (!res) {
      if (requireAuth) {
        router.push("/login");
      }
    } else {
        router.push("/profile");
    }
   }

   fetchUser();
  }, [dispatch, router, requireAuth]);
  return <>{children}</>;
}