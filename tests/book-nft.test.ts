import { describe, it, expect, beforeEach } from 'vitest';

// Mock contract state
let books: any[] = [];
let nextBookId = 1;

// Mock contract functions
function publishBook(author: string, title: string, description: string, coverImage: string, contentHash: string, price: number, totalSupply: number) {
  const bookId = nextBookId++;
  books.push({ id: bookId, author, title, description, coverImage, contentHash, price, totalSupply, availableSupply: totalSupply });
  return { success: true, value: bookId };
}

function purchaseBook(buyer: string, bookId: number) {
  const book = books.find(b => b.id === bookId);
  if (!book || book.availableSupply === 0) {
    return { success: false, error: 'err-out-of-stock' };
  }
  book.availableSupply--;
  return { success: true };
}

function getBook(bookId: number) {
  const book = books.find(b => b.id === bookId);
  return book ? { success: true, value: book } : { success: false, error: 'err-not-found' };
}

// Tests
describe('Book NFT Contract', () => {
  beforeEach(() => {
    books = [];
    nextBookId = 1;
  });
  
  it('allows publishing and purchasing books', () => {
    const publishResult = publishBook('author1', 'Test Book', 'A test book', 'cover.jpg', '0x1234', 1000000, 100);
    expect(publishResult.success).toBe(true);
    expect(publishResult.value).toBe(1);
    
    const purchaseResult = purchaseBook('reader1', 1);
    expect(purchaseResult.success).toBe(true);
    
    const bookDetails = getBook(1);
    expect(bookDetails.success).toBe(true);
    expect(bookDetails.value?.availableSupply).toBe(99);
  });
  
  it('prevents purchasing when out of stock', () => {
    publishBook('author1', 'Test Book', 'A test book', 'cover.jpg', '0x1234', 1000000, 1);
    purchaseBook('reader1', 1);
    const result = purchaseBook('reader2', 1);
    expect(result.success).toBe(false);
    expect(result.error).toBe('err-out-of-stock');
  });
});

