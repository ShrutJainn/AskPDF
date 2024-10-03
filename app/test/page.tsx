import { getUrl } from "../actions/stripe";

async function Page() {
  const data = await getUrl();
  console.log(data);
  return <div>Test</div>;
}

export default Page;
