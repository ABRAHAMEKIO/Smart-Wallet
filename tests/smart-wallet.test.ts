import { initSimnet } from '@hirosystems/clarinet-sdk';
import { Cl } from '@stacks/transactions';
import { describe, expect, it } from 'vitest';

import {
  uintCV,
  standardPrincipalCV,
  noneCV,
  contractPrincipalCV
} from '@stacks/transactions';

const accounts = simnet.getAccounts();
const address1 = accounts.get("wallet_1");

if (!address1) {
  throw new Error("Address for wallet_1 is undefined.");
}


const transferAmount = 10;
const amountCV = uintCV(transferAmount);
const recipientCV = standardPrincipalCV(address1);
const memoCV = noneCV();

describe('test `stx-transfer` public function', () => {
  it('it transfers 100 stx to wallet', () => {
    const transferResponse = simnet.callPublicFn("smart-wallet", "stx-transfer", [amountCV, recipientCV, memoCV], address1);
    console.log(Cl.prettyPrint(transferResponse.result));
  });

 it('it transfers 100 sip10 tokens to wallet', () => {
   const sip010Contract = contractPrincipalCV('SP32AEEF6WW5Y0NMJ1S8SBSZDAY8R5J32NBZFPKKZ', 'nope');
   const sip10transfer = simnet.callPublicFn("smart-wallet", "sip010-transfer", [amountCV, recipientCV,memoCV,sip010Contract], address1);                           
   console.log(Cl.prettyPrint(sip10transfer.result)); // (ok u2)
    // expect(sip10transfer.result).toBeOk(Cl.uint(2));
 });

 it('it transfers 1 Nft to wallet', () => {
  const NftId = uintCV(1);
  const sip009Contract = contractPrincipalCV('SP16GEW6P7GBGZG0PXRXFJEMR3TJHJEY2HJKBP1P5', 'og-bitcoin-pizza-leather-edition');
  const sip9transfer = simnet.callPublicFn("smart-wallet", "sip009-transfer",[NftId, recipientCV,sip009Contract], address1);
  console.log(Cl.prettyPrint(sip9transfer.result)); 
   // expect(sip9transfer.result).toBeOk(Cl.uint(1));
});

});


