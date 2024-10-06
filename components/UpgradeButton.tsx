"use client";

import { ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
import axios from "axios";
import { getUrl } from "@/app/actions/stripe";

function UpgradeButton() {
  async function handleClick() {
    //@ts-ignore
    // const { data } = await axios.post("/api/stripe");
    const data = await getUrl();
    window.location.href = data?.url ?? "/dashboard/billing";
  }
  return (
    <Button className=" w-full" onClick={handleClick}>
      Upgrade now <ArrowRight className=" h-5 w-5 ml-1.5" />
    </Button>
  );
}

export default UpgradeButton;
