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
import { buffer } from "@stacks/transactions/dist/cl";

const { smartWalletStandard, smartWalletStandardEndpoint, extDelegateStxPox4 } =
  projectFactory(project, "simnet");

const deployer = accounts.deployer.address;
const address1 = accounts.wallet_1.address;
const address2 = accounts.wallet_2.address;
const address3 = accounts.wallet_3.address;

if (!deployer || !address2 || !address3) {
  throw new Error("One or more required addresses are undefined.");
}

const delegateAmount = 100;
const amountCV = uintCV(delegateAmount);
const poolAdminCV = standardPrincipalCV(address2);

describe("test `smart-wallet-standard` can use pox-4", () => {
  it("delegate 100 ustx to pool", async () => {
    // send 1000 stx from deployer to smart wallet
    const fundResponse = simnet.transferSTX(
      1000000000,
      `${deployer}.${smartWalletStandard.contractName}`,
      address2
    );
    expect(fundResponse.result).toBeOk(Cl.bool(true));
    simnet.mineEmptyBlock();

    const payloadDelegate = serializeCV(
      tupleCV({
        action: stringAsciiCV("delegate"),

        "amount-ustx": amountCV,
        "delegate-to": poolAdminCV,
        "until-burn-ht": noneCV(),
        "pox-addr": noneCV(),
      })
    );
    const delegateResponse = txOk(
      smartWalletStandard.extensionCall(
        `${deployer}.${extDelegateStxPox4.contractName}`,
        payloadDelegate
      ),
      deployer
    );

    console.log("Delegate Response:", Cl.prettyPrint(delegateResponse.result));
    console.log("Delegate Response:", delegateResponse.events[0]);
    console.log("Delegate Response:", delegateResponse.events[1]);
    expect(delegateResponse.result).toBeOk(Cl.bool(true));

    const payloadREvoke = serializeCV(
      tupleCV({
        action: stringAsciiCV("revoke"),
        "amount-ustx": amountCV,
        "delegate-to": poolAdminCV,
        "until-burn-ht": noneCV(),
        "pox-addr": noneCV(),
      })
    );
    const revokeResponse = txOk(
      smartWalletStandard.extensionCall(
        `${deployer}.${extDelegateStxPox4.contractName}`,
        payloadREvoke
      ),
      deployer
    );

    console.log("Revoke Response:", Cl.prettyPrint(revokeResponse.result));
    console.log("Revoke Response:", revokeResponse.events[0]);
    expect(revokeResponse.result).toBeOk(Cl.bool(true));

    const payloadWithdraw = serializeCV(
      tupleCV({
        action: stringAsciiCV("withdraw"),
        "amount-ustx": amountCV,
        "delegate-to": poolAdminCV,
        "until-burn-ht": noneCV(),
        "pox-addr": noneCV(),
      })
    );
    const responseWithdraw = txOk(
      smartWalletStandard.extensionCall(
        `${deployer}.${extDelegateStxPox4.contractName}`,
        payloadWithdraw
      ),
      deployer
    );

    console.log("Withdraw Response:", Cl.prettyPrint(responseWithdraw.result));
    console.log("Withdraw Response:", responseWithdraw.events[0]);
    expect(responseWithdraw.result).toBeOk(Cl.bool(true));
  });
});
