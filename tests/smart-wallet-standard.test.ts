import { initSimnet } from "@hirosystems/clarinet-sdk";
import {
  ClarityType,
  Cl,
  uintCV,
  ResponseOkCV,
  ResponseErrorCV,
  standardPrincipalCV,
  noneCV,
  contractPrincipalCV,
  bufferCV,
  boolCV,
} from "@stacks/transactions";
import { describe, expect, it } from "vitest";

const simnet = await initSimnet();

const accounts = simnet.getAccounts();
const address1 = accounts.get("deployer");
const address2 = accounts.get("wallet_2");
const address3 = accounts.get("wallet_1");

if (!address1 || !address2 || !address3) {
  throw new Error("One or more required addresses are undefined.");
}

const transferAmount = 100;
const amountCV = uintCV(transferAmount);
const recipientCV = standardPrincipalCV(address2);
const memoCV = noneCV();
const sip010Contract = contractPrincipalCV(
  "SP32AEEF6WW5Y0NMJ1S8SBSZDAY8R5J32NBZFPKKZ",
  "nope"
);
const sip009Contract = contractPrincipalCV(
  "SP16GEW6P7GBGZG0PXRXFJEMR3TJHJEY2HJKBP1P5",
  "og-bitcoin-pizza-leather-edition"
);
const extensionContract = contractPrincipalCV(
  simnet.deployer,
  "ext-delegate-stx-pox-4"
);

describe("test `smart-wallet-standard` public functions", () => {
  it("transfers 100 stx to wallet", async () => {
    const transferResponse = await simnet.callPublicFn(
      "smart-wallet",
      "stx-transfer",
      [amountCV, recipientCV, memoCV],
      address1
    );
    console.log(
      "STX Transfer Response:",
      Cl.prettyPrint(transferResponse.result)
    );
    expect(transferResponse.result).toBeOk(Cl.bool(true));
  });

  it("calls extension with payload", async () => {
    const payload = bufferCV(Buffer.from("extension-payload"));
    const extensionResponse = await simnet.callPublicFn(
      "smart-wallet",
      "extension-call",
      [extensionContract, payload],
      address1
    );
    console.log(
      "Extension Call Response:",
      Cl.prettyPrint(extensionResponse.result)
    );
    expect(extensionResponse.result.type).toBe(ClarityType.ResponseOk);
  });

  it("transfers 100 sip10 tokens to wallet", async () => {
    const sip10transfer = await simnet.callPublicFn(
      "smart-wallet",
      "sip010-transfer",
      [amountCV, recipientCV, memoCV, sip010Contract],
      address1
    );
    console.log(
      "SIP-10 Transfer Response:",
      Cl.prettyPrint(sip10transfer.result)
    );
    expect(sip10transfer.result).toBeOk(Cl.bool(true));
  });

  it("transfers 1 Nft to wallet", async () => {
    const NftId = uintCV(1);
    const sip9transfer = await simnet.callPublicFn(
      "smart-wallet",
      "sip009-transfer",
      [NftId, recipientCV, sip009Contract],
      address1
    );
    console.log("NFT Transfer Response:", Cl.prettyPrint(sip9transfer.result));
    expect(sip9transfer.result).toBeOk(Cl.bool(true));
  });

  // it('enables admin', async () => {
  //   const adminAddress = standardPrincipalCV(address3);
  //   const enableAdminResponse = await simnet.callPublicFn("smart-wallet", "enable-admin", [adminAddress, boolCV(true)], address1);
  //   console.log('Enable Admin Response:', Cl.prettyPrint(enableAdminResponse.result));
  //   expect(enableAdminResponse.result.type).toBe(ClarityType.ResponseOk);
  // });

  // it('transfers wallet to new admin', async () => {
  //   const newAdminAddress = standardPrincipalCV(address3);
  //   const transferWalletResponse = await simnet.callPublicFn("smart-wallet", "transfer-wallet", [newAdminAddress], address1);
  //   console.log('Transfer Wallet Response:', Cl.prettyPrint(transferWalletResponse.result));
  //   expect(transferWalletResponse.result.type).toBe(ClarityType.ResponseOk);
  // });
});
