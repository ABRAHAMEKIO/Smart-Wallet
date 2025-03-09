
;; title: inactive-observer
;; version:
;; summary:
;; description:

(use-trait smart-wallet-trait .smart-wallet-with-rules-trait.smart-wallet-trait)

(define-public (close-smart-wallet (wallet <smart-wallet-trait>))
    (match (contract-call? wallet is-inactive)
        is-inactive (if is-inactive
            (contract-call? wallet set-security-level u2)
            (ok true))
        error (ok true)
    )
)