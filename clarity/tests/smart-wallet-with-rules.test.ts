import { projectFactory } from "@clarigen/core";
import { rovOk, txErr, txOk } from "@clarigen/test";
import {
  boolCV,
  Cl,
  ClarityType,
  standardPrincipalCV,
  trueCV,
} from "@stacks/transactions";
import { describe, expect, it } from "vitest";
import {
  accounts,
  deployments,
  project,
} from "../../clarigen/src/clarigen-types";

const { smartWalletWithRules, smartWalletEndpoint } = projectFactory(
  project,
  "simnet"
);

const transferAmount = 100;

const ezra = accounts.wallet_1.address;

// Type guard to check if data has an amount property
function hasAmountProperty(data: any): data is { amount: string } {
  return (data as { amount: string }).amount !== undefined;
}

describe("Smart Wallet with rules", () => {
  it("transfers 100 stx to wallet", async () => {
    const response = txOk(
      smartWalletWithRules.stxTransfer(
        transferAmount,
        accounts.wallet_2.address,
        null
      ),
      accounts.wallet_1.address
    );
    expect(response.result).toBeOk(trueCV());
  });

  it("transfers 100 sip10 tokens to wallet", async () => {
    const sip010Contract = "SP32AEEF6WW5Y0NMJ1S8SBSZDAY8R5J32NBZFPKKZ.nope";

    const response = txErr(
      smartWalletWithRules.sip010Transfer(
        transferAmount,
        accounts.wallet_2.address,
        null,
        sip010Contract
      ),
      accounts.wallet_1.address
    );

    expect(response.result).toBeErr(Cl.uint(401));
  });

  it("transfers 1 Nft to wallet", async () => {
    const sip09Contract =
      "SP16GEW6P7GBGZG0PXRXFJEMR3TJHJEY2HJKBP1P5.og-bitcoin-pizza-leather-edition";
    const response = txErr(
      smartWalletWithRules.sip009Transfer(
        1,
        "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.smart-wallet-with-rules",
        sip09Contract
      ),
      accounts.wallet_1.address
    );

    expect(response.result).toBeErr(Cl.uint(101));
  });

  it("transfers fee to sponsor", async () => {
    const fees = 10000;
    const response = txOk(
      smartWalletEndpoint.stxTransferSponsored(
        deployments.smartWalletWithRules.simnet,
        {
          amount: transferAmount,
          to: accounts.wallet_2.address,
          fees,
        }
      ),
      accounts.wallet_1.address
    );

    expect(response.result).toBeOk(trueCV());
    // only 1 stx transfer event because there is no sponsored tx here
    expect(response.events.length).toBe(1);
    const event = response.events[0].data;
    if (hasAmountProperty(event)) {
      expect(event.amount).toBe(transferAmount.toString());
    } else {
      throw new Error("Event data does not have amount property");
    }
  });
});

it("test the enable-admin public function", async () => {
  const adminAddress = standardPrincipalCV(accounts.wallet_1.address);
  const enableAdmin = simnet.callPublicFn(
    "smart-wallet-with-rules",
    "enable-admin",
    [adminAddress, boolCV(true)],
    ezra
  );

  expect(enableAdmin.result).toHaveClarityType(ClarityType.ResponseErr);
});

it("checks that set-security-level is working", async () => {
  const setSecurityLevel = txOk(
    smartWalletWithRules.setSecurityLevel(1),
    accounts.deployer.address
  );

  expect(setSecurityLevel.result.type).toBe(ClarityType.ResponseOk);
});

it("checks that is-admin-calling is working", async () => {
  const isAdminCalling = rovOk(smartWalletWithRules.isAdminCalling());
  accounts.wallet_1.address;

  expect(isAdminCalling).toBeOk;
});
