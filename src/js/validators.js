// Полная валидация карты
export function isValidInn(cardNumber) {
  const cleanNumber = cardNumber ? cardNumber.replace(/\s+/g, '') : '';

  return {
    isValid: validateLuhn(cleanNumber),
    system: detectPaymentSystem(cleanNumber),
    length: cleanNumber.length,
    isPotentiallyValid: cleanNumber.length >= 13 && cleanNumber.length <= 19 && /^\d*$/.test(cleanNumber)
  };
}

// Шаблоны для определения платежных систем
export const CARD_TEMPLATES = {
  VISA: /^4[0-9]{12}(?:[0-9]{3})?$/,
  MASTERCARD: /^(5[1-5][0-9]{14}|2(2[2-9][0-9]{12}|[3-6][0-9]{13}|7[0-1][0-9]{12}|720[0-9]{12}))$/,
  MIR: /^220[0-4][0-9]{12}$/,
  AMEX: /^3[47][0-9]{13}$/,
  DISCOVER: /^6(?:011|5[0-9]{2})[0-9]{12}$/,
  JCB: /^(?:2131|1800|35[0-9]{3})[0-9]{11}$/
};

// Определение платежной системы по номеру карты
export function detectPaymentSystem(cardNumber) {
  if (!cardNumber) return null;

  const cleanNumber = cardNumber.replace(/\s+/g, '');

  for (const [system, pattern] of Object.entries(CARD_TEMPLATES)) {
    if (pattern.test(cleanNumber)) {
      return system;
    }
  }

  return null;
}

// Валидация номера по алгоритму Луна
export function validateLuhn(cardNumber) {
  if (!cardNumber) return false;

  const cleanNumber = cardNumber.replace(/\s+/g, '');

  if (!/^\d+$/.test(cleanNumber)) return false;

  let sum = 0;
  let isEven = false;

  for (let i = cleanNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cleanNumber[i], 10);

    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    isEven = !isEven;
  }

  return sum % 10 === 0;
}
