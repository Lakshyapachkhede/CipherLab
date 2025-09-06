const messageBox = document.getElementById("message-box");
const cipherBox = document.getElementById("cipher-text-box");
const keyBox = document.getElementById("key-box");
const algorithmSelect = document.getElementById("algorithm-select");
const errorBox = document.getElementById("error-message");

const hamburger = document.querySelector(".hamburger");
const navLinks = document.querySelector(".nav-links");


const alphabets = "abcdefghijklmnopqrstuvwxyz";

const algorithms = {
    "1": { name: "ceaser", encrypt: ceaserEncrypt, decrypt: ceaserDecrypt },
    "2": { name: "monoalphabetic", encrypt: monoalphabeticEncrypt, decrypt: monoalphabeticDecrypt },
    "3": { name: "playfair" },
    "4": { name: "polyalphabetic" },
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

function getCeaserKey(){
    let key = keyBox.value.replace(/\s+/g, "");

    if(!isDigitsOnly(key)){
        showErrorBox("Enter numeric key");
        return NaN;

    }


    key = parseInt(key, 10);


    if (isNaN(key)) {
        showErrorBox("Enter a correct key");
        return NaN;
    }

    if(key < 1 || key > 25){
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


function getMonoalphabeticCipherKey(){
    let key = keyBox.value.replace(/\s+/g, "");

    if(!isLetter(key)){
        showErrorBox("Enter alphabetic key");
        return null;

    }

    if(key.length != 26){
        showErrorBox("key should be of length 26");
        return null;
    }

    return key;
}


function monoalphabeticCreateMap(key){
    const map = {};

    for(let i = 0; i < 26; i++){
        map[alphabets[i]] = key[i];
        map[alphabets[i].toUpperCase()] = key[i].toUpperCase();
    }

    return map;
}


function monoalphabeticEncrypt(message){
    let encrypted = "";


    let key = getMonoalphabeticCipherKey();
    
    if(key == null){
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



function monoalphabeticDecrypt(encrypted){
    let message = "";


    let key = getMonoalphabeticCipherKey();
    
    if(key == null){
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







