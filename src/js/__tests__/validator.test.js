import { isValidInn, detectPaymentSystem, validateLuhn } from '../validators';

test('should return false for an empty value', () => {
    expect(isValidInn('')).toEqual({
        isValid: false,
        system: null,
        length: 0,
        isPotentiallyValid: false
    });
});

test('should return false for cards with non-numeric characters', () => {
    expect(isValidInn('4532-0151-1283-0366')).toEqual({
        isValid: false,
        system: null,
        length: 19,
        isPotentiallyValid: false
    });
});

test('should return true for a valid card number', () => {
    expect(validateLuhn('4960142984516724')).toBe(true); // VISA
    expect(validateLuhn('5555555555554444')).toBe(true); // MasterCard
    expect(validateLuhn('371449635398431')).toBe(true);  // AMEX
    expect(validateLuhn('6011111111111117')).toBe(true); // Discover
});

test('must determine the type of card', () => {
    expect(detectPaymentSystem('4532015112830366')).toBe('VISA');
    expect(detectPaymentSystem('5555555555554444')).toBe('MASTERCARD');
    expect(detectPaymentSystem('2204123456789012')).toBe('MIR');
    expect(detectPaymentSystem('340123456789012')).toBe('AMEX');
    expect(detectPaymentSystem('6011123456789012')).toBe('DISCOVER');
    expect(detectPaymentSystem('213112345678901')).toBe('JCB');
    expect(detectPaymentSystem('1234567890123456')).toBe(null);
    expect(detectPaymentSystem('4')).toBe(null);
});