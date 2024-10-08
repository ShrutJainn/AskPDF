import { PLANS } from "@/config/stripe";
import { db } from "@/db";
import Stripe from "stripe";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export const stripe = new Stripe(process.env.STRIPE_API_KEY ?? "", {
  apiVersion: "2024-06-20",
  typescript: true,
});

export async function getUserSubscriptionPlan() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) return null;

  if (!user?.id) {
    return {
      ...PLANS[0],
      isSubscribed: false,
      isCanceled: false,
      stripeCurrentPeriodEnd: null,
    };
  }

  const dbUser = await db.user.findFirst({
    where: {
      id: user?.id,
    },
  });

  if (!dbUser) {
    return {
      ...PLANS[0],
      isSubscribed: false,
      isCanceled: false,
      stripeCurrentPeriodEnd: null,
    };
  }

  const isSubscribed = Boolean(
    dbUser?.stripePriceId &&
      dbUser?.stripeCurrentPeriodEnd && // 86400000 = 1 day
      dbUser?.stripeCurrentPeriodEnd.getTime() + 86_400_000 > Date.now()
  );

  const plan = isSubscribed
    ? PLANS.find((plan) => plan.price.priceId.test === dbUser?.stripePriceId)
    : PLANS[0];

  let isCanceled = false;
  if (isSubscribed && dbUser?.stripeSubscriptionId) {
    const stripePlan = await stripe.subscriptions.retrieve(
      dbUser?.stripeSubscriptionId
    );
    isCanceled = stripePlan.cancel_at_period_end;
  }

  return {
    ...(plan || { name: "Free", id: "default" }),
    stripeSubscriptionId: dbUser?.stripeSubscriptionId,
    stripeCurrentPeriodEnd: dbUser?.stripeCurrentPeriodEnd,
    stripeCustomerId: dbUser?.stripeCustomerId,
    isSubscribed,
    isCanceled,
  };
}
