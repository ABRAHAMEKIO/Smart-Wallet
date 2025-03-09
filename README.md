# Smart Wallets for Stacks Blockchain

Smart Wallet is a smart contract that holds assets in the name of one or more users. It is like a single user [executor DAO by Marvin Janssen](https://github.com/MarvinJanssen/executor-dao) and also inspired by [Lisa DAO](https://github.com/lisalab-io/liquid-stacking).

See [DOCS](https://stackerspool.gitbook.io/smart-wallet/).

See [ROADMAP](ROADMAP).

An earlier versions of smart wallets on Stacks was develop by Hiro Systems: [Smart Wallet](https://github.com/hirosystems/smart-wallet).

## Contracts

### Complicated Smart Wallet

- smart-wallet-with-rules.clar: most experimental wallet that uses rules with limits and inactivity tracker
- smart-wallet-with-rules-endpoint.clar: user facing functions

### Basic Smart Wallet

- smart-wallet-standard.clar: just a simple wallet

## Extensions

Extensions are smart contracts that can be execute anything in the name of the smart contract. The expect a buffer as payload containing a serialized Clarity Value of a certain type. The tx-sender and contract-caller of the extension is the smart wallet.

There is a stateless contract that provides convenient functions to popular call extensions

- smart-wallet-endpoint.clar: user facing functions

### Sponsored STX transfer

Sends stx to a recipient and for sponsored txs some amount to cover fees to the tx sponsor.

Payload type:

```
{amount: uint, to: principal, fees: uint}
```

### Stacking with a pool

Acts as the stacker of a pool and calls pox-4 contract functions according to provided action. The delegated amount is transferred to this extension for stacking and all stx tokens can be withdrawn afterwards.

**Note**, each wallet needs its own stacking extension.

Supported actions:

| name             | pox-4 call                  |
| ---------------- | --------------------------- |
| `delegate`       | calls `delegate-stx`        |
| `revoke`         | calls `revoke-delegate-stx` |
| any other action | withdraws all stx tokens    |

Payload type:

```
{
    action: (string-ascii 10),
    amount-ustx: uint,
    delegate-to: principal,
    until-burn-ht: (optional uint),
    pox-addr: (optional { version: (buff 1),
    hashbytes: (buff 32) })
}
```

### Transfer Unsafe SIP 10 Tokens (FT)

Sends SIP-010 tokens to the provided recipient for tokens that can't be transferred when sender and tx-sender do not match. Supports the following tokens only:

| Symbol | Contract                                                  |
| ------ | --------------------------------------------------------- |
| xbtc   | SP3DX3H4FEYZJZ586MFBS25ZW3HZDMEW92260R2PR.Wrapped-Bitcoin |

Payload type:

```
{amount: uint, to: principal, token: principal}
```

## UI

In folder `ui` a basic web interface is developed. It allows to interact with smart wallets.

## Development

Use `clarinet check` and `pnpm test` to verify the contracts.

In folder `ui`, call `pnpm install` and `pnpm dev` to launch the ui.
