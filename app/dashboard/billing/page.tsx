import { getUrl } from "@/app/actions/stripe";
import BillingForm from "@/components/BillingForm";
import { getUserSubscriptionPlan } from "@/lib/stripe";

async function Page() {
  const subscriptionPlan = await getUserSubscriptionPlan();
  const data = await getUrl();
  if (!subscriptionPlan || !data) return <p>Loading...</p>;
  return <BillingForm subscriptionPlan={subscriptionPlan} url={data?.url} />;
}

export default Page;
