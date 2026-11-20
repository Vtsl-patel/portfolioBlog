import { Fragment } from "react";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { navItems, resolveSections } from "@/components/sections/registry";
import { getPortfolioData } from "@/lib/data/portfolio";
import { buildHomeJsonLd, serializeJsonLd } from "@/lib/seo/json-ld";

export default async function HomePage() {
  const data = await getPortfolioData();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(buildHomeJsonLd(data)) }}
      />
      <Navbar profile={data.profile} items={navItems} />
      <main id="main" className="flex-1">
        {resolveSections(data).map((section) => (
          <Fragment key={section.id}>{section.node}</Fragment>
        ))}
      </main>
      <Footer profile={data.profile} />
    </>
  );
}
