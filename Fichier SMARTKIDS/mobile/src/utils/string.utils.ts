function maskStringExceptLastN(inputStr: string, n: number) {
    if (n >= inputStr.length) {
      return '*'.repeat(inputStr.length);
    } else {
      const maskedPart = '*'.repeat(inputStr.length - n);
      return maskedPart + inputStr.slice(-n);
    }
  }
  
  export const maskEmail = (email: string) => {
    const parts = email.split('@');
    return `${maskStringExceptLastN(parts[0], 2)}@${parts[1]}`;
  };
  