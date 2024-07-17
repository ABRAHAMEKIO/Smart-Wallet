(define-constant err-invalid-payload (err u500))

(define-public (call (payload (buff 2048)))
    (let ((details (unwrap! (from-consensus-buff? {amount-ustx: uint, delegate-to: principal, until-burn-ht: (optional uint),
                             pox-addr: (optional { version: (buff 1), hashbytes: (buff 32) })} payload) err-invalid-payload)))
        (to-uint-response (contract-call? 'SP000000000000000000002Q6VF78.pox-4 delegate-stx 
            (get amount-ustx details) (get delegate-to details) (get until-burn-ht details) (get pox-addr details)))
    ))

(define-read-only (to-uint-response (res (response bool int)))
    (match res success (ok success) error (err (to-uint error))))