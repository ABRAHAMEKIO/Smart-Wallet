(define-constant err-unauthorised (err u401))
(define-constant err-invalid-payload (err u500))

(define-public (call (payload (buff 2048)))
    (begin
        (let ((data (unwrap! (from-consensus-buff? principal payload) err-invalid-payload)))
            (ok (asserts! (is-eq data tx-sender) err-unauthorised)))))