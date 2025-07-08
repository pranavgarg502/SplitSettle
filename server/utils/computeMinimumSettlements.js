export function computeSettlements(transactions) {
  const netBalance = new Map();

  // Step 1: Compute net balances
  for (const { giverName, recieverName, amount } of transactions) {
    const amt = parseFloat(amount);
    if (isNaN(amt) || amt <= 0) continue;
    if(giverName == recieverName){
      continue;
    }
    netBalance.set(giverName, (netBalance.get(giverName) || 0) - amt);
    netBalance.set(recieverName, (netBalance.get(recieverName) || 0) + amt);
  }

  // Step 2: Create multimap-like array of [balance, name] sorted by balance
  const balances = [];
  for (const [name, amount] of netBalance.entries()) {
    if (Math.abs(amount) > 1e-6) {
      balances.push([amount, name]); // [balance, name]
    }
  }

  balances.sort((a, b) => a[0] - b[0]); // Sort ascending: debtors first

  const settlements = [];

  let i = 0;
  let j = balances.length - 1;

  while (i < j) {
    let [debitAmt, debtor] = balances[i];
    let [creditAmt, creditor] = balances[j];

    if (debtor === creditor) {
      // Should never happen, just in case
      i++;
      continue;
    }

    const settledAmount = Math.min(-debitAmt, creditAmt);
    settledAmount > 0 &&
      settlements.push({
        from: debtor,
        to: creditor,
        amount: parseFloat(settledAmount.toFixed(2)),
      });

    debitAmt += settledAmount;
    creditAmt -= settledAmount;

    // Update pointers and values
    if (Math.abs(debitAmt) < 1e-6) i++;
    else balances[i][0] = debitAmt;

    if (Math.abs(creditAmt) < 1e-6) j--;
    else balances[j][0] = creditAmt;
  }

  return settlements;
}
