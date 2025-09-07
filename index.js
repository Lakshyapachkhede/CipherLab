const messageBox = document.getElementById("message-box");
const cipherBox = document.getElementById("cipher-text-box");
const keyBox = document.getElementById("key-box");
const algorithmSelect = document.getElementById("algorithm-select");
const errorBox = document.getElementById("error-message");

const hamburger = document.querySelector(".hamburger");
const navLinks = document.querySelector(".nav-links");


const alphabets = "abcdefghijklmnopqrstuvwxyz";
const capitalAlphabets = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

const algorithms = {
    "1": { name: "ceaser", encrypt: ceaserEncrypt, decrypt: ceaserDecrypt },
    "2": { name: "monoalphabetic", encrypt: monoalphabeticEncrypt, decrypt: monoalphabeticDecrypt },
    "3": { name: "playfair", encrypt: playfairEncrypt, decrypt: playfairDecrypt },
    "4": { name: "polyalphabetic(Vigenère)", encrypt: polyalphabeticEncrypt, decrypt: polyalphabeticDecrypt },
    "5": { name: "rail fence" },
    "6": { name: "columnar" }
}





// ################################# UTILITY FUNCTIONS ########################################

function hideErrorBox() {
    errorBox.style.display = 'none';
}

function showErrorBox(message) {
    errorBox.textContent = message;
    errorBox.style.display = 'block';

}


function isLetter(str) {
    return /^[a-zA-Z]+$/.test(str);
}

function shiftChar(char, key) {
    let code = char.charCodeAt(0);

    // Uppercase A-Z
    if (code >= 65 && code <= 90) {
        return String.fromCharCode(((code - 65 + key) % 26 + 26) % 26 + 65);
    }

    // Lowercase a-z
    if (code >= 97 && code <= 122) {
        return String.fromCharCode(((code - 97 + key) % 26 + 26) % 26 + 97);
    }

    return char;
}



function isDigitsOnly(str) {
    return /^\d+$/.test(str);
}

function getKeyByValue(obj, value) {
    return Object.keys(obj).find(key => obj[key] === value);
}

// ################################# UTILITY FUNCTION ENDS ########################################



// ################################# CEASER CIPHER ########################################

function getCeaserKey() {
    let key = keyBox.value.replace(/\s+/g, "");

    if (!isDigitsOnly(key)) {
        showErrorBox("Enter numeric key");
        return NaN;

    }


    key = parseInt(key, 10);


    if (isNaN(key)) {
        showErrorBox("Enter a correct key");
        return NaN;
    }

    if (key < 1 || key > 25) {
        key = ((key % 26) + 26) % 26;
    }


    return key;
}



function ceaserEncrypt(message) {

    let encrypted = "";
    let key = getCeaserKey();

    if (isNaN(key)) {
        return "";
    }



    for (let char of message) {
        if (isLetter(char)) {
            encrypted += shiftChar(char, key);

        } else {
            encrypted += char;
        }
    }

    return encrypted;

}


function ceaserDecrypt(encrypted) {

    let message = "";

    let key = getCeaserKey();

    if (isNaN(key)) {
        return "";
    }


    for (let char of encrypted) {
        if (isLetter(char)) {
            message += shiftChar(char, -key);

        } else {
            message += char;
        }
    }

    return message;

}

// ################################# CEASER CIPHER ENDS ########################################

// ################################# MONOALPHABETIC CIPHER ########################################


function getMonoalphabeticCipherKey() {
    let key = keyBox.value.replace(/\s+/g, "");

    if (!isLetter(key)) {
        showErrorBox("Enter alphabetic key");
        return null;

    }

    if (key.length != 26) {
        showErrorBox("key should be of length 26");
        return null;
    }

    return key;
}


function monoalphabeticCreateMap(key) {
    const map = {};

    for (let i = 0; i < 26; i++) {

        map[alphabets[i]] = key[i].toLowerCase();
        map[alphabets[i].toUpperCase()] = key[i].toUpperCase();
    }

    return map;
}


function monoalphabeticEncrypt(message) {
    let encrypted = "";


    let key = getMonoalphabeticCipherKey();

    if (key == null) {
        return "";
    }

    const map = monoalphabeticCreateMap(key);

    for (let char of message) {
        if (isLetter(char)) {
            encrypted += map[char];

        } else {
            encrypted += char;
        }
    }

    return encrypted;
}



function monoalphabeticDecrypt(encrypted) {
    let message = "";


    let key = getMonoalphabeticCipherKey();

    if (key == null) {
        return "";
    }

    const map = monoalphabeticCreateMap(key);

    for (let char of encrypted) {
        if (isLetter(char)) {
            message += getKeyByValue(map, char);

        } else {
            message += char;
        }
    }

    return message;

}

// ################################# MONOALPHABETIC CIPHER ENDS ########################################




// ################################# POLYALPHABETIC CIPHER ########################################

function getPolyalphabeticCipherKey() {
    let key = keyBox.value.replace(/\s+/g, "");

    if (!isLetter(key)) {
        showErrorBox("Enter alphabetic key");
        return null;
    }

    return key;
}

function polyalphabeticEncrypt(message) {
    let encrypted = "";


    let key = getPolyalphabeticCipherKey();

    if (key == null) {
        return "";
    }

    let keyIndex = 0;


    for (let i = 0; i < message.length; i++) {

        if (isLetter(message[i])) {

            let messageChar = message[i];
            let keyChar = key[keyIndex];

            const base = messageChar === messageChar.toUpperCase() ? 65 : 97;
            const baseKey = keyChar === keyChar.toUpperCase() ? 65 : 97;

            let charCode = messageChar.charCodeAt(0) - base;
            let keyCode = keyChar.charCodeAt(0) - baseKey;

            encrypted += shiftChar(messageChar, keyCode);

        } else {
            encrypted += message[i];
        }




        keyIndex = (keyIndex + 1) % key.length;

    }

    return encrypted;

}

function polyalphabeticDecrypt(encrypted) {
    let message = "";


    let key = getPolyalphabeticCipherKey();

    if (key == null) {
        return "";
    }

    let keyIndex = 0;


    for (let i = 0; i < encrypted.length; i++) {
        if (isLetter(encrypted[i])) {
            let encryptedChar = encrypted[i];
            let keyChar = key[keyIndex];

            const base = encryptedChar === encryptedChar.toUpperCase() ? 65 : 97;
            const baseKey = keyChar === keyChar.toUpperCase() ? 65 : 97;

            let charCode = encryptedChar.charCodeAt(0) - base;
            let keyCode = keyChar.charCodeAt(0) - baseKey;

            message += shiftChar(encryptedChar, -keyCode);
        } else {
            message += encrypted[i];
        }
        keyIndex = (keyIndex + 1) % key.length;

    }

    return message;
}



// ################################# POLYALPHABETIC CIPHER ENDS ########################################


// ################################# PLAYFAIR CIPHER ########################################

function getPlayfairCipherKey() {
    return getPolyalphabeticCipherKey(); // same logic for both
}


function getPlayfairGrid(key) {
    const rows = 5;
    const cols = 5;
    const charGrid = Array.from({ length: rows }, () => Array(cols).fill(' '));

    const charSet = new Set();



    for (let char of key) {
        if(char == 'j'){
            continue;
        }
        if (!charSet.has(char)) {
            charSet.add(char)
        }
    }

    for(let char of alphabets){
        if(char == 'j'){
            continue;
        }
        if (!charSet.has(char)) {
            charSet.add(char)
        }
    }

    let index = 0;

    for(let char of charSet){
        let i = Math.floor(index / rows);
        let j = index % cols ;

        charGrid[i][j] = char;

        index++;

    }
    
    return charGrid;
}

function playfairEncrypt(message) {
    let encrypted = "";


    let key = getPlayfairCipherKey();

    if (key == null) {
        return "";
    }

    const charGrid = getPlayfairGrid(key);

    









}



function playfairDecrypt(encrypted) {

}







// ################################# PLAYFAIR CIPHER ENDS ########################################




// ################################# MAIN HANDLERS ########################################

function checkBeforeEncryptionOrDecryption() {
    if (algorithmSelect.value === '0') {
        showErrorBox("Please Select An Algorithm");
        return false;
    } else if (keyBox.value == '') {
        showErrorBox("Please Enter Key");
        return false;
    }
    hideErrorBox();
    return true;
}


messageBox.addEventListener("input", function (e) {
    if (checkBeforeEncryptionOrDecryption()) {
        cipherBox.value = algorithms[algorithmSelect.value].encrypt(e.target.value);
    }
});

cipherBox.addEventListener("input", function (e) {
    if (checkBeforeEncryptionOrDecryption()) {
        messageBox.value = algorithms[algorithmSelect.value].decrypt(e.target.value);
    }
});

keyBox.addEventListener("input", function (e) {
    if (checkBeforeEncryptionOrDecryption()) {

        if (messageBox.value != '') {
            cipherBox.value = algorithms[algorithmSelect.value].encrypt(messageBox.value);
        } else {
            messageBox.value = algorithms[algorithmSelect.value].decrypt(cipherBox.value);
        }


    }
});

algorithmSelect.addEventListener("change", function (e) {
    if (checkBeforeEncryptionOrDecryption()) {

        if (messageBox.value != '') {
            cipherBox.value = algorithms[algorithmSelect.value].encrypt(messageBox.value);
        } else {
            messageBox.value = algorithms[algorithmSelect.value].decrypt(cipherBox.value);
        }


    }
});

hamburger.addEventListener("click", (e) => {
    e.stopPropagation(); // Prevent the click from reaching document
    navLinks.classList.toggle("active");
});

// Close menu if click is outside menu or hamburger
document.addEventListener("click", (e) => {
    if (
        navLinks.classList.contains("active") &&
        !navLinks.contains(e.target) &&
        !hamburger.contains(e.target)
    ) {
        navLinks.classList.remove("active");
    }
});



// ################################# MAIN HANDLERS ENDS ########################################







