(use-trait extension-trait .extension-trait.extension-trait)

(define-trait rule-set-trait
    (
        (is-allowed-stx (uint principal (optional (buff 34))) (response bool uint))
        (is-allowed-extension (<extension-trait> (buff 2048)) (response bool uint))
    )
)