const messageBox = document.getElementById("message-box");
const cipherBox = document.getElementById("cipher-text-box");
const keyBox = document.getElementById("key-box");
const algorithmSelect = document.getElementById("algorithm-select");
const errorBox = document.getElementById("error-message");




const alphabets = "abcdefghijklmnopqrstuvwxyz";
const capitalAlphabets = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

const algorithms = {
    "1": { name: "ceaser", encrypt: ceaserEncrypt, decrypt: ceaserDecrypt },
    "2": { name: "monoalphabetic", encrypt: monoalphabeticEncrypt, decrypt: monoalphabeticDecrypt },
    "3": { name: "playfair", encrypt: playfairEncrypt, decrypt: playfairDecrypt },
    "4": { name: "polyalphabetic(Vigenère)", encrypt: polyalphabeticEncrypt, decrypt: polyalphabeticDecrypt },
    "5": { name: "rail fence", encrypt: railFenceEncrypt, decrypt: railFenceDecrypt },
    "6": { name: "columnar", encrypt: columnarEncrypt, decrypt: columnarDecrypt }
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

    key = key.toLowerCase();

    const rows = 5;
    const cols = 5;
    const charGrid = Array.from({ length: rows }, () => Array(cols).fill(' '));

    const charSet = new Set();



    for (let char of key) {
        if (char == 'j') {
            continue;
        }
        if (!charSet.has(char)) {
            charSet.add(char)
        }
    }

    for (let char of alphabets) {
        if (char == 'j') {
            continue;
        }
        if (!charSet.has(char)) {
            charSet.add(char)
        }
    }

    let index = 0;

    for (let char of charSet) {
        let i = Math.floor(index / rows);
        let j = index % cols;

        charGrid[i][j] = char;

        index++;

    }



    return charGrid;
}

function checkUpperCase(char) {
    return char == char.toUpperCase();
}

function getPlayfairDigraphs(message) {
    let digraphs = [];
    let addedFillers = [];
    let addFillerCount = 0;
    for (let i = 0; i < message.length; i += 2) {

        if (message[i] == message[i + 1]) {
            digraphs.push(message[i] + (checkUpperCase(message[i]) ? "X" : "x"));
            addedFillers.push(i + 1 + addFillerCount);
            addFillerCount++;
            i -= 1;
        }

        else if (i + 1 < message.length) {

            digraphs.push(message[i] + message[i + 1]);

        } else {
            digraphs.push(message[i] + (checkUpperCase(message[i]) ? "X" : "x"))
            addedFillers.push(i + 1 + addFillerCount);
            addFillerCount++;


        }


    }




    return [digraphs, addedFillers];

}

function search2dArray(array, key) {
    let i = 0;
    let j = 0;
    for (let row of array) {
        for (let col of row) {
            if (col == key) {
                return [i, j];
            }
            j += 1;
        }
        j = 0;
        i += 1;
    }

    return [-1, -1];
}


function extractLetters(message) {
    let letters = "";
    let nonLetters = [];

    for (let i = 0; i < message.length; i++) {
        let char = message[i];

        if (isLetter(char)) {

            if (char == 'j' || char == 'J') {
                if (checkUpperCase(char)) {
                    letters += 'I'
                } else {
                    letters += 'i';
                }
            } else {

                letters += char;
            }


        } else {
            nonLetters.push({ index: i, char: char })
        }
    }



    return [letters, nonLetters];
}



function addNonLetters(encrypted, nonLetters) {
    let result = encrypted.split("");

    for (let item of nonLetters) {
        result.splice(item.index, 0, item.char);
    }

    return result.join("");
}


function shiftNonLetterIndices(nonLetters, fillerPositions) {
    fillerPositions.sort((a, b) => a - b); // ensure in order
    for (let fillerPos of fillerPositions) {
        for (let item of nonLetters) {
            if (item.index > fillerPos) {
                item.index += 1;
            }
        }
    }

}



function playfairEncrypt(message) {
    let encrypted = "";


    let key = getPlayfairCipherKey();


    if (key == null) {
        return "";
    }

    const [letters, nonLetters] = extractLetters(message);

    const charGrid = getPlayfairGrid(key);

    const [digraphs, addedFillers] = getPlayfairDigraphs(letters);



    for (let digraph of digraphs) {

        let [i1, j1] = search2dArray(charGrid, digraph[0].toLowerCase());
        let [i2, j2] = search2dArray(charGrid, digraph[1].toLowerCase());

        let d0isUpper = checkUpperCase(digraph[0]);
        let d1isUpper = checkUpperCase(digraph[1]);



        if (j1 == j2) {

            encrypted += (d0isUpper ? charGrid[(i1 + 1) % 5][j1].toUpperCase() : charGrid[(i1 + 1) % 5][j1]);

            encrypted += (d1isUpper ? charGrid[(i2 + 1) % 5][j2].toUpperCase() : charGrid[(i2 + 1) % 5][j2]);

        } else if (i1 == i2) {

            encrypted += (d0isUpper ? charGrid[i1][(j1 + 1) % 5].toUpperCase() : charGrid[i1][(j1 + 1) % 5]);

            encrypted += (d1isUpper ? charGrid[i2][(j2 + 1) % 5].toUpperCase() : charGrid[i2][(j2 + 1) % 5]);


        } else {

            encrypted += (d0isUpper ? charGrid[i1][j2].toUpperCase() : charGrid[i1][j2]);

            encrypted += (d1isUpper ? charGrid[i2][j1].toUpperCase() : charGrid[i2][j1]);

        }

    }

    // TODO: add non letters
    // shiftNonLetterIndices(nonLetters, addedFillers);
    // return addNonLetters(encrypted, nonLetters);

    return encrypted;

}

// for positive mod ex: -1%5 = 4
function mod(n, m) {
    return ((n % m) + m) % m;
}

function playfairDecrypt(encrypted) {
    let message = "";


    let key = getPlayfairCipherKey();


    if (key == null) {
        return "";
    }

    const [letters, nonLetters] = extractLetters(encrypted);

    const charGrid = getPlayfairGrid(key);

    const [digraphs, addedFillers] = getPlayfairDigraphs(letters);



    for (let digraph of digraphs) {

        let [i1, j1] = search2dArray(charGrid, digraph[0].toLowerCase());
        let [i2, j2] = search2dArray(charGrid, digraph[1].toLowerCase());

        let d0isUpper = checkUpperCase(digraph[0]);
        let d1isUpper = checkUpperCase(digraph[1]);



        if (j1 == j2) {

            message += (d0isUpper ? charGrid[mod(i1 - 1, 5)][j1].toUpperCase() : charGrid[mod(i1 - 1, 5) % 5][j1]);

            message += (d1isUpper ? charGrid[mod(i2 - 1, 5)][j2].toUpperCase() : charGrid[mod(i2 - 1, 5) % 5][j2]);

        } else if (i1 == i2) {

            message += (d0isUpper ? charGrid[i1][mod(j1 - 1, 5)].toUpperCase() : charGrid[i1][mod(j1 - 1, 5)]);

            message += (d1isUpper ? charGrid[i2][mod(j2 - 1, 5)].toUpperCase() : charGrid[i2][mod(j2 - 1, 5)]);


        } else {

            message += (d0isUpper ? charGrid[i1][j2].toUpperCase() : charGrid[i1][j2]);

            message += (d1isUpper ? charGrid[i2][j1].toUpperCase() : charGrid[i2][j1]);

        }

    }


    // TODO: add non letters
    // shiftNonLetterIndices(nonLetters, addedFillers);
    // return addNonLetters(message, nonLetters);

    return message;
}



// ################################# PLAYFAIR CIPHER ENDS ########################################


// ################################# RAILFENCE CIPHER  ########################################

function getRailFenceKey() {
    return getCeaserKey();
}

function railFenceEncrypt(message) {
    let key = getRailFenceKey();

    if (isNaN(key)) {
        return "";
    }

    if (key == 1) {
        return message;
    }

    let rails = Array.from({ length: key }, () => '');

    let row = 0;
    let direction = 1;
    for (let char of message) {
        rails[row] += char;
        row += direction;

        if (row == 0 || row == key - 1) {
            direction *= -1;
        }


    }
    return rails.join("");
}


function railFenceDecrypt(encrypted) {
    let message = "";
    let key = getRailFenceKey();

    if (isNaN(key)) {
        return "";
    }

    if (key == 1) {
        return encrypted;
    }

    const n = encrypted.length;



    let matrix = Array.from({ length: key }, () => Array(n).fill(""));

    let row = 0;
    let direction = 1;


    // mark positions with *
    for (let col = 0; col < n; col++) {

        matrix[row][col] = "*";
        row += direction;

        if (row == 0 || row == key - 1) {
            direction *= -1;
        }

    }

    // fill marked positions
    let index = 0;
    for (let r = 0; r < key; r++) {
        for (let c = 0; c < n; c++) {
            if (matrix[r][c] == '*' && index < n) {
                matrix[r][c] = encrypted[index];
                index++;
            }
        }
    }


    // read matrix in zig zag way
    row = 0;
    direction = 1;
    for (let col = 0; col < n; col++) {
        message += matrix[row][col];
        row += direction;

        if (row == 0 || row == key - 1) {
            direction *= -1;
        }

    }

    return message;
}

// ################################# RAILFENCE CIPHER ENDS #######################################


// ################################# COLUMNAR CIPHER #############################################
function getColumnarKey() {
    return getPolyalphabeticCipherKey();
}




function columnarEncrypt(message) {
    let encrypted = "";

    let key = getColumnarKey();

    if (key == null) {
        return "";
    }

    key = key.toLowerCase();

    const n = key.length;

    let matrix = Array.from({ length: Math.ceil(message.length / n) }, () => Array(n).fill(""));

    let row = 0;
    let col = 0;
    for (let char of message) {
        matrix[row][col] = char;

        col = (col + 1) % n;
        if (col == 0) {
            row++;
        }

    }

    let key_list = Array.from(key).sort();
    let key_index = 0;

    for (let _ = 0; _ < n; _++) {
        let curr_index = key.indexOf(key_list[key_index]);

        for (const row of matrix) {
            encrypted += row[curr_index];
        }
        key_index++;

    }

    return encrypted;
}
function columnarDecrypt(encrypted) {
    let message = "";

    let key = getColumnarKey();

    if (key == null) {
        return "";
    }

    key = key.toLowerCase();

    const n = key.length;
    const numRows = Math.ceil(encrypted.length / n);

    // Initialize empty matrix
    let matrix = Array.from({ length: numRows }, () => Array(n).fill(""));

    // Sort the key and keep track of the original column order
    let key_list = Array.from(key).sort();
    let colOrder = key_list.map(k => key.indexOf(k));

    // Handle repeated characters by ensuring unique column assignment
    let used = Array(n).fill(false);
    colOrder = key_list.map(k => {
        for (let i = 0; i < n; i++) {
            if (key[i] === k && !used[i]) {
                used[i] = true;
                return i;
            }
        }
    });

    // Fill the matrix column-wise based on the sorted key
    let index = 0;
    for (let k = 0; k < n; k++) {
        let col = colOrder[k];
        for (let row = 0; row < numRows; row++) {
            if (index < encrypted.length) {
                matrix[row][col] = encrypted[index++];
            }
        }
    }

    // Read the matrix row-wise to get the original message
    for (let row = 0; row < numRows; row++) {
        for (let col = 0; col < n; col++) {
            message += matrix[row][col];
        }
    }

    return message.trim(); // Remove any padding if necessary
}


// ################################# COLUMNAR CIPHER ENDS ########################################




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
        } else if (cipherBox.value != '') {
            messageBox.value = algorithms[algorithmSelect.value].decrypt(cipherBox.value);
        }


    }
});

algorithmSelect.addEventListener("change", function (e) {
    let placeholderText = "ex: ";
    switch (algorithmSelect.value) {
        case "1":
        case "5":
            placeholderText += "3";
            break;
        case "2":
            placeholderText += "zyxwvutsrqponmlkjihgfedcba";
            break;
        case "6":
            placeholderText += "HACK";
            break;
        case "4":
        case "3":
            placeholderText += "MONARCHY";
            break;

    }
    keyBox.placeholder = placeholderText;

    if (checkBeforeEncryptionOrDecryption()) {

        if (messageBox.value != '') {
            cipherBox.value = algorithms[algorithmSelect.value].encrypt(messageBox.value);
        } else if (cipherBox.value != '') {
            messageBox.value = algorithms[algorithmSelect.value].decrypt(cipherBox.value);
        }


    }
});


// ################################# MAIN HANDLERS ENDS ########################################







