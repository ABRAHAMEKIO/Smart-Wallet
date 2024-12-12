(use-trait smart-wallet-trait .smart-wallet-trait.smart-wallet-trait)
(define-constant err-invalid-payload (err u500))

(define-public (call (payload (buff 2048)))
    (let 
        (
            (details (unwrap! (from-consensus-buff? 
                {
                    smart-wallet: <smart-wallet-trait>,
                    amount-ustx: uint, 
                    delegate-to: principal, 
                    until-burn-ht: (optional uint),
                    pox-addr: (optional { version: (buff 1), 
                    hashbytes: (buff 32) })
                } payload) err-invalid-payload)
            )
            (smart-wallet-address (get smart-wallet details))
        )
        (asserts! (is-eq contract-caller (contract-of smart-wallet-address)) err-invalid-payload)
        (contract-call? smart-wallet-address delegate-call-back (get amount-ustx details) (get delegate-to details) (get until-burn-ht details) (get pox-addr details))
    )
)