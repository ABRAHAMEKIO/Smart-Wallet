;; title: smart-wallet-with-rules
;; version:
;; summary:
;; description:
(use-trait extension-trait .extension-trait.extension-trait)
(use-trait rule-set-trait .rule-set-trait.rule-set-trait)

(use-trait sip-010-trait 'SP3FBR2AGK5H9QBDH3EEN6DF8EK8JY7RX8QJ5SVTE.sip-010-trait-ft-standard.sip-010-trait)
(use-trait sip-009-trait 'SP2PABAF9FTAJYNFZH93XENAJ8FVY99RRM50D2JG9.nft-trait.nft-trait)

(define-constant err-unauthorised (err u401))
(define-constant err-forbidden (err u403))

(define-map rule-sets principal bool)

(define-data-var security-level uint u1)

(define-read-only (is-admin-calling)
	(ok (asserts! (default-to false (map-get? admins contract-caller)) err-unauthorised))
)

(define-private (is-allowed-stx (rules <rule-set-trait>) (amount uint) (recipient principal) (memo (optional (buff 34))))
	(contract-call? rules is-allowed-stx amount recipient memo)
)

(define-private (is-allowed-extension (rules <rule-set-trait>) (extension <extension-trait>) (payload (buff 2048)))
	(contract-call? rules is-allowed-extension extension payload)
)


(define-private (is-allowed-sip010 (sip010 <sip-010-trait>) (amount uint) (recipient principal) (memo (optional (buff 34))))
		(ok (asserts! true err-unauthorised))
)

(define-private (is-allowed-sip009 (sip009 <sip-009-trait>) (amount uint) (recipient principal))
		(ok (asserts! true err-unauthorised))
)
;;
;; activity tracker
;;
(define-constant activity-period (if is-in-mainnet (* u70 u24 u3600 u1000) u1000)) ;; 10 weeks or 1 second
(define-data-var last-tx-time uint u0)
(define-read-only (get-time)
	(unwrap-panic (get-stacks-block-info? time (- stacks-block-height u1)))
)
(define-read-only (is-inactive)
	(> (get-time) (+ activity-period (var-get last-tx-time)))
)
	
;;
;; calls with context switching
;;
(define-public (stx-transfer (amount uint) (recipient principal) (memo (optional (buff 34))))
	(begin
		(try! (is-allowed-stx (current-rules) amount recipient memo))
		(var-set last-tx-time (get-time))
		(as-contract (match memo
			to-print (stx-transfer-memo? amount tx-sender recipient to-print)
			(stx-transfer? amount tx-sender recipient)
		))
	)
)

(define-public (extension-call (extension <extension-trait>) (payload (buff 2048)))
	(begin
		(try! (is-allowed-extension (current-rules) extension payload))
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

(define-public (set-security-level (new-level uint))
	(begin 
		(try! (is-admin-calling))
		(ok (var-set security-level new-level))
	)
)

(define-read-only (current-rules)
	(let ((level (var-get security-level)))
		(if (is-eq level u0)
			(to-trait .no-rules)
			(if (is-eq level u1)
				(to-trait .standard-rules)
				(to-trait .emergency-rules)
			)
		)
	)
)

(define-read-only (to-trait (trait <rule-set-trait>)) trait)

;; init
(set-security-level u1)
(map-set admins .inactive-observer true)
(map-set admins tx-sender true)
;; send 1000 ustx to the smart wallet
(stx-transfer? u1000 tx-sender (as-contract tx-sender))
