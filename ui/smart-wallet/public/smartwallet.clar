(define-public (stx-transfer (amount uint) (recipient principal) (memo (optional (buff 34))))
	(ok true)
)

(define-public (extension-call (extension principal) (payload (buff 2048)))
	(ok true)
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