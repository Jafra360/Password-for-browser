const lengthInput = document.getElementById("length");
const lengthValue = document.getElementById("lengthValue");
const passwordField = document.getElementById("password");
const copyButton = document.getElementById("copy");
const generateButton = document.getElementById("generate");
const status = document.getElementById("status");

const options = {
  uppercase: document.getElementById("uppercase"),
  lowercase: document.getElementById("lowercase"),
  numbers: document.getElementById("numbers"),
  symbols: document.getElementById("symbols")
};

const pools = {
  uppercase: "ABCDEFGHJKLMNPQRSTUVWXYZ",
  lowercase: "abcdefghijkmnopqrstuvwxyz",
  numbers: "23456789",
  symbols: "!@#$%^&*()_+{}[]<>?"
};

const getRandomChar = (chars) => chars[Math.floor(Math.random() * chars.length)];

const buildPassword = () => {
  const enabled = Object.entries(options)
    .filter(([, checkbox]) => checkbox.checked)
    .map(([key]) => key);

  if (enabled.length === 0) {
    status.textContent = "Select at least one character set.";
    return "";
  }

  const length = Number(lengthInput.value);
  const required = enabled.map((key) => getRandomChar(pools[key]));
  const allChars = enabled.map((key) => pools[key]).join("");

  while (required.length < length) {
    required.push(getRandomChar(allChars));
  }

  for (let i = required.length - 1; i > 0; i -= 1) {
    const swapIndex = Math.floor(Math.random() * (i + 1));
    [required[i], required[swapIndex]] = [required[swapIndex], required[i]];
  }

  status.textContent = "";
  return required.join("");
};

const updateLength = () => {
  lengthValue.textContent = lengthInput.value;
};

const updatePassword = () => {
  passwordField.value = buildPassword();
};

lengthInput.addEventListener("input", () => {
  updateLength();
  updatePassword();
});

Object.values(options).forEach((checkbox) => {
  checkbox.addEventListener("change", updatePassword);
});

generateButton.addEventListener("click", updatePassword);

copyButton.addEventListener("click", async () => {
  if (!passwordField.value) {
    status.textContent = "Generate a password first.";
    return;
  }

  try {
    await navigator.clipboard.writeText(passwordField.value);
    status.textContent = "Password copied to clipboard.";
  } catch (error) {
    status.textContent = "Unable to copy. Please copy manually.";
  }
});

updateLength();
updatePassword();
