import { getUrl } from "@/app/actions/stripe";
import BillingForm from "@/components/BillingForm";
import { getUserSubscriptionPlan } from "@/lib/stripe";

async function Page() {
  const subscriptionPlan = await getUserSubscriptionPlan();
  const data = await getUrl();
  console.log(data);
  return <BillingForm subscriptionPlan={subscriptionPlan} url={data.url} />;
}

export default Page;
