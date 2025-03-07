import { CoreNodeEventType, cvToValue, projectFactory } from "@clarigen/core";
import { filterEvents, rovOk, txErr, txOk } from "@clarigen/test";
import {
  boolCV,
  Cl,
  ClarityType,
  contractPrincipalCV,
  standardPrincipalCV,
  trueCV,
  uintCV,
} from "@stacks/transactions";
import { describe, expect, it } from "vitest";
import {
  accounts,
  deployments,
  project,
} from "../../clarigen/src/clarigen-types";
import { serialize } from "@clarigen/cli";
import { tx } from "@hirosystems/clarinet-sdk";
import { bool } from "@stacks/transactions/dist/cl";

const { smartWalletStandardEndpoint } = projectFactory(project, "simnet");

const delegationAmount = 100;

const deployer = accounts.deployer.address;
const poolAdmin = accounts.wallet_2.address;

describe("standard wallet with delegate-stx-pox-4 extension", () => {
  it("user can delegate", async () => {
    const stxTransfer = tx.transferSTX(
      10000000000,
      deployments.smartWalletStandard.simnet,
      deployer
    );
    simnet.mineBlock([stxTransfer]);

    const response = txOk(
      smartWalletStandardEndpoint.delegateStx(delegationAmount, poolAdmin),
      deployer
    );

    expect(response.result).toBeOk(boolCV(true));
    // check for print event
    const printEvents = filterEvents(
      response.events,
      CoreNodeEventType.ContractEvent
    );
    expect(printEvents.length).toEqual(1);
    const [print] = printEvents;
    const printData = cvToValue<{
      action: string;
      object: string;
      value: bigint;
    }>(print.data.value);

    // extension call token event
    const ectEvents = filterEvents(
      response.events,
      CoreNodeEventType.FtBurnEvent
    );
    expect(ectEvents.length).toEqual(1);

    const [ectEvent] = ectEvents;
    expect(ectEvent.data.amount).toEqual("1");

    const stxEvents = filterEvents(
      response.events,
      CoreNodeEventType.StxTransferEvent
    );
    const [stxEvent] = stxEvents;
    expect(stxEvent.data.amount).toEqual(delegationAmount.toString());

    expect(stxEvent.data.sender).toEqual(
      deployments.smartWalletStandard.simnet
    );
    expect(stxEvent.data.recipient).toEqual(
      deployments.extDelegateStxPox4.simnet
    );
  });
});
