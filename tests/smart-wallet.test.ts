import { initSimnet } from '@hirosystems/clarinet-sdk';
import { Cl } from '@stacks/transactions';
import { describe, expect, it } from 'vitest';

import {
  uintCV,
  standardPrincipalCV,
  bufferCV,
  noneCV,
  someCV,
  ClarityValue
} from '@stacks/transactions';

describe('test `stx-transfer` public function', () => {
  it('it transfers 100 stx to wallet', async () => {
    // Initialize the simnet
    const simnet = await initSimnet();

    // Retrieve the address from the accounts
    const accounts = simnet.getAccounts();
    const address1 = accounts.get("wallet_1");

    // Check if the address is defined
    if (!address1) {
      throw new Error("Address for wallet_1 is undefined.");
    }

    // Define the amount to transfer
    const transferAmount = 100;

    // Create the Clarity values
    const amountCV: ClarityValue = uintCV(transferAmount);
    const recipientCV: ClarityValue = standardPrincipalCV(address1);

    // Create an optional memo (empty memo in this case)
    const memoCV: ClarityValue = noneCV();

    // Call the public function with the required arguments
    const transferResponse = simnet.callPublicFn("smart-wallet", "stx-transfer", [amountCV, recipientCV, memoCV], address1);

    console.log(transferResponse.result);
  });
});
