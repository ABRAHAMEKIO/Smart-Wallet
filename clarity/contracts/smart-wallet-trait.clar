
;; title: smart-wallet-trait
;; version:
;; summary:
;; description:

(use-trait extension-trait .extension-trait.extension-trait)

(define-trait smart-wallet-trait
    (
        (extension-call (<extension-trait> (buff 2048)) (response bool uint))        
    )
)