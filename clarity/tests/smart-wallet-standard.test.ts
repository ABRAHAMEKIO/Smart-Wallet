import { initSimnet, tx } from "@hirosystems/clarinet-sdk";
import {
  boolCV,
  bufferCV,
  Cl,
  ClarityType,
  contractPrincipalCV,
  cvToString,
  noneCV,
  principalCV,
  serializeCV,
  standardPrincipalCV,
  stringAsciiCV,
  trueCV,
  uintCV,
} from "@stacks/transactions";
import { describe, expect, it } from "vitest";
import { deployments } from "../../clarigen/src/clarigen-types";

const simnet = await initSimnet();

const accounts = simnet.getAccounts();
const deployer = accounts.get("deployer")!;
const address1 = accounts.get("wallet_1")!;
const address2 = accounts.get("wallet_2")!;
const address3 = accounts.get("wallet_3")!;

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
const xBTC = "Wrapped-Bitcoin";
const wrappedBitcoinContract = contractPrincipalCV(
  "SP3DX3H4FEYZJZ586MFBS25ZW3HZDMEW92260R2PR",
  xBTC
);

describe("Standard Smart Wallet", () => {
  it("transfers 100 stx to wallet", async () => {
    const stxTransfer = tx.transferSTX(
      10000000000,
      deployments.smartWalletStandard.simnet,
      address1
    );
    simnet.mineBlock([stxTransfer]);

    const transferResponse = await simnet.callPublicFn(
      smartWalletStandard,
      "stx-transfer",
      [amountCV, recipientCV, memoCV],
      deployer
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
    expect(extensionResponse.result.type).toBe(ClarityType.ResponseOk);
  });

  it("transfers 100 sip10 tokens to wallet", async () => {
    const blocks = await simnet.mineBlock([
      tx.callPublicFn(
        cvToString(wrappedBitcoinContract),
        "initialize",
        [
          stringAsciiCV("Wrapped Bitcoin"),
          stringAsciiCV("xBTC"),
          uintCV(8),
          principalCV(deployer),
        ],
        deployer
      ),
      tx.callPublicFn(
        cvToString(wrappedBitcoinContract),
        "add-principal-to-role",
        [
          uintCV(1), // minter
          principalCV(deployer),
        ],
        deployer
      ),
      tx.callPublicFn(
        cvToString(wrappedBitcoinContract),
        "mint-tokens",
        [
          uintCV(100000000000000),
          contractPrincipalCV(deployer, smartWalletStandard),
        ],
        deployer
      ),
    ]);
    const sip10transfer = await simnet.callPublicFn(
      smartWalletStandard,
      "sip010-transfer",
      [amountCV, recipientCV, memoCV, wrappedBitcoinContract],
      deployer
    );
    expect(sip10transfer.result).toBeErr(Cl.uint(4)); // xBTC defines that tx-sender must be token sender
  });

  it("transfers 1 Nft to wallet", async () => {
    const NftId = uintCV(99);
    // transfer NFT to smart wallet
    const initTx = await simnet.callPublicFn(
      cvToString(sip009Contract),
      "transfer",
      [
        NftId,
        principalCV("SP16GEW6P7GBGZG0PXRXFJEMR3TJHJEY2HJKBP1P5"),
        contractPrincipalCV(deployer, smartWalletStandard),
      ],
      "SP16GEW6P7GBGZG0PXRXFJEMR3TJHJEY2HJKBP1P5"
    );
    expect(initTx.result).toBeOk(trueCV());

    // transfer from smart wallet
    const sip9transfer = await simnet.callPublicFn(
      smartWalletStandard,
      "sip009-transfer",
      [NftId, recipientCV, sip009Contract],
      deployer
    );
    expect(sip9transfer.result).toBeErr(uintCV(101)); // nft defines that tx-sender must be owner
  });

  it("enables admin", async () => {
    const adminAddress = standardPrincipalCV(address3);
    const enableAdminResponse = await simnet.callPublicFn(
      smartWalletStandard,
      "enable-admin",
      [adminAddress, boolCV(true)],
      deployer
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
    expect(transferWalletResponse.result.type).toBe(ClarityType.ResponseOk);
  });
});

it("fails to enable-admin not normal user", async () => {
  const adminAddress = standardPrincipalCV(address1);
  const enableAdmin = simnet.callPublicFn(
    "smart-wallet-standard",
    "enable-admin",
    [adminAddress, boolCV(true)],
    address1 // not current admin
  );

  expect(enableAdmin.result).toHaveClarityType(ClarityType.ResponseErr);
});

it("checks that extension-call is working", async () => {
  const smartWalletStandard = "smart-wallet-standard";
  const extensionTrait = contractPrincipalCV(simnet.deployer, "ext-test");
  const payload = contractPrincipalCV(simnet.deployer, smartWalletStandard);
  const extensionCall = simnet.callPublicFn(
    smartWalletStandard,
    "extension-call",
    [extensionTrait, bufferCV(serializeCV(payload))],
    simnet.deployer
  );

  console.log(extensionCall);
  expect(extensionCall.result.type).toBe(ClarityType.ResponseOk);
});

it("test the transfer-wallet public function", async () => {
  const newAdminAddress = standardPrincipalCV(address3);
  const transferWallet = simnet.callPublicFn(
    smartWalletStandard,
    "transfer-wallet",
    [newAdminAddress],
    deployer
  );

  console.log(transferWallet);
  expect(transferWallet.result).toHaveClarityType(ClarityType.ResponseOk);
});
