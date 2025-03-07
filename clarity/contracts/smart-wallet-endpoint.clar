
;; title: smart-wallet-endpoint
;; version:
;; summary:
;; description:
(define-constant err-invalid-payload (err u5000))
(use-trait sip-010-token 'SP3FBR2AGK5H9QBDH3EEN6DF8EK8JY7RX8QJ5SVTE.sip-010-trait-ft-standard.sip-010-trait)
(use-trait wallet-trait .smart-wallet-trait.smart-wallet-trait)
(use-trait extension-trait .extension-trait.extension-trait)

(define-public (stx-transfer-sponsored (sm <wallet-trait>) (details {amount: uint, to: principal, fees: uint}))
    (contract-call? sm extension-call .ext-sponsored-transfer (unwrap! (to-consensus-buff? details) err-invalid-payload))
)
(define-public (transfer-unsafe-sip-010-token (sm <wallet-trait>) (details {amount: uint, to: principal, token: <sip-010-token>}))
    (contract-call? sm extension-call .ext-unsafe-sip010-transfer (unwrap! (to-consensus-buff? details) err-invalid-payload))
)
(define-public (delegate-stx (sm <wallet-trait>) (extension <extension-trait>) (amount uint) (to principal))
    (contract-call? sm extension-call extension (unwrap! (to-consensus-buff?
        {action: "delegate",
                    amount-ustx: amount,
                    delegate-to: to,
                    until-burn-ht: none,
                    pox-addr: none,
                }) err-invalid-payload))
)

(define-public (revoke-delegate-stx (sm <wallet-trait>) (extension <extension-trait>))
    (contract-call? sm extension-call extension (unwrap! (to-consensus-buff?
    {action: "revoke",
                    amount-ustx: u0,
                    delegate-to: tx-sender,
                    until-burn-ht: none,
                    pox-addr: none,
                }) err-invalid-payload))
)