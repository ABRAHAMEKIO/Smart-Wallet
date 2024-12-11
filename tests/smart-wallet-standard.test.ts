import { initSimnet } from "@hirosystems/clarinet-sdk";
import {
  boolCV,
  bufferCV,
  Cl,
  ClarityType,
  contractPrincipalCV,
  noneCV,
  serializeCV,
  standardPrincipalCV,
  uintCV,
} from "@stacks/transactions";
import { describe, expect, it } from "vitest";

const simnet = await initSimnet();

const accounts = simnet.getAccounts();
const deployer = accounts.get("deployer");
const address2 = accounts.get("wallet_2");
const address3 = accounts.get("wallet_3");

if (!deployer || !address2 || !address3) {
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
const extTest = contractPrincipalCV(simnet.deployer, "ext-test");

const smartWalletStandard = "smart-wallet-standard";

describe("test `smart-wallet-standard` public functions", () => {
  it("transfers 100 stx to wallet", async () => {
    const transferResponse = await simnet.callPublicFn(
      smartWalletStandard,
      "stx-transfer",
      [amountCV, recipientCV, memoCV],
      deployer
    );
    console.log(
      "STX Transfer Response:",
      Cl.prettyPrint(transferResponse.result)
    );
    expect(transferResponse.result).toBeOk(Cl.bool(true));
  });

  it("calls extension with payload", async () => {
    const payload = contractPrincipalCV(deployer, smartWalletStandard);
    const extensionResponse = await simnet.callPublicFn(
      smartWalletStandard,
      "extension-call",
      [extTest, bufferCV(serializeCV(payload))],
      deployer
    );
    console.log(
      "Extension Call Response:",
      Cl.prettyPrint(extensionResponse.result)
    );
    expect(extensionResponse.result.type).toBe(ClarityType.ResponseOk);
  });

  it("transfers 100 sip10 tokens to wallet", async () => {
    const sip10transfer = await simnet.callPublicFn(
      smartWalletStandard,
      "sip010-transfer",
      [amountCV, recipientCV, memoCV, sip010Contract],
      deployer
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
      smartWalletStandard,
      "sip009-transfer",
      [NftId, recipientCV, sip009Contract],
      deployer
    );
    console.log("NFT Transfer Response:", Cl.prettyPrint(sip9transfer.result));
    expect(sip9transfer.result).toBeOk(Cl.bool(true));
  });

  it("enables admin", async () => {
    const adminAddress = standardPrincipalCV(address3);
    const enableAdminResponse = await simnet.callPublicFn(
      smartWalletStandard,
      "enable-admin",
      [adminAddress, boolCV(true)],
      deployer
    );
    console.log(
      "Enable Admin Response:",
      Cl.prettyPrint(enableAdminResponse.result)
    );
    expect(enableAdminResponse.result.type).toBe(ClarityType.ResponseOk);
  });

  it("transfers wallet to new admin", async () => {
    const newAdminAddress = standardPrincipalCV(address3);
    const transferWalletResponse = await simnet.callPublicFn(
      smartWalletStandard,
      "transfer-wallet",
      [newAdminAddress],
      deployer
    );
    console.log(
      "Transfer Wallet Response:",
      Cl.prettyPrint(transferWalletResponse.result)
    );
    expect(transferWalletResponse.result.type).toBe(ClarityType.ResponseOk);
  });
});
