export const validatePersonalInfo = (form) => {
  if (!form.first || !form.last) return "First and Last name are required";
  return null;
};

export const validateAddressInfo = (form) => {
  if (!form.houseNumber || !form.street || !form.city || !form.pinCode || !form.state) {
    return "Please complete all address fields";
  }

  if (!/^\d{6}$/.test(form.pinCode)) {
    return "Pin code must be a 6-digit number";
  }

  return null;
};
