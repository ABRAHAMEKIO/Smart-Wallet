import { initSimnet } from '@hirosystems/clarinet-sdk';
import { ClarityType, Cl, uintCV, ResponseOkCV, ResponseErrorCV } from '@stacks/transactions';
import { describe, expect, it } from 'vitest';
import {
  standardPrincipalCV,
  noneCV,
  contractPrincipalCV,
} from '@stacks/transactions';

const simnet = await initSimnet();

const accounts = simnet.getAccounts();
const address1 = accounts.get("deployer");
const address3 = accounts.get("wallet_1");
const address2 = accounts.get("wallet_2");

if (!address1) throw new Error("Address for deployer is undefined.");
if (!address2) throw new Error("Address for wallet_2 is undefined.");
if (!address3) throw new Error("Address for wallet_3 is undefined.");

const transferAmount = 100;
const amountCV = uintCV(transferAmount);
const recipientCV = standardPrincipalCV(address2);
const memoCV = noneCV();

describe('test `stx-transfer` public function', () => {
  it('transfers 100 stx to wallet', async () => {
    const transferResponse = await simnet.callPublicFn("smart-wallet", "stx-transfer", [amountCV, recipientCV, memoCV], address1);
    console.log('STX Transfer Response:', Cl.prettyPrint(transferResponse.result));
    expect(transferResponse.result.type).toBe(ClarityType.ResponseOk);
  });

  it('transfers 100 sip10 tokens to wallet', async () => {
    const sip010Contract = contractPrincipalCV('SP32AEEF6WW5Y0NMJ1S8SBSZDAY8R5J32NBZFPKKZ', 'nope');
    const sip10transfer = await simnet.callPublicFn("smart-wallet", "sip010-transfer", [amountCV, recipientCV, memoCV, sip010Contract], address1);
    console.log('SIP-10 Transfer Response:', Cl.prettyPrint(sip10transfer.result));
    expect(sip10transfer.result.type).toBe(ClarityType.ResponseOk);
  });

  it('transfers 1 Nft to wallet', async () => {
    const NftId = uintCV(100);
    const sip009Contract = contractPrincipalCV('SP16GEW6P7GBGZG0PXRXFJEMR3TJHJEY2HJKBP1P5', 'og-bitcoin-pizza-leather-edition');
    const smartwalletcontract = contractPrincipalCV('ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM', 'smart-wallet');
    const sip9transfer = await simnet.callPublicFn("smart-wallet", "sip009-transfer", [NftId, smartwalletcontract, sip009Contract], address1);
    console.log('NFT Transfer Response:', Cl.prettyPrint(sip9transfer.result));
    expect(sip9transfer.result.type).toBe(ClarityType.ResponseOk);
  });

});
