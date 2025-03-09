
;; title: standard-rules
;; version:
;; summary:
;; description:

(use-trait extension-trait .extension-trait.extension-trait)

(define-constant err-unauthorised (err u401))
(define-constant E6 u1000000)
(define-data-var weekly-amount uint u0)

(define-public (is-allowed-stx (amount uint) (recipient principal) (memo (optional (buff 34))))
    (let 
        (   
            (spent-amount (var-get weekly-amount))
            (new-spent-amount (+ amount spent-amount))
        )
        (var-set weekly-amount new-spent-amount)
        (asserts! (is-eq contract-caller .smart-wallet-with-rules) err-unauthorised)
        (ok (and (< amount (* u100 E6)) (< spent-amount (* u1000 E6))))
    )
)

(define-public (is-allowed-extension (extension <extension-trait>) (payload (buff 2048)))
    (ok true)
)