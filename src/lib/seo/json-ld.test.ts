import { describe, expect, it } from "vitest";
import { portfolioData } from "@/content/portfolio";
import { buildHomeJsonLd, serializeJsonLd } from "./json-ld";

type Node = Record<string, unknown>;
const graph = () => buildHomeJsonLd(portfolioData)["@graph"] as Node[];
const person = () => graph().find((n) => n["@type"] === "Person") as Node;
const website = () => graph().find((n) => n["@type"] === "WebSite") as Node;

describe("buildHomeJsonLd", () => {
  it("is a schema.org graph of a Person (from the content) and a linked WebSite", () => {
    expect(buildHomeJsonLd(portfolioData)["@context"]).toBe("https://schema.org");
    expect(person().name).toBe(portfolioData.profile.name);
    expect(person().sameAs).toEqual(portfolioData.profile.socials.map((s) => s.url));
    expect(website().publisher).toEqual({ "@id": person()["@id"] });
  });

  it("never exposes contact details to scrapers", () => {
    const json = JSON.stringify(buildHomeJsonLd(portfolioData));
    expect(json).not.toContain(portfolioData.profile.email);
    expect(json).not.toMatch(/telephone|mailto:|tel:/i);
  });
});

describe("serializeJsonLd", () => {
  it("escapes '<' so content can never close the <script> tag, and still round-trips", () => {
    const original = { name: "</script><script>alert(1)</script>" };
    const out = serializeJsonLd(original);
    expect(out).not.toContain("<");
    expect(JSON.parse(out)).toEqual(original);
  });
});
