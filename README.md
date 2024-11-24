# Decentralized Book Publishing Platform

## Overview
This smart contract system implements a decentralized book publishing platform with automated royalty distribution. The platform enables authors to publish and sell digital books as NFTs while ensuring fair compensation through transparent royalty payments. The system consists of two main components: the Book NFT Contract and the Royalty Distribution Contract.

## Core Components

### 1. Book NFT Contract
Handles the core book publishing and ownership management.

### 2. Royalty Distribution Contract
Manages platform fees and royalty payments to authors.

## Features
- NFT-based book publishing
- Automated royalty distribution
- Limited edition digital books
- Transparent fee structure
- Direct author payments
- Supply management
- Ownership tracking

## Smart Contract Functions

### Publishing Operations
```clarity
publish-book (
    title: string-utf8,
    description: string-utf8,
    cover-image: optional string-utf8,
    content-hash: buff,
    price: uint,
    total-supply: uint
) -> response
```
Parameters:
- `title`: Book title (max 256 characters)
- `description`: Book description (max 1024 characters)
- `cover-image`: Optional cover image URL
- `content-hash`: 32-byte hash of book content
- `price`: Book price in microSTX
- `total-supply`: Number of copies available

### Purchase Operations
```clarity
purchase-book (book-id: uint) -> response
```
Handles:
- Payment processing
- Supply management
- Ownership recording
- Balance updates

### Royalty Operations
```clarity
distribute-royalties (
    book-id: uint,
    amount: uint
) -> response
```
Features:
- Automated fee calculation
- Platform fee distribution
- Author payment processing

### Administrative Functions
```clarity
set-platform-fee (new-fee: uint) -> response
```
Allows contract owner to:
- Update platform fee percentage
- Maximum 100% (u1000)

### Read-Only Functions
- `get-book`: Retrieve book details
- `get-book-balance`: Check ownership balance
- `get-next-book-id`: Get next available book ID
- `get-platform-fee`: View current platform fee

## Data Structures

### Book Record
```clarity
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
```

### Ownership Record
```clarity
{
  balance: uint
}
```

## Fee Structure
- Platform fee: 5% default (configurable)
- Fee calculation: `(amount * platform-fee) / 1000`
- Author royalty: Remaining amount after platform fee

## Error Codes
```clarity
err-owner-only (u100)        // Operation restricted to contract owner
err-not-found (u101)         // Resource not found
err-already-exists (u102)    // Duplicate resource
err-unauthorized (u103)      // Unauthorized access
err-out-of-stock (u104)      // No available copies
err-transfer-failed (u105)   // Payment failed
err-invalid-fee (u101)       // Invalid fee percentage
```

## Usage Examples

### Publishing a New Book
```clarity
(contract-call? .book-publishing publish-book 
    "Web3 Development"
    "Complete guide to blockchain development"
    (some "https://example.com/cover.jpg")
    0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef
    u1000000  ;; 1 STX
    u100      ;; 100 copies
)
```

### Purchasing a Book Copy
```clarity
(contract-call? .book-publishing purchase-book u1)
```

### Checking Book Ownership
```clarity
(contract-call? .book-publishing get-book-balance u1 tx-sender)
```

## Implementation Guidelines

### For Authors
1. Content Preparation
    - Prepare book content
    - Generate content hash
    - Prepare metadata
    - Set pricing strategy
    - Determine supply

2. Publication Process
    - Call publish-book function
    - Monitor transaction
    - Verify listing

### For Readers
1. Purchase Process
    - Check availability
    - Verify price
    - Execute purchase
    - Confirm ownership

### For Platform Operators
1. Fee Management
    - Monitor platform fees
    - Adjust rates as needed
    - Track distributions
    - Maintain transparency

## Security Features
1. Ownership Verification
    - Principal-based authentication
    - Balance tracking
    - Supply management

2. Transaction Safety
    - Automated error handling
    - Supply validation
    - Payment verification

3. Access Control
    - Owner-only functions
    - Authorization checks
    - Error management

## Technical Integration

### Requirements
- Stacks wallet
- STX tokens for transactions
- Content storage solution
- Hash generation capability

### Smart Contract Interaction
1. Contract Deployment
2. Function Calls
3. Transaction Monitoring
4. Error Handling

## Future Enhancements
1. Secondary Market Support
2. Multiple Author Collaboration
3. Subscription Models
4. Review System
5. Content Updates
6. Advanced Royalty Models
7. Reading Analytics
8. Promotional Tools

## Platform Benefits
- Decentralized Distribution
- Automated Payments
- Transparent Royalties
- Supply Control
- Permanent Records
- Global Access
- Instant Settlements

For more information or technical support, please refer to the platform documentation or contact the development team.
