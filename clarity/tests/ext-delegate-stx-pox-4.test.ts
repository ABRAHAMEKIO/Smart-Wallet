import {
  CoreNodeEventType,
  cvToValue,
  hexToBytes,
  projectFactory,
} from "@clarigen/core";
import { filterEvents, txOk } from "@clarigen/test";
import { tx } from "@hirosystems/clarinet-sdk";
import {
  boolCV,
  bufferCV,
  principalCV,
  tupleCV,
  uintCV,
} from "@stacks/transactions";
import { describe, expect, test } from "vitest";
import {
  accounts,
  deployments,
  project,
} from "../../clarigen/src/clarigen-types";

const { smartWalletEndpoint, extDelegateStxPox4 } = projectFactory(
  project,
  "simnet"
);

const delegationAmount = 100;

const deployer = accounts.deployer.address;
const poolAdmin = accounts.wallet_2.address;

const smartWallet = deployments.smartWalletStandard.simnet;
const delegateExtension = deployments.extDelegateStxPox4.simnet;
describe("Standard wallet with delegate-stx-pox-4 extension", () => {
  test("that user can delegate and pool admin can lock", async () => {
    const stxTransfer = tx.transferSTX(10000000000, smartWallet, deployer);
    simnet.mineBlock([stxTransfer]);

    // delegate to pool admin
    const response = txOk(
      smartWalletEndpoint.delegateStx(
        smartWallet,
        delegateExtension,
        delegationAmount,
        poolAdmin
      ),
      deployer
    );

    expect(response.result).toBeOk(boolCV(true));

    // check for print event
    const printEvents = filterEvents(
      response.events,
      CoreNodeEventType.ContractEvent
    );
    expect(printEvents.length).toEqual(2);
    const [print] = printEvents;
    const printData = cvToValue<{
      a: string;
      payload: { extension: string };
    }>(print.data.value);
    expect(printData.a).toEqual("extension-call");
    expect(printData.payload.extension).toEqual(
      deployments.extDelegateStxPox4.simnet
    );

    // extension call token event
    const ectEvents = filterEvents(
      response.events,
      CoreNodeEventType.FtBurnEvent
    );
    expect(ectEvents.length).toEqual(1);

    const [ectEvent] = ectEvents;
    expect(ectEvent.data.amount).toEqual("1");

    // check stx transfer event from smart wallet to extension
    const stxEvents = filterEvents(
      response.events,
      CoreNodeEventType.StxTransferEvent
    );
    const [stxEvent] = stxEvents;
    expect(stxEvent.data.amount).toEqual(delegationAmount.toString());

    expect(stxEvent.data.sender).toEqual(smartWallet);
    expect(stxEvent.data.recipient).toEqual(
      deployments.extDelegateStxPox4.simnet
    );

    // let pool admin lock
    const lockResponse = simnet.callPublicFn(
      "SP000000000000000000002Q6VF78.pox-4",
      "delegate-stack-stx",
      [
        principalCV(deployments.extDelegateStxPox4.simnet),
        uintCV(delegationAmount),
        tupleCV({
          version: bufferCV(hexToBytes("01")),
          hashbytes: bufferCV(
            hexToBytes("b0b75f408a29c271d107e05d614d0ff439813d02")
          ),
        }),
        uintCV(100),
        uintCV(1),
      ],
      poolAdmin
    );

    expect(lockResponse.result).toBeOk(
      tupleCV({
        "lock-amount": uintCV(delegationAmount),
        stacker: principalCV(deployments.extDelegateStxPox4.simnet),
        "unlock-burn-height": uintCV(2100),
      })
    );
  });
});
