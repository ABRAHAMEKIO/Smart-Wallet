(define-trait smart-wallet-trait
    (
        (set-security-level (uint) (response bool uint))
        (is-inactive () (response bool uint))
        (delegate-call-back (uint principal (optional uint) (optional {version: (buff 1), hashbytes: (buff 32)})) (response bool uint))
    )
)