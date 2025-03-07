
;; title: ext-unsafe-sip010-transfer
;; version:
;; summary:
;; description:

(define-constant err-invalid-payload (err u500))

(define-public (call (payload (buff 2048)))
    (let 
        (
            (details 
                (unwrap! 
                    (from-consensus-buff? 
                        {
                            amount: uint, 
                            to: principal, 
                            token: principal
                        } 
                        payload
                    ) 
                    err-invalid-payload
                )
            )
        )
        (if (is-eq (get token details) 'SP3DX3H4FEYZJZ586MFBS25ZW3HZDMEW92260R2PR.Wrapped-Bitcoin)
            (contract-call? 'SP3DX3H4FEYZJZ586MFBS25ZW3HZDMEW92260R2PR.Wrapped-Bitcoin transfer (get amount details) tx-sender (get to details) none)
            err-invalid-payload
        )
    )
)