;; Royalty Distribution Contract

;; Constants
(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u100))
(define-constant err-invalid-fee (err u101))

;; Data Variables
(define-data-var platform-fee uint u50) ;; 5% fee (1000 = 100%)

;; Public Functions
(define-public (distribute-royalties (book-id uint) (amount uint))
  (let
    (
      (fee-amount (/ (* amount (var-get platform-fee)) u1000))
      (author-amount (- amount fee-amount))
    )
    ;; Transfer the platform fee
    (try! (stx-transfer? fee-amount tx-sender contract-owner))

    ;; Transfer the royalties to the author (assuming the author is the contract owner for simplicity)
    (try! (stx-transfer? author-amount tx-sender contract-owner))

    ;; Return success
    (ok true)
  )
)

;; Read-only Functions
(define-read-only (get-platform-fee)
  (ok (var-get platform-fee))
)

;; Admin Functions
(define-public (set-platform-fee (new-fee uint))
  (begin
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (asserts! (<= new-fee u1000) err-invalid-fee)
    (ok (var-set platform-fee new-fee))
  )
)

