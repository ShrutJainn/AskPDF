import { useRouter, useSearchParams } from "next/navigation";
import { trpc } from "../_trpc/client";

function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const origin = searchParams.get("origin");

  const { data } = trpc.authCallback.useQuery(undefined);
  if (data) {
    //user is in the database
    router.push(origin ? `/${origin}` : "/dashboard");
  }
}

export default Page;
