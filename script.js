const morseSymbols = {
    "-":"&mdash;",
    ".":"&bull;"
};


const xmlhttp = new XMLHttpRequest();
const morseFile = "morse.json";

xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        // Letters to Morse: "a" returns ".-"
        const morseCode_LtoM = JSON.parse(this.responseText.toLowerCase());
        // Morse to Letters: ".-" returns "a"
        const morseCode_MtoL = {};
        // generates the Morse to letters Object
        for (const letter in morseCode_LtoM) {
            const code = morseCode_LtoM[letter];  
            morseCode_MtoL[code] = letter;
        }

        // Eventlistener for: Letters to Morse
        $("#translateLetters1,#checkSpecChars1,#letterSpacing1").click(function () {
            // translates each letter to morsecode unless the letter has no translation
            let translation = $("#inputLetters1").val().toLowerCase()
                    .split("");
            console.log(translation);
            console.log(morseCode_LtoM["\n"]);
            
            translation = translation
                    .map(e => morseCode_LtoM[e] || e)
                    .join(" ".repeat($("#letterSpacing1").val()));
            // checks if . and - should be translated into • and —
            if ($("#checkSpecChars1").is(':checked')){
                translation = translation.split("").map(e=>morseSymbols[e]||e).join(" ");
            }

            $("#outputLetters1").html(translation);
        }); //END E.L. Letters to Morse


        // Eventlistener Letters to Morse
        $("#translateMorse1").click(function () {
                let translation = $("#inputMorse1").val().toLowerCase();
                // translates morsecode into letters, ignores untranslatable letters (ex ignores .b.. while ... is translated to s)
                translation = translation.split("/")
                    .map(word => {
                        let letterList = word.trim()
                                .split(/\s+/g)
                                .map(l => morseCode_MtoL[l]||l);
                        return letterList.join("");
                    })
                    .join(" ");
                $("#outputMorse1").html(translation);
   
        });//END E.L. Morse to Letters


        // Generate <ul> list of all Mores code letters in the overlay
        const arrayOfListElements = Object.entries(morseCode_LtoM)
            .map(e=>{
                const L = e[1].split("").map(codeBit => morseSymbols[codeBit]||codeBit).join(" ");
                if (e[0]==" ") {
                    return `<li><span>\"${e[0]}\"</span><span>${L}</span></li>`;
                    
                }
                return `<li><span>${e[0]}</span><span>${L}</span></li>`;})
            .join("");
        const listMorse = `<ul>${arrayOfListElements}</ul>`;
        $("#allTranslations article").html(listMorse);

    } //END if loaded
};
xmlhttp.open("GET", morseFile, true);
xmlhttp.send();

// Using JQuery UI for more compact functionallity
$( function() {
    $( "#accordion" ).accordion({active:1});
  } );


// disables the submit function of the formulars handling morse 
function shutdownSubmit(e) {
    e.preventDefault();
  }
$(".nosubmit").submit(shutdownSubmit);

// Show all translations avalible
$(".toggleAllTranslations").click(function(){
    $("#overlay").fadeToggle("fast","swing");

}
);