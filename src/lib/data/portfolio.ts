import { cache } from "react";
import { portfolioData } from "@/content/portfolio";
import type { PortfolioData } from "@/types/portfolio";

/**
 * Data access layer: the only module that knows where content comes from.
 * Swap `loadPortfolio` for a fetch when the API lands. `cache` dedupes calls per render.
 */
const loadPortfolio = async (): Promise<PortfolioData> => portfolioData;

export const getPortfolioData = cache(loadPortfolio);
