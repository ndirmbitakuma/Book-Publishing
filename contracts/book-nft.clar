;; Decentralized Autonomous Book Publishing Platform - Book NFT Contract

;; Constants
(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u100))
(define-constant err-not-found (err u101))
(define-constant err-already-exists (err u102))
(define-constant err-unauthorized (err u103))
(define-constant err-out-of-stock (err u104))
(define-constant err-transfer-failed (err u105))

;; Data variables
(define-data-var next-book-id uint u1)

;; Data maps
(define-map books
  { book-id: uint }
  {
    title: (string-utf8 256),
    author: principal,
    description: (string-utf8 1024),
    cover-image: (optional (string-utf8 256)),
    content-hash: (buff 32),
    price: uint,
    total-supply: uint,
    available-supply: uint
  }
)

(define-map book-owners
  { book-id: uint, owner: principal }
  { balance: uint }
)

;; Private functions
(define-private (is-owner)
  (is-eq tx-sender contract-owner)
)

;; Public functions
(define-public (publish-book (title (string-utf8 256)) (description (string-utf8 1024)) (cover-image (optional (string-utf8 256))) (content-hash (buff 32)) (price uint) (total-supply uint))
  (let
    (
      (book-id (var-get next-book-id))
    )
    (asserts! (is-none (map-get? books {book-id: book-id})) (err err-already-exists))
    (map-set books
      {book-id: book-id}
      {
        title: title,
        author: tx-sender,
        description: description,
        cover-image: cover-image,
        content-hash: content-hash,
        price: price,
        total-supply: total-supply,
        available-supply: total-supply
      }
    )
    (map-set book-owners
      {book-id: book-id, owner: tx-sender}
      {balance: total-supply}
    )
    (var-set next-book-id (+ book-id u1))
    (ok book-id)
  )
)

(define-public (purchase-book (book-id uint))
  (let
    (
      (book (unwrap! (map-get? books {book-id: book-id}) (err err-not-found)))
      (price (get price book))
      (available-supply (get available-supply book))
      (author (get author book))
    )
    (asserts! (> available-supply u0) (err err-out-of-stock))
    (asserts! (is-ok (stx-transfer? price tx-sender author)) (err err-transfer-failed))
    (map-set books
      {book-id: book-id}
      (merge book {available-supply: (- available-supply u1)})
    )
    (match (map-get? book-owners {book-id: book-id, owner: tx-sender})
      existing-balance (map-set book-owners
        {book-id: book-id, owner: tx-sender}
        {balance: (+ (get balance existing-balance) u1)}
      )
      (map-set book-owners
        {book-id: book-id, owner: tx-sender}
        {balance: u1}
      )
    )
    (ok true)
  )
)

(define-read-only (get-book (book-id uint))
  (ok (map-get? books {book-id: book-id}))
)

(define-read-only (get-book-balance (book-id uint) (owner principal))
  (ok (default-to u0 (get balance (map-get? book-owners {book-id: book-id, owner: owner}))))
)

(define-read-only (get-next-book-id)
  (ok (var-get next-book-id))
)

