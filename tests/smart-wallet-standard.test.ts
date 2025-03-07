import { projectFactory } from "@clarigen/core";
import { txOk } from "@clarigen/test";
import { tx } from "@hirosystems/clarinet-sdk";
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
  tupleCV,
  uintCV,
} from "@stacks/transactions";
import { describe, expect, it } from "vitest";
import { accounts, project } from "../src/clarigen-types";

const { smartWalletStandard, smartWalletStandardEndpoint, extTest } =
  projectFactory(project, "simnet");

const deployer = accounts.deployer.address;
const address2 = accounts.wallet_2.address;
const address3 = accounts.wallet_3.address;

if (!deployer || !address2 || !address3) {
  throw new Error("One or more required addresses are undefined.");
}

const transferAmount = 100;
const amountCV = uintCV(transferAmount);
const recipientCV = standardPrincipalCV(address2);
const memoCV = noneCV();

const sip009Contract = contractPrincipalCV(
  "SP16GEW6P7GBGZG0PXRXFJEMR3TJHJEY2HJKBP1P5",
  "og-bitcoin-pizza-leather-edition"
);
const extTestCV = contractPrincipalCV(simnet.deployer, "ext-test");

const smartWalletStandardName = "smart-wallet-standard";
const smartWalletStandardEndpointName = "smart-wallet-standard-endpoint";
const xBTC = "Wrapped-Bitcoin";
const wrappedBitcoinContract = contractPrincipalCV(
  "SP3DX3H4FEYZJZ586MFBS25ZW3HZDMEW92260R2PR",
  xBTC
);

describe("test `smart-wallet-standard` public functions", () => {
  it("transfers 100 ustx to wallet", async () => {
    // send 1000 stx from deployer to smart wallet
    const fundResponse = await simnet.transferSTX(
      1000000000,
      `${deployer}.${smartWalletStandardName}`,
      address2
    );
    expect(fundResponse.result).toBeOk(Cl.bool(true));
    simnet.mineEmptyBlock();

    const transferResponse = txOk(
      smartWalletStandard.stxTransfer(transferAmount, address2, null),
      deployer
    );

    console.log(
      "STX Transfer Response:",
      Cl.prettyPrint(transferResponse.result)
    );
    expect(transferResponse.result).toBeOk(Cl.bool(true));
  });

  it("calls extension with payload", async () => {
    const payload = contractPrincipalCV(
      deployer,
      smartWalletStandard.contractName
    );

    const extensionResponse = txOk(
      smartWalletStandard.extensionCall(
        `${deployer}.ext-test`,
        serializeCV(payload)
      ),
      deployer
    );

    await simnet.callPublicFn(
      smartWalletStandardName,
      "extension-call",
      [extTestCV, bufferCV(serializeCV(payload))],
      deployer
    );
    console.log(
      "Extension Call Response:",
      Cl.prettyPrint(extensionResponse.result)
    );
    expect(extensionResponse.result.type).toBe(ClarityType.ResponseOk);
  });

  it("try to transfers 100 sip10 (unsafe) tokens to wallet", async () => {
    // mint 100 xBTC to smart wallet
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
        "SP3DX3H4FEYZJZ586MFBS25ZW3HZDMEW92260R2PR"
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
          contractPrincipalCV(deployer, smartWalletStandardName),
        ],
        deployer
      ),
    ]);
    const sip10transfer = await simnet.callPublicFn(
      smartWalletStandardName,
      "sip010-transfer",
      [amountCV, recipientCV, memoCV, wrappedBitcoinContract],
      deployer
    );
    console.log(
      "SIP-10 Transfer Response:",
      Cl.prettyPrint(sip10transfer.result)
    );
    expect(sip10transfer.result).toBeErr(Cl.uint(4)); // xBTC defines that tx-sender must be token sender

    // use endpoint with extension call to unsafe sip010 transfer
    await simnet.callPublicFn(
      smartWalletStandardName,
      "enable-admin",
      [
        principalCV(`${deployer}.${smartWalletStandardEndpointName}`),
        boolCV(true),
      ],
      deployer
    );

    const sip10transfer2 = await simnet.callPublicFn(
      smartWalletStandardEndpointName,
      "transfer-unsafe-sip-010-token",
      [
        tupleCV({
          amount: amountCV,
          to: recipientCV,
          token: wrappedBitcoinContract,
        }),
      ],
      deployer
    );
    console.log(
      "SIP-10 Transfer Response:",
      Cl.prettyPrint(sip10transfer2.result)
    );
    expect(sip10transfer2.result).toBeOk(Cl.bool(true));
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
        contractPrincipalCV(deployer, smartWalletStandardName),
      ],
      "SP16GEW6P7GBGZG0PXRXFJEMR3TJHJEY2HJKBP1P5"
    );
    expect(initTx.result).toBeOk(trueCV());

    // transfer from smart wallet
    const sip9transfer = await simnet.callPublicFn(
      smartWalletStandardName,
      "sip009-transfer",
      [NftId, recipientCV, sip009Contract],
      deployer
    );
    console.log("NFT Transfer Response:", Cl.prettyPrint(sip9transfer.result));
    expect(sip9transfer.result).toBeErr(uintCV(101)); // nft defines that tx-sender must be owner
  });

  it("enables admin", async () => {
    const adminAddress = standardPrincipalCV(address3);
    const enableAdminResponse = await simnet.callPublicFn(
      smartWalletStandardName,
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
      smartWalletStandardName,
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
