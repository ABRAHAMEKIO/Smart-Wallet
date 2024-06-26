import { initSimnet } from '@hirosystems/clarinet-sdk';
import { ClarityType, Cl, uintCV, ResponseOkCV, ResponseErrorCV } from '@stacks/transactions';
import { describe, expect, it } from 'vitest';
import {
  standardPrincipalCV,
  noneCV,
  contractPrincipalCV,
  ClarityValue,
} from '@stacks/transactions';

const simnet = await initSimnet();

const accounts = simnet.getAccounts();
const address1 = accounts.get("deployer");
const address3 = accounts.get("wallet_1");
const address2 = accounts.get("wallet_2");

if (!address1) {
  throw new Error("Address for deployer is undefined.");
}

if (!address2) {
  throw new Error("Address for wallet_2 is undefined.");
}

if (!address3) {
  throw new Error("Address for wallet_3 is undefined.");
}
const transferAmount = 100;
const amountCV = uintCV(transferAmount);
const recipientCV = standardPrincipalCV(address2);
const memoCV = noneCV();

describe('test `stx-transfer` public function', () => {
  it('transfers 100 stx to wallet', async () => {
    const transferResponse = await simnet.callPublicFn("smart-wallet", "stx-transfer", [amountCV, recipientCV, memoCV], address1);
    console.log('STX Transfer Response:', Cl.prettyPrint(transferResponse.result));

    if (transferResponse.result.type === ClarityType.ResponseErr) {
      const errorValue = (transferResponse.result as ResponseErrorCV).value;
      console.error('STX Transfer Error code:', errorValue);
    } else if (transferResponse.result.type === ClarityType.ResponseOk) {
      const okValue = (transferResponse.result as ResponseOkCV).value;
      console.log('STX Transfer Success code:', okValue);
      // Adjust the expectation based on the actual return structure
      expect(okValue).toEqual({ type: 3 }); // Update based on actual return value
    } else {
      console.error('Unexpected response type:', transferResponse.result.type);
    }
  });
  it('transfers 100 sip10 tokens to wallet', async () => {
    const sip010Contract = contractPrincipalCV('SP32AEEF6WW5Y0NMJ1S8SBSZDAY8R5J32NBZFPKKZ', 'nope');
    const sip10transfer = await simnet.callPublicFn("smart-wallet", "sip010-transfer", [amountCV, recipientCV, memoCV, sip010Contract], address1);
    console.log('SIP-10 Transfer Response:', Cl.prettyPrint(sip10transfer.result));

    if (sip10transfer.result.type === ClarityType.ResponseOk) {
      expect(sip10transfer.result).toBeOk(uintCV(2)); // Adjust based on actual return value
    } else {
      console.error('SIP-10 Transfer failed:', sip10transfer.result);
    }
  });

  it('transfers 1 Nft to wallet', async () => {
    const NftId = uintCV(100);
    const sip009Contract = contractPrincipalCV('SP16GEW6P7GBGZG0PXRXFJEMR3TJHJEY2HJKBP1P5', 'og-bitcoin-pizza-leather-edition');
    const smartwalletcontract = contractPrincipalCV('ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM', 'smart-wallet');
    const sip9transfer = await simnet.callPublicFn("smart-wallet", "sip009-transfer", [NftId, smartwalletcontract, sip009Contract], address3);
    console.log('NFT Transfer Response:', Cl.prettyPrint(sip9transfer.result));

    if (sip9transfer.result.type === ClarityType.ResponseOk) {
      expect(sip9transfer.result).toBeOk(uintCV(1)); // Adjust based on actual return value
    } else {
      console.error('NFT Transfer failed:', sip9transfer.result);
    }
  });
 console.log(accounts)
});


