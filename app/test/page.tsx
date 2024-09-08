"use client";

import { getSession } from "next-auth/react";

async function page() {
  const session = await getSession();
  console.log(session);
  return <div>hi there</div>;
}

export default page;
