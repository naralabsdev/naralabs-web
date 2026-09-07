import { LandingPage } from "@/modules/landing";
import { getHomePageData } from "@/modules/landing/services/fetch-home";

export default async function Home() {
  const data = await getHomePageData();
  return <LandingPage data={data} />;
}
