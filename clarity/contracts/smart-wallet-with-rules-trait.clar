
;; title: smart-wallet-trait
;; version:
;; summary:
;; description:

(define-trait smart-wallet-trait
    (
        (set-security-level (uint) (response bool uint))
        (is-inactive () (response bool uint))
    )
)