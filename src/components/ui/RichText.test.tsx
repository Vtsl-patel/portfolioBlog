import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { RichText } from "./RichText";

const html = (text: string) =>
  render(
    <p>
      <RichText text={text} />
    </p>
  ).container.firstElementChild as HTMLElement;

describe("RichText", () => {
  it("renders **bold** and `code` without their markers", () => {
    const p = html("Supports **15 languages** via `useLedger`");
    expect(p.querySelector("strong")).toHaveTextContent("15 languages");
    expect(p.querySelector("code")).toHaveTextContent("useLedger");
    expect(p.textContent).toBe("Supports 15 languages via useLedger");
  });

  it("renders code nested inside bold with no stray backticks (regression)", () => {
    const p = html("Managed state with a **`useReducer` store** and clocks");
    expect(p.querySelector("strong code")).toHaveTextContent("useReducer");
    expect(p.textContent).toBe("Managed state with a useReducer store and clocks");
  });

  it("leaves unmatched markers as literal text", () => {
    expect(html("a ** b ` c").textContent).toBe("a ** b ` c");
  });

  it("never injects HTML from content", () => {
    const p = html('<img src=x onerror="alert(1)"> **<b>x</b>**');
    expect(p.querySelector("img")).toBeNull();
    expect(p.querySelector("b")).toBeNull();
  });
});
