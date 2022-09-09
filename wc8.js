function stripNullChars (str) {
  return str.replace(/\0.*|\u0000|￿/g, '');
}

function pad(input, number) {
  var nines = "";
  var zeros = "";
  var i;
  for (i = 0; i < number; i++) {
    nines += "9";
    zeros += "0";
  }
  if (input <= nines) {
    input = (zeros + input).slice(-number); 
  }
  return input;
}

function parseWC8Data (buf, options) {

  const data = {}; 

  document.getElementById("wondercardbox").style.display = "block";
  document.getElementById("anotherbox").style.display = "block";
  document.getElementById("outputbox").style.display = "block";

  document.getElementById("filecheckbox").style.display = "block";
  
  var wcexclusive = document.getElementsByClassName("relearn");
    for (var i=0;i<wcexclusive.length;i+=1){
      wcexclusive[i].style.display = 'inline-block';
    }

  data.fileName = document.getElementById('input').value.replace("C:\\fakepath\\", "");
    document.getElementById("filename").innerHTML = data.fileName;
    if (!document.getElementById('filetoggle').checked) {
      document.getElementById("filename").style.display = "none";
    } 
    document.getElementById('filetoggle').onchange = function thing() {
      if (!document.getElementById('filetoggle').checked) {
        document.getElementById("filename").style.display = "none";
      } 
      else {
        document.getElementById("filename").style.display = "block";
      }
    };
  
    data.wcType = wcType();
    function wcType() {
        return "wc8"
    }
    
    data.wcId = buf.readUInt16LE(0x08);
    data.wcTitle = "";
    
    document.getElementById("wcTitle").innerHTML = data.wcTitle;
    data.dateReceived = 0;
    document.getElementById("cardText").innerHTML = data.cardText;
     

    data.cardType = ['None', 'Pokemon', 'Item', 'BP', 'Clothing'][buf.readUInt8(0x11)];
  data.giftType = giftType();
  function giftType() {
    if (buf.readUInt8(0x11) >= "0x07") {
      return "Unknown"; // futureproofing
  }
 }
  data.giftRedeemable = ['May be infinite', 'Only once', 'May be infinite', 'Only once', 'Once per day', '???', 'Once per day'][buf.readUInt8(0x10)];
    document.getElementById("giftRedeemable").innerHTML = data.giftRedeemable;
    if (data.giftRedeemable === 'May be infinite') {
      document.getElementById("giftRedeemable").style.color = "#009688";
      document.getElementById("giftRedeemable").style.fontWeight = "bold";
    }
    else if (data.giftRedeemable === 'Once per day') {
      document.getElementById("giftRedeemable").style.color = "#673AB7";
      document.getElementById("giftRedeemable").style.fontWeight = "bold";
    }
    else {
      document.getElementById("giftRedeemable").style.color = "#000";
      document.getElementById("giftRedeemable").style.fontWeight = "normal";
    }
  data.giftStatus = "Unused";
  data.cardColorId = 0;  
  data.cardColor = cardColor();
  function cardColor() {
        return 'Blue';
   }
 

  document.querySelector("header").style.background = wcBackground();
    function wcBackground() {
      if (data.wcType == "wc8") {
        if (data.cardColorId == 0) {
          return "#34BAC4"; // blue
        }
        else if (data.cardColorId == 1) {
          return "#7F49BB"; // purple
        }
        else if (data.cardColorId == 2) {
          return "#f6fa29"; // yellow
        }
        else
          return "#222"; // futureproofing
      }     
    }
    
    if (data.cardColorId == 2) {
      document.getElementById("filename").style.color = "#000";
    }
    else {
      document.getElementById("filename").style.color = "#fff";
    }
  
  //if (data.cardType == 'Pokemon') {
    
   document.getElementById("pokemonbox").style.display = "block";
    document.getElementById("itembox").style.display = "none";

    // S-TID
    data.idNo = idNo();
    function idNo() {
      if (buf.readUInt32LE(0x20) == 0) {
        return "Yours";
      }
     
      else 
        return pad(buf.readUInt32LE(0x20).toString().slice(-6),6)
    }
    document.getElementById("idNo").innerHTML = data.idNo;
  
    data.fullId = buf.readUInt32LE(0x20);
    data.tid = buf.readUInt16LE(0x20)
       
    data.sid = buf.readUInt16LE(0x22);
    data.originGameId = buf.readUInt16LE(0x24);
    //data.encryptionConstant = 0;
    data.encryptionConstant = ((buf.readUInt32LE(0x24)).toString(16));
    //function ecSet() {
    //  if (!buf.readUInt32LE(0x24) == "0x00000000") {
    //    return ( ((buf.readUInt32LE(0x24)).toString(16)));
    //  }
    //}

    data.Ribbon = "Classic Ribbon"; //Will fix this
  //  data.Ribbon = ribbonInfo();
  //    document.getElementById("Ribbon").innerHTML = data.Ribbon;
  //    function ribbonInfo() {
  //      if ((buf.readUInt8(0x74) == 0) && (buf.readUInt8(0x75) == 0)) {
  //        return "None";
  //      }
  //      else if (!buf.readUInt8(0x74) == 0) {
  //        return ribbonName67A[buf.readUInt8(0x74)];
  //      }
  //      else
  //        return ribbonName67B[buf.readUInt8(0x75)];
  //    }
     document.getElementById("Ribbon").innerHTML = data.Ribbon;   
  //  document.getElementById("pkmnRibbon").className = "ribbon67-" + ribbonAB() + ribbonType();
  //    function ribbonAB() {
  //      if (!buf.readUInt8(0x74) == 0) {
  //        return "a"
  //      }
  //      else
  //        return "b"
  //    }
  //    function ribbonType() {
  //      if (ribbonAB() == "a") {
  //        return buf.readUInt8(0x74);
  //      }
  //      else
  //        return buf.readUInt8(0x75)
  //    }
  //    if ((buf.readUInt8(0x74) == 0) && (buf.readUInt8(0x75) == 0)) {
  //      document.getElementById("pkmnRibbon").className = "";
  //    }
    
  data.ball = ballName[buf.readUInt8(0x22C)];  
      document.getElementById("ball").innerHTML = data.ball;
    document.getElementById("pkmnBall").className = "spr-ball-" + buf.readUInt8(0x22C);
  //  data.heldItem = itemName[buf.readUInt16LE(0x78)];
  //    document.getElementById("heldItem").innerHTML = data.heldItem;
  //    document.getElementById("pkmnItem").className = itemCheck();
  //    function itemCheck() {
  //      if (buf.readUInt16LE(0x78) == 0) {
  //          return "";
  //        }
  //        else
  //          return "spr-item-" + buf.readUInt16LE(0x78);
  //      }
  //  data.move1Name = moveName[buf.readUInt16LE(0x7A)];
  //    document.getElementById("move1Name").innerHTML = data.move1Name;
  //  data.move2Name = moveName[buf.readUInt16LE(0x7C)];  
  //    document.getElementById("move2Name").innerHTML = data.move2Name;
  //  data.move3Name = moveName[buf.readUInt16LE(0x7E)];
  //    document.getElementById("move3Name").innerHTML = data.move3Name;
  //  data.move4Name = moveName[buf.readUInt16LE(0x80)];  
  //    document.getElementById("move4Name").innerHTML = data.move4Name;
    data.dexNo = buf.readUInt16LE(0x240);
    data.pokemonName = pokemonName[buf.readUInt16LE(0x240)];
  //    document.getElementById("pokemonName").innerHTML = data.pokemonName;
  //  data.formId = buf.readUInt8(0x84);
  //  data.formName = hasForm();
  //    function hasForm() {
  //      if (!buf.readUInt8(0x84) == 0) {
  //        return formes[buf.readUInt16LE(0x82)][buf.readUInt8(0x84)];
  //      }
  //      else 
  //        return "None";
  //    }
  //    document.getElementById("formName").innerHTML = data.formName;
  //  data.language = ['Yours', 'JPN', 'ENG', 'FRE', 'ITA', 'GER', '???', 'SPA', 'KOR', 'CHS', 'CHT'][buf.readUInt8(0x85)]; 
  //  document.getElementById("language").innerHTML = data.language;
  //  data.nickname = nicknameName();
  //  function nicknameName() {
  //    if (!buf.readUInt8(0x86) == "0x00") {
  //      return stripNullChars(buf.toString('utf16le', 0x86, 0x9F));
  //    }
  //    else 
  //      return "None";
  //  }
  //  document.getElementById("nickname").innerHTML = data.nickname;
  //  data.nature = natureType();
  //  function natureType() {
  //    if (buf.readUInt8(0xA0) == "0xFF") {
  //      return "Random";
  //    }
  //    else
  //      return "";
  //  }
  //  document.getElementById("nature").innerHTML = data.nature;
  //  data.natureLock = natureLock();
  //  function natureLock() {
  //    if (buf.readUInt8(0xA0) < "0xFF") {
  //      return natureName[buf.readUInt8(0xA0)];
  //    }
  //    else
  //      return "";
  //  }
  //  document.getElementById("natureLock").innerHTML = data.natureLock;
  //  data.gender = ['♂', '♀', 'Genderless', 'Random'][buf.readUInt8(0xA1)]; 
  //    document.getElementById("gender").innerHTML = data.gender;
  //    function genderColor() {
  //      if (data.gender == "♂") {
  //        return "blue";
  //      }
  //      if (data.gender == "♀") {
  //        return "red";
  //      }
  //      else
  //        return "#000";
  //    }    
  //    document.getElementById("gender").style.color = genderColor();
  //  data.abilityType = ['Fixed ability 1', 'Fixed ability 2', 'Fixed HA', 'Random (no HA)', 'Random (including HA)'][buf.readUInt8(0xA2)]; 
  //    document.getElementById("abilityType").innerHTML = data.abilityType;
  //  data.pidId = buf.readUInt8(0xA3); 
  //  data.canBeShiny = ['(Set PID)', 'Can be shiny', 'Yes', 'Never'][buf.readUInt8(0xA3)]; 
  //    document.getElementById("canBeShiny").innerHTML = data.canBeShiny;
  //    if (data.canBeShiny === 'Can be shiny') {
  //      document.getElementById("canBeShiny").style.color = "#D0AF00";
  //      document.getElementById("canBeShiny").style.fontWeight = "bold";
  //    }
  //    else {
  //      document.getElementById("canBeShiny").style.color = "#000";
  //      document.getElementById("canBeShiny").style.fontWeight = "normal";
  //    }
  //  data.eggLocation = eggLocation();
  //  function eggLocation() {
  //    if (data.wcType == "wc7") {
  //      return locationName7[buf.readUInt16LE(0xA4)]; 
  //    }
  //    else
  //      return locationName6[buf.readUInt16LE(0xA4)]
  //  }
  //    document.getElementById("eggLocation").innerHTML = data.eggLocation;
  //  data.metLocation = metLocation(); 
  //  function metLocation() {
  //    if (data.wcType == "wc7") {
  //      return locationName7[buf.readUInt16LE(0xA6)]; 
  //    }
  //    else
  //      return locationName6[buf.readUInt16LE(0xA6)]
  //  }
  //    document.getElementById("metLocation").innerHTML = data.metLocation;
  //  data.metLevel = buf.readUInt8(0xA8);
  //  data.contestStatCool = buf.readUInt8(0xA9);
  //  data.contestStatBeauty = buf.readUInt8(0xAA);
  //  data.contestStatCute = buf.readUInt8(0xAB);
  //  data.contestStatSmart = buf.readUInt8(0xAC);
  //  data.contestStatTough = buf.readUInt8(0xAD);
  //  data.contestStatSheen = buf.readUInt8(0xAE);
  //  data.ivType = ivType();  
  //  function ivType() {
  //    if (buf.readUInt32LE(0xAF) == "0xFFFFFFFF") {
  //      return "No guaranteed IVs of 31";
  //      }
  //    else if (buf.readUInt8(0xAF) == "0xFE") {
  //      return "3 random guaranteed IVs of 31";
  //      }
  //    else if (buf.readUInt8(0xAF) == "0xFD") {
  //      return "2 random guaranteed IVs of 31";
  //      }
  //    else if ((buf.readUInt8(0xAF) > "0xF0") && (buf.readUInt8(0xAF) <= "0xFC")) { 
  //      return "Unknown"; // futureproofing
  //    }  
  //    else
  //      return "Has fixed IVs";
  //  }  
  //    data.ivHp = ivHp();
  //    function ivHp() {
  //      if (buf.readUInt8(0xAF) > "0xF0") {
  //        return "Unset";
  //        }
  //      else
  //        return (buf.readUInt8(0xAF));
  //    }    
  //    data.ivAtk = ivAtk();
  //    function ivAtk() {
  //      if (buf.readUInt8(0xB0) == "0xFF") {
  //        return "Unset";
  //        }
  //      else
  //        return (buf.readUInt8(0xB0));
  //    }  
  //    data.ivDef = ivDef();
  //    function ivDef() {
  //      if (buf.readUInt8(0xB1) == "0xFF") {
  //        return "Unset";
  //        }
  //      else
  //        return (buf.readUInt8(0xB1));
  //    }
  //    data.ivSpe = ivSpe();
  //    function ivSpe() {
  //      if (buf.readUInt8(0xB2) == "0xFF") {
  //        return "Unset";
  //        }
  //      else
  //        return (buf.readUInt8(0xB2));
  //    }
  //    data.ivSpAtk = ivSpAtk();
  //    function ivSpAtk() {
  //      if (buf.readUInt8(0xB3) == "0xFF") {
  //        return "Unset";
  //        }
  //      else
  //        return (buf.readUInt8(0xB3));
  //    }
  //    data.ivSpDef = ivSpDef();
  //    function ivSpDef() {
  //      if (buf.readUInt8(0xB4) == "0xFF") {
  //        return "Unset";
  //        }
  //      else
  //        return (buf.readUInt8(0xB4));
  //    }
  //  document.getElementById("ivInfo").innerHTML = ivInfo();
  //    function ivInfo() {
  //      if (data.ivType == "Has fixed IVs") {
  //        return (ivHpReadable() + "/" + ivAtkReadable()  + "/" + ivDefReadable()  + "/" + ivSpAtkReadable() + "/" + ivSpDefReadable() + "/" + ivSpeReadable())
  //      }
  //      else 
  //        return ivType()
  //    }
      
  //      function ivHpReadable() {
  //        if (data.ivHp == "Unset"){
  //          return "x";
  //        }
  //        else
  //          return data.ivHp
  //      }
  //      function ivAtkReadable() {
  //        if (data.ivAtk == "Unset"){
  //          return "x";
  //        }
  //        else
  //          return data.ivAtk
  //      }
  //      function ivDefReadable() {
  //        if (data.ivDef == "Unset"){
  //          return "x";
  //        }
  //        else
  //          return data.ivDef
  //      }
  //      function ivSpAtkReadable() {
  //        if (data.ivSpAtk == "Unset"){
  //          return "x";
  //        }
  //        else
  //          return data.ivSpAtk
  //      }
  //      function ivSpDefReadable() {
  //        if (data.ivSpDef == "Unset"){
  //          return "x";
  //        }
  //        else
  //          return data.ivSpDef
  //      }
  //      function ivSpeReadable() {
  //        if (data.ivSpe == "Unset"){
  //          return "x";
  //        }
  //        else
  //          return data.ivSpe
  //      }
    
  //  data.otGender = ['♂', '♀', '???', 'Yours'][buf.readUInt8(0xB5)];
  //    function otgColor() {
  //      if (data.otGender == "♂") {
  //        return "blue";
  //      }
  //      if (data.otGender == "♀") {
  //        return "red";
  //      }
  //      else
  //        return "#000";
  //    }      
  //  data.ot = otName();
  //    function otName() {
  //      if ((buf.readUInt8(0xB6)) == 0) {
  //        return "Yours";
  //      }
  //      else return stripNullChars(buf.toString('utf16le', 0xB6, 0xCF))
  //    }
  //  document.getElementById("ot").innerHTML = data.ot;
  //  document.getElementById("ot").style.color = otgColor();
  //  data.Level = buf.readUInt8(0xD0);
  //    function metLevelCheck() {
  //      if (data.Level !== data.metLevel) {
  //        return " (met at level " + data.metLevel + ")";
  //      }
  //      else return ""
  //    }
  //    document.getElementById("Level").innerHTML = data.Level + metLevelCheck();
  //  data.isEgg = ['Not egg', 'Is egg'][buf.readUInt8(0xD1)]; 
	 // data.additionalItem = itemName[buf.readUInt16LE(0xD2)];
  //    document.getElementById("additionalItem").innerHTML = data.additionalItem;
  //    document.getElementById("pkmnExtraItem").className = extraItemCheck();
  //    function extraItemCheck() {
  //      if (buf.readUInt16LE(0xD2) == 0) {
  //          return "";
  //        }
  //        else
  //          return "spr-item-" + buf.readUInt16LE(0xD2);
  //      }
  //  data.pid = pidSet();
  //  function pidSet() {
  //    if (buf.readUInt8(0xA3) == "0x00") {
  //      return ( ((buf.readUInt32LE(0xD4)).toString(16)));
  //    }
  //  }
  //  data.eggMove1Name = moveName[buf.readUInt16LE(0xD8)];
  //  data.eggMove2Name = moveName[buf.readUInt16LE(0xDA)];
  //  data.eggMove3Name = moveName[buf.readUInt16LE(0xDC)];
  //  data.eggMove4Name = moveName[buf.readUInt16LE(0xDE)]; 
  //  data.otMemoryIntensity = buf.readUInt8(0xE0);
  //  data.otMemoryLine = buf.readUInt8(0xE1);
  //  data.otMemoryTextVar = buf.readUInt16LE(0xE2);
  //  data.otMemoryFeeling = buf.readUInt8(0xE4);
  //  data.evHp = buf.readUInt8(0xE5);
  //  data.evAtk = buf.readUInt8(0xE6);
  //  data.evDef = buf.readUInt8(0xE7);
  //  data.evSpe = buf.readUInt8(0xE8);
  //  data.evSpAtk = buf.readUInt8(0xE9);
  //  data.evSpDef = buf.readUInt8(0xEA);
    
  //    document.getElementById("evInfo").innerHTML = evInfo();
  //    function evInfo() {
  //      if ((data.evHp == 0) && (data.evAtk == 0) && (data.evDef == 0) && (data.evSpAtk == 0) && (data.evSpDef == 0) && (data.evSpe == 0)) {
  //        return "None";
  //      }
  //      else
  //        return (data.evHp + "/" + data.evAtk  + "/" + data.evDef  + "/" + data.evSpAtk + "/" + data.evSpDef + "/" + data.evSpe)
  //    }
    
  //    document.getElementById("relearn1").innerHTML = checkRelearnable1();
  //      function checkRelearnable1() {
  //        if (((data.move1Name == data.eggMove1Name) || (data.move1Name == data.eggMove2Name) || (data.move1Name == data.eggMove3Name) || (data.move1Name == data.eggMove4Name)) && (data.move1Name != "")) {
  //          return "(relearnable)";
  //        }
  //        else return "";
  //      }
  //    document.getElementById("relearn2").innerHTML = checkRelearnable2();
  //      function checkRelearnable2() {
  //        if (((data.move2Name == data.eggMove1Name) || (data.move2Name == data.eggMove2Name) || (data.move2Name == data.eggMove3Name) || (data.move2Name == data.eggMove4Name)) && (data.move2Name != "")) {
  //          return "(relearnable)";
  //        }
  //        else return "";
  //      }
  //    document.getElementById("relearn3").innerHTML = checkRelearnable3();
  //      function checkRelearnable3() {
  //        if (((data.move3Name == data.eggMove1Name) || (data.move3Name == data.eggMove2Name) || (data.move3Name == data.eggMove3Name) || (data.move3Name == data.eggMove4Name)) && (data.move3Name != "")) {
  //          return "(relearnable)";
  //        }
  //        else return "";
  //      }
  //    document.getElementById("relearn4").innerHTML = checkRelearnable4();
  //      function checkRelearnable4() {
  //        if (((data.move4Name == data.eggMove1Name) || (data.move4Name == data.eggMove2Name) || (data.move4Name == data.eggMove3Name) || (data.move4Name == data.eggMove4Name)) && (data.move4Name != "")) {
  //          return "(relearnable)";
  //        }
  //        else return "";
  //      }
  
  //}
  
  //if (data.cardType == 'Item') {
    
  //  document.getElementById("pokemonbox").style.display = "none";
  //  document.getElementById("itembox").style.display = "block";
    
  //  data.item1 = itemName[(buf.readUInt16LE(0x68))];
    
  //  if (data.wcType == "wc6") {
  //    data.itemQ = buf.readUInt16LE(0x70);
  //    document.getElementById("item1").innerHTML = item1();
  //    function item1() {
  //      if (data.itemQ > 0) {
  //        return (data.item1 + " x" + data.itemQ);
  //      }
  //      else
  //        return "";
  //    }
  //  }
    
  //  if (data.wcType == "wc7") {
  //    data.item1Q = buf.readUInt16LE(0x6A);
  //    data.item2 = itemName[(buf.readUInt16LE(0x6C))];
  //    data.item2Q = buf.readUInt16LE(0x6E);
  //    data.item3 = itemName[(buf.readUInt16LE(0x70))];
  //    data.item3Q = buf.readUInt16LE(0x72);
  //    data.item4 = itemName[(buf.readUInt16LE(0x74))];
  //    data.item4Q = buf.readUInt16LE(0x76);
  //    data.item5 = itemName[(buf.readUInt16LE(0x78))];
  //    data.item5Q = buf.readUInt16LE(0x7A);
  //    data.item6 = itemName[(buf.readUInt16LE(0x7C))];
  //    data.item6Q = buf.readUInt16LE(0x7E);
      
  //    document.getElementById("item1").innerHTML = item1();
  //    function item1() {
  //      if (data.item1Q > 0) {
  //        return (data.item1 + " x" + data.item1Q);
  //      }
  //      else
  //        return "";
  //    }
  //    document.getElementById("item2").innerHTML = item2();
  //    function item2() {
  //      if (data.item2Q > 0) {
  //        return (data.item2 + " x" + data.item2Q);
  //      }
  //      else
  //        return "";
  //    }
  //    document.getElementById("item3").innerHTML = item3();
  //    function item3() {
  //      if (data.item3Q > 0) {
  //        return (data.item3 + " x" + data.item3Q);
  //      }
  //      else
  //        return "";
  //    }
  //    document.getElementById("item4").innerHTML = item4();
  //    function item4() {
  //      if (data.item4Q > 0) {
  //        return (data.item4 + " x" + data.item4Q);
  //      }
  //      else
  //        return "";
  //    }
  //    document.getElementById("item5").innerHTML = item5();
  //    function item5() {
  //      if (data.item5Q > 0) {
  //        return (data.item5 + " x" + data.item5Q);
  //      }
  //      else
  //        return "";
  //    }
  //    document.getElementById("item6").innerHTML = item6();
  //    function item6() {
  //      if (data.item6Q > 0) {
  //        return (data.item6 + " x" + data.item6Q);
  //      }   
  //      else
  //        return "";
  //    }  
  //  }
  //}  
  
  //document.getElementById("pkmnImg").src = "img/large/pokemon" + shinyCheck() + pokemonImg() + ".png";
  //  function pokemonImg() {
  //    if (data.isEgg == 'Is egg') {
  //      return "egg";
  //    }
  //    else if (data.cardType == 'Item') {
  //      return "0";
  //    }
  //    else if (data.formId > 0) {
  //      return (data.dexNo + "-" + data.formId);
  //    }
  //    else 
  //      return data.dexNo;
  //  }
  //  function shinyCheck() {
  //    if (data.pidId == 2) {
  //      return "/shiny/";
  //    }
  //    else 
  //      return "/regular/";
  //  } 
  document.getElementById("pkmnSpecies").className = "spr-box" + " spr-box-" + data.dexNo + formCheck() + " " + shinyCheckAgain();
   function shinyCheckAgain() {
  //    if (data.pidId == 2) {
  //      return "spr-shiny";
  //    }
  //    else 
        return "spr-regular";
    } 
    function formCheck() {
  //    if (!data.formId == 0) {
  //      return ("-" + data.formId);
  //    }
  //    else
        return ""
    }

  //if (data.wcType == "wc6") {
  //  var gen7exclusive = document.getElementsByClassName("extragen7");
  //  for (var i=0;i<gen7exclusive.length;i+=1){
  //    gen7exclusive[i].style.display = 'none';
  //  }
  //}
  
  //if (data.wcType == "wc7") {
  //  var gen7exclusive = document.getElementsByClassName("extragen7");
  //  for (var i=0;i<gen7exclusive.length;i+=1){
  //    gen7exclusive[i].style.display = 'block';
  //  }
  //}
  
  return data;
  
}; 
