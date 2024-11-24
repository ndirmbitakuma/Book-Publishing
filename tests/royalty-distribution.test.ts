import { describe, it, expect, beforeEach } from 'vitest';

// Mock contract state
let books: any[] = [];
let nextBookId = 1;
let platformFee = 50; // 5%

// Mock contract functions
function publishBook(author: string, title: string, description: string, coverImage: string, contentHash: string, price: number, totalSupply: number) {
  const bookId = nextBookId++;
  books.push({ id: bookId, author, title, description, coverImage, contentHash, price, totalSupply, availableSupply: totalSupply });
  return { success: true, value: bookId };
}

function distributeRoyalties(bookId: number, amount: number) {
  const book = books.find(b => b.id === bookId);
  if (!book) {
    return { success: false, error: 'err-not-found' };
  }
  const feeAmount = Math.floor((amount * platformFee) / 1000);
  const authorAmount = amount - feeAmount;
  // In a real implementation, we would transfer STX here
  return { success: true, feeAmount, authorAmount };
}

function setPlatformFee(newFee: number) {
  if (newFee > 1000) {
    return { success: false, error: 'err-invalid-fee' };
  }
  platformFee = newFee;
  return { success: true };
}

// Tests
describe('Royalty Distribution Contract', () => {
  beforeEach(() => {
    books = [];
    nextBookId = 1;
    platformFee = 50;
  });
  
  it('distributes royalties correctly', () => {
    publishBook('author1', 'Test Book', 'A test book', 'cover.jpg', '0x1234', 1000000, 100);
    const result = distributeRoyalties(1, 1000000);
    expect(result.success).toBe(true);
    expect(result.feeAmount).toBe(50000); // 5% of 1000000
    expect(result.authorAmount).toBe(950000); // 95% of 1000000
  });
  
  it('allows setting platform fee', () => {
    const result = setPlatformFee(100); // 10%
    expect(result.success).toBe(true);
    expect(platformFee).toBe(100);
  });
  
  it('prevents setting invalid platform fee', () => {
    const result = setPlatformFee(1001); // Over 100%
    expect(result.success).toBe(false);
    expect(result.error).toBe('err-invalid-fee');
    expect(platformFee).toBe(50); // Unchanged
  });
});

