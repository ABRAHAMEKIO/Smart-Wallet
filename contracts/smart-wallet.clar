;; title: smart-wallet
;; version:
;; summary:
;; description:

(use-trait extension-trait .extension-trait.extension-trait)
(use-trait sip-010-trait 'SP3FBR2AGK5H9QBDH3EEN6DF8EK8JY7RX8QJ5SVTE.sip-010-trait-ft-standard.sip-010-trait)

(define-constant err-unauthorised (err u1000))

(define-read-only (is-allowed-stx (amount uint) (recipient principal) (memo (optional (buff 34))))
	(ok (asserts! true err-unauthorised))
)

(define-read-only (is-allowed-extension (extension <extension-trait>) (payload (buff 2048)))
	(ok (asserts! true err-unauthorised))
)

(define-read-only (is-allowed-sip010 (amount uint) (recipient principal) (memo (optional (buff 34))) (sip010 <sip-010-trait>))
	(ok (asserts! true err-unauthorised))
)

(define-read-only (is-allowed-sip009 (amount uint) (recipient principal) (sip009 <sip-009-trait>))
	(ok (asserts! true err-unauthorised))
)

;;
;; calls with context switching
;;

(define-public (stx-transfer (amount uint) (recipient principal) (memo (optional (buff 34))))
	(begin
		(try! (is-allowed-stx amount recipient memo))
		(as-contract (match memo
			to-print (stx-transfer-memo? amount tx-sender recipient to-print)
			(stx-transfer? amount tx-sender recipient)
		))
	)
)


(define-public (extension-call (extension <extension-trait>) (payload (buff 2048)))
	(begin
		(try! (is-allowed-extension extension payload))
		(as-contract (contract-call? extension call payload))
	)
)

;;
;; calls without context switching
;;

(define-public (sip010-transfer (amount uint) (recipient principal) (memo (optional (buff 34))) (sip010 <sip-010-trait>))
	(begin
		(try! (is-allowed-sip010 sip010 amount recipient memo))
		(contract-call? sip010 transfer amount (as-contract tx-sender) recipient memo)
	)
)

(define-public (sip009-transfer (nft-id uint) (recipient principal) (sip009 <sip-009-trait>))
	(begin
		(try! (is-allowed-sip009 sip009 amount recipient memo))
		(contract-call? sip009 transfer nft-id (as-contract tx-sender) recipient)
	)
)
