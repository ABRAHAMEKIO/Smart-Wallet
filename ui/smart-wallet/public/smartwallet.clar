(define-private (is-allowed-extension (extension <extension-trait>) (payload (buff 2048)))
	(ok true)
)

(define-public (stx-transfer (amount uint) (recipient principal) (memo (optional (buff 34))))
	(ok true)
)

(define-public (extension-call (extension <extension-trait>) (payload (buff 2048)))
	(begin
		(try! (is-allowed-extension extension payload))
		(as-contract (contract-call? extension call payload))
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