import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { CopyEmailButton } from "./CopyEmailButton";

const EMAIL = "someone@example.com";

function stubClipboard(impl: () => Promise<void> = () => Promise.resolve()) {
  const writeText = vi.fn(impl);
  Object.defineProperty(navigator, "clipboard", { value: { writeText }, configurable: true });
  return writeText;
}

async function click() {
  await act(async () => {
    fireEvent.click(screen.getByRole("button"));
  });
}

afterEach(() => {
  vi.useRealTimers();
});

describe("CopyEmailButton", () => {
  it("copies the address and confirms to sighted and screen-reader users", async () => {
    const writeText = stubClipboard();
    render(<CopyEmailButton email={EMAIL} />);
    await click();
    expect(writeText).toHaveBeenCalledWith(EMAIL);
    expect(screen.getByText("Copied!")).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent("Email address copied to clipboard");
  });

  it("shows no false success when the clipboard is unavailable", async () => {
    stubClipboard(() => Promise.reject(new Error("denied")));
    render(<CopyEmailButton email={EMAIL} />);
    await click();
    expect(screen.queryByText("Copied!")).not.toBeInTheDocument();
  });

  it("reverts to the idle label after 2.5 seconds", async () => {
    vi.useFakeTimers();
    stubClipboard();
    render(<CopyEmailButton email={EMAIL} />);
    await click();
    act(() => {
      vi.advanceTimersByTime(2600);
    });
    expect(screen.getByText("Copy email")).toBeInTheDocument();
    expect(screen.getByRole("status")).toBeEmptyDOMElement();
  });
});
