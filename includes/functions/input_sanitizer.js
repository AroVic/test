cleanInput = (inp = "no data") => {
  inp = inp
    .trim()
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

  return inp;
};

module.exports = cleanInput;
