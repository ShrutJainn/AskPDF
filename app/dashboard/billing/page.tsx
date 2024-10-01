import { getUrl } from "@/app/actions/stripe";
import BillingForm from "@/components/BillingForm";
import { getUserSubscriptionPlan } from "@/lib/stripe";
import axios from "axios";
import { useState } from "react";

async function Page() {
  const subscriptionPlan = await getUserSubscriptionPlan();
  // const { data } = await axios.post("http://localhost:3000/api/stripe");
  const data = await getUrl();
  return <BillingForm subscriptionPlan={subscriptionPlan} url={data.url!} />;
}

export default Page;
