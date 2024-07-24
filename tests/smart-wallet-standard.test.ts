import { CoreNodeEventType, projectFactory } from "@clarigen/core";
import { filterEvents, txErr, txOk } from "@clarigen/test";
import { Cl, ClarityType } from "@stacks/transactions";
import { describe, expect, it } from "vitest";
import { accounts, project } from "../src/clarigen-types";

const { smartWallet, smartWalletEndpoint } = projectFactory(project, "simnet");

const transferAmount = 100;

// Type guard to check if data has an amount property
function hasAmountProperty(data: any): data is { amount: string } {
  return (data as { amount: string }).amount !== undefined;
}

describe("test `smart-wallet-standard` public functions", () => {

  it("transfers 100 stx to wallet", async () => {
    const response = await txOk(
      smartWallet.stxTransfer(transferAmount, accounts.wallet_2.address, null),
      accounts.wallet_1.address
    );
    console.log(response);
    expect(response.result.type).toBe(ClarityType.ResponseOk);
  });

  it("transfers 100 sip10 tokens to wallet", async () => {
    const sip010Contract = "SP32AEEF6WW5Y0NMJ1S8SBSZDAY8R5J32NBZFPKKZ.nope";

    const response = await txErr(
      smartWallet.sip010Transfer(
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
    const response = await txErr(
      smartWallet.sip009Transfer(
        1,
        "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.smart-wallet",
        sip09Contract
      ),
      accounts.wallet_1.address
    );

    expect(response.result).toBeErr(Cl.uint(101));
  });

  // Uncomment and adjust as needed for other tests
  // it("transfers fee to sponsor", async () => {
  //   const fees = 10000;
  //   const response = await txOk(
  //     smartWalletEndpoint.stxTransferSponsored({
  //       amount: transferAmount,
  //       to: accounts.wallet_2.address,
  //       fees,
  //     }),
  //     accounts.wallet_1.address
  //   );

  //   expect(response.result.type).toBe(ClarityType.ResponseOk);
  //   // only 1 stx transfer because there is no sponsored tx here
  //   expect(response.events.length).toBe(1);
  //   const event = response.events[0].data;
  //   if (hasAmountProperty(event)) {
  //     expect(event.amount).toBe(transferAmount.toString());
  //   } else {
  //     throw new Error("Event data does not have amount property");
  //   }
  // });
});
