MODELS_APP_TO_SALT_MAPPER = {
  "Zeekr4": {
    "XCLauncher": 49959,
    "GeelySettings": 49858,
    "GeelyHvac": 49757,
    "XCGallery": 49656,
    "EcarxBTPhone": 49555,
  }
}

function encryptTime(salt, offset = 0) { // d1f816da25dd7005
  // Salt processing
  console.log("salt", salt)

  let filteredSalt = salt.split(":").join("").toLowerCase();
  console.log("filteredSalt", filteredSalt)
  let newString = ""; // Initial 5 chars reversed // 18210
  let newString2 = ""; // Initial 5-10 chars reversed // 52706
  // Filter non-digit characters
  for (let indx = 0; indx < filteredSalt.length; indx++) {
    let c = filteredSalt.charAt(indx);

    if (!isNaN(c)) {
      if (indx < 5) {
        newString = c + newString;
      } else if (indx >= 5 && indx < 10) {
        newString2 = c + newString2;
      }
    } else {
      let charCode = c.charCodeAt(0);
      let charCodeString = charCode.toString();
      // Use CharCode last digit as alternative
      let lastDigit = parseInt(charCodeString.charAt(charCodeString.length - 1));

      if (indx < 5) {
        newString = lastDigit + newString;
      } else if (indx >= 5 && indx < 10) {
        newString2 = lastDigit + newString2;
      }
    }
  }

  // Time Encrypt

  const now = new Date();
  const hour = now.getUTCHours() - offset;
  const minute = now.getUTCMinutes();
  const roundedMinute = Math.floor(minute / 10) * 10;

  const unixTime = now.getTime();
  const MS_IN_ONE_DAY = 1000 * 60 * 60 * 24;
  const unixDayDigitsArray = Math.floor(unixTime / MS_IN_ONE_DAY).toString().split("");
  const unixDayLastDigit = Number(unixDayDigitsArray.pop())
  const unixDayLastDigit2 = Number(unixDayDigitsArray.pop())
  const unixDayLastDigit3 = Number(unixDayDigitsArray.pop())

  const encryptionNumbers = new Array(5);
  let firstDigit = unixDayLastDigit ^ Math.floor(hour / 10) ^ Math.floor(roundedMinute / 10);
  let secondDigit = unixDayLastDigit2 ^ (hour % 4) ^ (roundedMinute % 4);
  let thirdDigit = Math.floor(hour / 10) ^ (roundedMinute % 10);
  let fourthDigit = unixDayLastDigit3 ^ (hour % 10) ^ Math.floor(roundedMinute / 10);
  let fifthDigit = unixDayLastDigit3 ^ (hour % 5) ^ Math.floor(roundedMinute / 5);

  firstDigit = Math.floor(hour / 10) ^ Math.floor(firstDigit / 10);
  secondDigit = (hour % 4) ^ (secondDigit % 4);
  thirdDigit = Math.floor(hour / 10) ^ (thirdDigit % 10);
  fourthDigit = (hour % 10) ^ Math.floor(fourthDigit / 10);

  if (roundedMinute % 2 === 0) {
    if (firstDigit < 5) firstDigit += 3;
    if (secondDigit < 4) secondDigit += 5;
    if (thirdDigit < 4) thirdDigit += 7;
    if (fourthDigit < 5) fourthDigit += 9;
    if (fifthDigit < 5) fifthDigit += 1;
  } else {
    if (firstDigit < 4) firstDigit += 5;
    if (secondDigit < 5) secondDigit += 3;
    if (thirdDigit < 5) thirdDigit += 6;
    if (fourthDigit < 5) fourthDigit += 1;
    if (fifthDigit < 4) fifthDigit += 7;
  }

  encryptionNumbers[0] = firstDigit;
  encryptionNumbers[1] = secondDigit;
  encryptionNumbers[2] = thirdDigit;
  encryptionNumbers[3] = fourthDigit;
  encryptionNumbers[4] = fifthDigit;
  const timeEncrypt = +encryptionNumbers.join("");

  console.log("unixTime: 1691842717555", unixTime);
  console.log("hr: 12", hour);
  console.log("min: 18", minute);
  console.log("romi: 10", roundedMinute);
  console.log("udays: 19581", unixDayDigitsArray);
  console.log("uday: 1", unixDayLastDigit);
  console.log("uMiddle: 8", unixDayLastDigit2);
  console.log("uLast: 5", unixDayLastDigit3);
  console.log("macsalt: 8836a3cd2b298058", salt);
  console.log("newString: 76388", newString);
  console.log("newString2: 82093", newString2);
  console.log("numericResult: 82093", timeEncrypt);

  return timeEncrypt ^ +newString ^ +newString2;
}

module.exports = encryptTime
