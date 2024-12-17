;; title: smart-wallet-standard
;; version:
;; summary:
;; description:
(use-trait extension-trait .extension-trait.extension-trait)

(use-trait sip-010-trait 'SP3FBR2AGK5H9QBDH3EEN6DF8EK8JY7RX8QJ5SVTE.sip-010-trait-ft-standard.sip-010-trait)
(use-trait sip-009-trait 'SP2PABAF9FTAJYNFZH93XENAJ8FVY99RRM50D2JG9.nft-trait.nft-trait)

(define-constant err-unauthorised (err u401))
(define-constant err-forbidden (err u403))

(define-read-only (is-admin-calling)
	(ok (asserts! (default-to false (map-get? admins contract-caller)) err-unauthorised))
)

(define-private (is-allowed-stx (amount uint) (recipient principal) (memo (optional (buff 34))))
	(ok (asserts! (default-to false (map-get? admins contract-caller)) err-unauthorised))
)

(define-private (is-allowed-extension (extension <extension-trait>) (payload (buff 2048)))
	(ok (asserts! (default-to false (map-get? admins contract-caller)) err-unauthorised))
)

(define-private (is-allowed-sip010 (sip010 <sip-010-trait>) (amount uint) (recipient principal) (memo (optional (buff 34))))
		(ok (asserts! (default-to false (map-get? admins contract-caller)) err-unauthorised))
)

(define-private (is-allowed-sip009 (sip009 <sip-009-trait>) (amount uint) (recipient principal))
		(ok (asserts! (default-to false (map-get? admins contract-caller)) err-unauthorised))
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
		(try! (is-allowed-sip009 sip009 nft-id recipient))
		(contract-call? sip009 transfer nft-id (as-contract tx-sender) recipient)
	)
)

;;
;; admin functions
;;
(define-map admins principal bool)

(define-public (enable-admin (admin principal) (enabled bool))
	(begin
		(try! (is-admin-calling))
		(asserts! (not (is-eq admin contract-caller)) err-forbidden)
		(ok (map-set admins admin enabled))
	)
)

(define-public (transfer-wallet (new-admin principal))
	(begin
		(try! (is-admin-calling))
		(try! (enable-admin new-admin true))
		(try! (as-contract (enable-admin contract-caller false)))
		(ok true)
	)
)

;; init
(map-set admins tx-sender true)
(map-set admins (as-contract tx-sender) true)
