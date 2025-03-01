(use-trait extension-trait .extension-trait.extension-trait)

(define-constant err-unauthorised (err u401))
(define-constant err-forbidden (err u403))

(define-map admins principal bool)

(define-private (is-allowed-extension (extension <extension-trait>) (payload (buff 2048)))
	(ok (asserts! (default-to false (map-get? admins contract-caller)) err-unauthorised))
)

(define-public (stx-transfer (amount uint) (recipient principal) (memo (optional (buff 34))))
	(ok true)
)

(define-public (extension-call (extension <extension-trait>) (payload (optional (buff 2048))))
	(begin
		;; (try! (is-allowed-extension extension (unwrap! payload err-forbidden)))
		(as-contract (contract-call? extension call (unwrap! payload err-forbidden)))
	)
)

(define-public (sip010-transfer (amount uint) (recipient principal) (memo (optional (buff 34))) (sip010 principal))
	(ok true)
)

(define-public (sip009-transfer (nft-id uint) (recipient principal) (sip009 principal))
	(ok true)
)

(define-public (enable-admin (admin principal) (enabled bool))
	(ok true)
)

(define-public (transfer-wallet (new-admin principal))
	(ok true)
)

(map-set admins tx-sender true)
(map-set admins (as-contract tx-sender) true)
(map-set admins 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.ext-delegate-stx-pox-4 true)