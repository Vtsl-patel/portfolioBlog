import { vi } from "vitest";

// IntersectionObserver

type IOCallback = (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => void;

/** Controllable IntersectionObserver double (jsdom has none). */
export class MockIntersectionObserver {
  static instances: MockIntersectionObserver[] = [];
  observed = new Set<Element>();
  disconnected = false;

  constructor(
    private callback: IOCallback,
    public options?: IntersectionObserverInit
  ) {
    MockIntersectionObserver.instances.push(this);
  }

  observe = (el: Element) => {
    this.observed.add(el);
  };
  unobserve = (el: Element) => {
    this.observed.delete(el);
  };
  disconnect = () => {
    this.disconnected = true;
    this.observed.clear();
  };
  takeRecords = () => [] as IntersectionObserverEntry[];

  /** Simulate `target` entering/leaving the observed band. */
  trigger(target: Element, isIntersecting = true) {
    this.callback(
      [{ target, isIntersecting } as unknown as IntersectionObserverEntry],
      this as unknown as IntersectionObserver
    );
  }
}

export function installIntersectionObserver() {
  MockIntersectionObserver.instances = [];
  vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);
  return MockIntersectionObserver;
}

// matchMedia

/** Make `matchMedia(query).matches` true for queries that include any of `matching`. */
export function stubMatchMedia(matching: string[] = []) {
  vi.stubGlobal("matchMedia", (query: string) => ({
    matches: matching.some((m) => query.includes(m)),
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: () => false
  }));
}

export const prefersReducedMotion = () => stubMatchMedia(["prefers-reduced-motion"]);

// Canvas 2D context

export interface FakeCtx {
  [k: string]: unknown;
  clearRect: ReturnType<typeof vi.fn>;
  beginPath: ReturnType<typeof vi.fn>;
  arc: ReturnType<typeof vi.fn>;
  fill: ReturnType<typeof vi.fn>;
  moveTo: ReturnType<typeof vi.fn>;
  lineTo: ReturnType<typeof vi.fn>;
  stroke: ReturnType<typeof vi.fn>;
  setTransform: ReturnType<typeof vi.fn>;
}

/** jsdom does not implement canvas; return a recording 2D context instead. */
export function stubCanvas(): FakeCtx {
  const ctx: FakeCtx = {
    clearRect: vi.fn(),
    beginPath: vi.fn(),
    arc: vi.fn(),
    fill: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    stroke: vi.fn(),
    setTransform: vi.fn(),
    fillStyle: "",
    strokeStyle: "",
    globalAlpha: 1,
    lineWidth: 1
  };
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(
    ctx as unknown as CanvasRenderingContext2D
  );
  return ctx;
}
