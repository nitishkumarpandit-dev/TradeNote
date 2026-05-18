export interface TradeCalculationParams {
  entryPrice: number;
  exitPrice: number;
  quantity: number;
  leverage: number;
  direction: "LONG" | "SHORT";
  charges: number;
}

export interface TradeCalculationResult {
  grossPnl: number;
  netPnl: number;
  margin: number;
  pnlPercent: number;
  isOpenTrade: boolean;
}

/**
 * Calculates trade metrics based on standard formulas.
 * Handles edge cases like zero division, missing exit prices (open trades), and rounding.
 */
export function calculateTradeMetrics(params: TradeCalculationParams): TradeCalculationResult {
  const { entryPrice, exitPrice, quantity, direction, charges } = params;
  
  // Prevent zero/negative leverage from breaking math
  const leverage = Math.max(1, params.leverage || 1);

  // 1. Edge Case: Invalid inputs (prevent divide by zero or NaN)
  if (!entryPrice || entryPrice <= 0 || !quantity || quantity <= 0) {
    return {
      grossPnl: 0,
      netPnl: 0 - (charges || 0), // charges might still apply even if invalid entry
      margin: 0,
      pnlPercent: 0,
      isOpenTrade: false,
    };
  }

  // 2. Identify Open Trades (missing or zero exit price)
  const isOpenTrade = !exitPrice || exitPrice <= 0;

  // Step 5: Calculate margin used
  const positionSize = entryPrice * quantity;
  const margin = positionSize / leverage;

  if (isOpenTrade) {
    // Open trade has no realized PnL yet, but margin is used and charges may apply
    const netPnl = 0 - charges;
    const pnlPercent = margin > 0 ? (netPnl / margin) * 100 : 0;
    
    return {
      grossPnl: 0,
      netPnl: Number(netPnl.toFixed(2)),
      margin: Number(margin.toFixed(2)),
      pnlPercent: Number(pnlPercent.toFixed(2)),
      isOpenTrade: true,
    };
  }

  // Step 1: Calculate price difference
  let priceDiff = 0;
  if (direction === "LONG") {
    priceDiff = exitPrice - entryPrice;
  } else {
    // SHORT direction
    priceDiff = entryPrice - exitPrice;
  }

  // Step 2: Calculate position PnL (without leverage)
  const pnl = priceDiff * quantity;

  // Step 3: Apply leverage
  const grossPnl = pnl * leverage;

  // Step 4: Subtract charges
  const netPnl = grossPnl - charges;

  // Step 6: Calculate ROI %
  const pnlPercent = margin > 0 ? (netPnl / margin) * 100 : 0;

  return {
    grossPnl: Number(grossPnl.toFixed(2)),
    netPnl: Number(netPnl.toFixed(2)),
    margin: Number(margin.toFixed(2)),
    pnlPercent: Number(pnlPercent.toFixed(2)),
    isOpenTrade: false,
  };
}
