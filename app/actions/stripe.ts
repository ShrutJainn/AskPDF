"use server";

import { PLANS } from "@/config/stripe";
import { db } from "@/db";
import { NEXT_AUTH } from "@/lib/auth";
import { getUserSubscriptionPlan, stripe } from "@/lib/stripe";
import { absoluteUrl } from "@/lib/utils";
import { getServerSession } from "next-auth";

export async function getUrl() {
  const session = await getServerSession(NEXT_AUTH);
  const userId = session?.user?.id;
  if (!userId) throw new Error("Unauthorized");

  const billingUrl = absoluteUrl("/dashboard/billing");

  const dbUser = await db.user.findFirst({
    where: {
      id: userId,
    },
  });

  if (!dbUser) throw new Error("Unauthorized");

  const subscriptionPlan = await getUserSubscriptionPlan();
  if (subscriptionPlan.isSubscribed && dbUser.stripeCustomerId) {
    // try {
    console.log(billingUrl);
    const stripeSession = await stripe.billingPortal.sessions.create({
      customer: dbUser.stripeCustomerId,
      return_url: billingUrl,
    });
    return { url: stripeSession.url };
    // } catch (error) {
    //   console.error(error);
    // }
  }

  const stripeSession = await stripe.checkout.sessions.create({
    success_url: billingUrl,
    cancel_url: billingUrl,
    payment_method_types: ["card", "paypal"],
    mode: "subscription",
    billing_address_collection: "auto",
    line_items: [
      {
        price: PLANS.find((plan) => plan.name === "Pro")?.price.priceId.test,
        quantity: 1,
      },
    ],
    metadata: {
      userId: userId,
    },
  });
  return { url: stripeSession.url };
}
