(define-constant err-invalid-payload (err u500))

(define-public (call (payload (buff 2048)))
    (let ((details (unwrap! (from-consensus-buff? {amount: uint, to: principal, token: principal} payload) err-invalid-payload)))
        (if (is-eq (get token details) 'SP32AEEF6WW5Y0NMJ1S8SBSZDAY8R5J32NBZFPKKZ.nope)
            (contract-call? 'SP32AEEF6WW5Y0NMJ1S8SBSZDAY8R5J32NBZFPKKZ.nope transfer (get amount details) tx-sender (get to details) none)
            err-invalid-payload)))