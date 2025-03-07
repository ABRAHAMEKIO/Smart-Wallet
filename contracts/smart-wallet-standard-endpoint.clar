(define-constant err-invalid-payload (err u5000))
(use-trait sip-010-token 'SP3FBR2AGK5H9QBDH3EEN6DF8EK8JY7RX8QJ5SVTE.sip-010-trait-ft-standard.sip-010-trait)

(define-public (stx-transfer-sponsored (details {amount: uint, to: principal, fees: uint}))
    (contract-call? .smart-wallet-standard extension-call .ext-sponsored-transfer (unwrap! (to-consensus-buff? details) err-invalid-payload)))
(define-public (transfer-unsafe-sip-010-token (details {amount: uint, to: principal, token: <sip-010-token>}))
    (contract-call? .smart-wallet-standard extension-call .ext-unsafe-sip010-transfer (unwrap! (to-consensus-buff? details) err-invalid-payload)))