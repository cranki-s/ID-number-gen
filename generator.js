
// List of possilbe BKZ's
const bkzs = ["L337"];

// Dictionary giving each char a numerical value
const char_dict = { ["0"]: 0, ["1"]: 1, ["2"]: 2, ["3"]: 3, ["4"]: 4, ["5"]: 5, ["6"]: 6, ["7"]: 7, ["8"]: 8, ["9"]: 9, ["A"]: 10, ["B"]: 11, ["C"]: 12, ["D"]: 13, ["E"]: 14, ["F"]: 15, ["G"]: 16, ["H"]: 17, ["I"]: 18, ["J"]: 19, ["K"]: 20, ["L"]: 21, ["M"]: 22, ["N"]: 23, ["O"]: 24, ["P"]: 25, ["Q"]: 26, ["R"]: 27, ["S"]: 28, ["T"]: 29, ["U"]: 30, ["V"]: 31, ["W"]: 32, ["X"]: 33, ["Y"]: 34, ["Z"]: 35 };

// Definition of a year lol
const year = ( 365 /*days*/ * 24 /*hours*/ * 60 /*minutes*/ * 60 /*seconds*/ * 1000 /*ms*/ );

// All allowed chars in the randomly generated series
const allowed_chars = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "C", "F", "G", "H", "J", "K", "L", "M", "N", "P", "R", "T", "V", "W", "X", "Y", "Z"];

// Generates a random sting with the length `len` from the above specified allowed characters
function generate_random_string(len) 
{
    let str = "";
    for (let i = 0; i < len; i++)
        str += allowed_chars[Math.floor(Math.random() * allowed_chars.length)];
    return str;
}

// Retrieves a random valid BKZ number
function get_random_bkz() 
{
    return bkzs[Math.floor(Math.random() * bkzs.length)];
}

// This function gets the "checksum" of a given string by multiplying with the sequence { 7, 3, 1 }
function get_checksum(str)
{
    let ret = 0;
    for (let i = 0; i < str.length; i++)
        ret += char_dict[str[i]]*[7,3,1][i%3]%10;
    return ret%10;
}

// Converts a date from the following format: `DD.MM.JJJJ` to `JJMMDDC`
function format_date(date) 
{
    let splitted = date.split(".");
    let raw_date = (splitted[2].slice(2) + splitted[1] + splitted[0]);
    return raw_date + get_checksum(raw_date);
}

// Generates a serial
function generate_serial() 
{
    let raw_serial = get_random_bkz() + generate_random_string(5);
    return raw_serial + get_checksum(raw_serial);
}

// Generates a random Date between five and one year ago
function generate_creation_date() 
{
    let start = Date.now() - (5 /*years*/ * year);
    let offset = Math.floor(Math.random() * (4 /*years*/ * year));
    return start + offset;
}

// Converts a unix timestamp to a string date
function time_converter(timestamp) 
{
    let a = new Date(timestamp);
    let year = a.getFullYear();
    let month = a.getMonth() + 1;
    let date = a.getDate();
    let time = (date < 10 ? "0" + date : date) + "." + (month < 10 ? "0" + month : month) + "." + year;
    return time;
}

// Gets the zodiac sign of a given date
function get_zodiac(month, day)
{
	return ["Steinbock", "Wassermann", "Fische", "Widder", "Stier", "Zwillinge", "Krebs", "Löwe", "Jungfrau", "Waage", "Skorpion", "Schütze"][day <= [20,19,20,20,20,21,22,22,21,22,21,21][month - 1] ? month - 1 : month % 12]; 
}

// Generates the final product
// @param String rdate - a date of the following format DD.MM.YYYY
function generate_id(raw_birthdate) 
{
    if (!raw_birthdate.match(/^\d{2}[.]\d{2}[.]\d{4}$/)) // if we dont get an input thats valid we generate a birthdate between 18 and 21 years ago
        raw_birthdate = time_converter((Date.now() - 21 * year) + Math.floor(Math.random() * 3 * year));

    let zodiac = get_zodiac(parseInt(raw_birthdate.split(".")[1]), parseInt(raw_birthdate.split(".")[0]));

    let brith_date = format_date(raw_birthdate);
    let serial = generate_serial();
    let creation_unix = generate_creation_date();
    let creation_date = time_converter(creation_unix);
    let expiration_date = time_converter(creation_unix + (6 * year)); // underage ids last 6 years!
    let expiration_formatted = format_date(expiration_date);
    let checksum = get_checksum(serial + brith_date + expiration_formatted);

    return "\nGeboren am: " + raw_birthdate + "\nSternzeichen: " + zodiac + "\nBeantragt am: " + creation_date + "\nGültig bis: " + expiration_date + "\n" + "IDD<<" + serial + "<<<<<<<<<<<<<<<" + "\n" + brith_date + "<" + expiration_formatted + "D<<<<<<<<<<<<<" + checksum;
}

exports.generate_id = generate_id;
