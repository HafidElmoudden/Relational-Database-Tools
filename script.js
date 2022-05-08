const dfs = document.getElementById("dfs");
const lesDf = document.getElementsByClassName("df");
const addDfBtn = document.getElementById("df-adder");
const deleteDfBtn = document.getElementById("df-deleter");
const calculateBtn = document.getElementById("calculate");
const dfRight = document.getElementsByClassName("df-right");
const dfLeft = document.getElementsByClassName("df-left");
const closureSet = document.getElementById("closure-set");
const attributes = document.getElementById("attributes");
const form = document.getElementById("form");
const result = document.getElementById("result");
const keyPageBtn = document.getElementById("key-page");
const closurePageBtn = document.getElementById("closure-page");
const decompositionPageBtn = document.getElementById("decomposition-page");
const closureSection = document.getElementsByClassName("closure-section");
const keysdiv = document.getElementById('keys');
const drelationsdiv = document.getElementById('d-relations');
let calculateBtnState = 0;

// ---------------------------------Pages Stuff---------------------------
closurePageBtn.addEventListener("click", () => {
  keysdiv.innerHTML = '';
  drelationsdiv.innerHTML = '';
  closureSection[0].style.display = "flex";
  keysdiv.style.display = 'none';
  drelationsdiv.style.display = 'none';
  calculateBtn.textContent = "Calculate";
  result.textContent = "Result :";
  calculateBtnState = 0;
});

keyPageBtn.addEventListener("click", () => {
  keysdiv.innerHTML = '';
  drelationsdiv.innerHTML = '';
  closureSection[0].style.display = "none";
  keysdiv.style.display = 'flex';
  drelationsdiv.style.display = 'none';
  calculateBtn.textContent = "Find Keys";
  result.textContent = "Candidate Keys :";
  calculateBtnState = 1;
});

decompositionPageBtn.addEventListener("click", () => {
  keysdiv.innerHTML = '';
  drelationsdiv.innerHTML = '';
  closureSection[0].style.display = "none";
  drelationsdiv.style.display = 'flex';
  drelationsdiv.style.flexDirection = 'column';
  keysdiv.style.display = 'none';
  calculateBtn.textContent = "Decompose Relation";
  result.textContent = "Relations :";
  calculateBtnState = 2;
});


// -----------------------------------------------------------------------
function dfMaker() {
  let dfDiv = document.getElementsByClassName("df");
  let dfDivClone = dfDiv[0].cloneNode(true);
  dfDivClone.firstElementChild.value = "";
  dfDivClone.lastElementChild.value = "";
  return dfDivClone;
}

addDfBtn.addEventListener("click", () => {
  dfs.appendChild(dfMaker());
});

deleteDfBtn.addEventListener("click", () => {
  if (lesDf.length != 1) dfs.removeChild(lesDf[lesDf.length - 1]);
  else alert("You can't have less than 1 dependancy!");
});

function closureCalc(set, dependances) {
  let allow;
  let repeatAllow;
  let check;
  while (1) {
    repeatAllow = 0;
    for (let i = 0; i < dependances.length; i++) {
      for (let j = 0; j < dependances[i].gauche.length; j++) {
        for (let z = 0; z < set.length; z++) {
          if (dependances[i].gauche[j] == set[z]) {
            check = 0;
            break;
          } else {
            check = 1;
          }
        }
        if (check == 1) break;
      }
      if (check != 1) {
        for (let y = 0; y < dependances[i].droite.length; y++) {
          for (let x = 0; x < set.length; x++) {
            // here we are checking if the attribute is already in the closure set
            if (dependances[i].droite[y] === set[x]) {
              allow = 1;
              break;
            } else {
              allow = 0;
              continue;
            }
          }
          if (allow != 1) {
            set.push(dependances[i].droite[y]);
            repeatAllow = 1;
          }
        }
      }
    }
    if (repeatAllow == 0) break;
  }
}

function dependanceFiller(dependances) {
  for (let i = 0; i < lesDf.length; i++) {
    dependances.push({
      droite: dfRight[i].value.split(",").filter((el) => el != ""),
      gauche: dfLeft[i].value.split(",").filter((el) => el != ""),
    });
  }
}

function similarFinder(element, array) {
  for (let i = 0; i < array.length; i++) if (element === array[i]) return true;
  return false;
}

function isClosureKeyChecker(attributes, closureSet) {
  for (let i = 0; i < attributes.length; i++)
    if (similarFinder(attributes[i], closureSet)) continue;
    else return false;
  return true;
}

let Keys = [];
let dependances = [];
let set;

function arrayEqual(source) {
  let res = [];
  for (let i = 0; i < source.length; i++) res.push(source[i]);
  return res;
}

function arrayShower(array) {
  for (let i = 0; i < array.length; i++) {
    console.log(`Key [${i}]`, array[i]);
  }
}

function arraysEqual(a, b) {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length !== b.length) return false;
  for (var i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

function keyRepeated(newKey, keysArray) {
  for (let i = 0; i < newKey.length; i++)
    for (let j = 0; j < keysArray.length; j++)
      if (similarFinder(newKey[i], keysArray[j])) return true;
  return false;
}

function containsDuplicates(array) {
  const result = array.some((element) => {
    if (array.indexOf(element) !== array.lastIndexOf(element)) {
      return true;
    }

    return false;
  });

  return result;
}

function isAlreadyExist(newKey, Keys) {
  let newKeyCopy = Array.from(newKey).sort();
  for (let i = 0; i < Keys.length; i++)
    if (arraysEqual(newKeyCopy, Array.from(Keys[i]).sort())) {
      return true;
    }
    else return false;
}


function string_recurse(active, rest) {
  if (rest.length == 0) {
    console.log(active);
  } else {
    string_recurse(active + rest.charAt(0), rest.substring(1, rest.length));
    string_recurse(active, rest.substring(1, rest.length));
  }
}

function combinations(str) {
  var fn = function (active, rest, a) {
    if (!active && !rest) return;
    if (!rest) {
      a.push(active);
    } else {
      fn(active + rest[0], rest.slice(1), a);
      fn(active, rest.slice(1), a);
    }
    return a;
  };
  return fn("", str, []);
}


const powerset = (array) => {
  // O(2^n)
  const results = [[]];
  for (const value of array) {
    const copy = Array.from(results); // See note below.
    for (const prefix of copy) {
      results.push(prefix.concat(value));
    }
  }
  return results;
};

function isContainKey(newKey, Keys) {
  for (let i = 0; i < Keys.length; i++) {
    if (
      Keys[i].every((element) => {
        return newKey.indexOf(element) !== -1;
      }) == true
      ){
        return true;
      }
      
    }
    return false;
}

function isLeftHandKey(dependance, keys){
  for(let key of keys)
    if(arraysEqual(dependance.gauche, key))
      return true;
    return false;
}

calculateBtn.addEventListener("click", () => {
  keysdiv.innerHTML = '';
  drelationsdiv.innerHTML = '';
  let dummyClosureSet;
  let calculatedDummyClosureSet;
  let allCombinationsPossible;
  let closureCalcArrayDummy;
  let attributesArray = attributes.value.split(",").filter((el) => el != "");
  switch (calculateBtnState) {
    case 0:
      dependances = [];
      set = closureSet.value.split(",").filter((el) => el != "");
      dependanceFiller(dependances);
      closureCalc(set, dependances);
      console.log(set);
      result.innerHTML = `Result : {${set}}<sup>+</sup>`;
      break;
    case 1:
      const keyTexts = document.getElementsByClassName('keyTexts');
      dependances = [];
      Keys = [];
      dummyClosureSet = [];
      calculatedDummyClosureSet = [];
      dependanceFiller(dependances);
      allCombinationsPossible = powerset(attributesArray);
      allCombinationsPossible.shift();
      for (const element of allCombinationsPossible) {
        closureCalcArrayDummy = Array.from(element);
        closureCalc(closureCalcArrayDummy, dependances);
        if (
          isClosureKeyChecker(attributesArray, closureCalcArrayDummy) &&
          isContainKey(element,Keys) == false
        )
          Keys.push(element);
      }

      console.log(allCombinationsPossible);
      console.log(Keys);
      for(let key of Keys){
        let keyText = document.createElement('h3');
        keyText.textContent = `{${key}}`;
        keyText.classList.add('keyTexts');
        keysdiv.appendChild(keyText)
      }
   
      break;
    case 2:
      let relation = [Array.from(attributesArray)];
      let elementsToPush = [];
      dependances = [];
      Keys = [];
      dummyClosureSet = [];
      calculatedDummyClosureSet = [];
      dependanceFiller(dependances);
      allCombinationsPossible = powerset(attributesArray);
      allCombinationsPossible.shift();
      for (const element of allCombinationsPossible) {
        let closureCalcArrayDummy = Array.from(element);
        closureCalc(closureCalcArrayDummy, dependances);
        if (
          isClosureKeyChecker(attributesArray, closureCalcArrayDummy) &&
          isContainKey(element,Keys) == false
        )
          Keys.push(element);
      }
      console.log(Keys);
      console.log(relation);
      for(let dependance of dependances)
        if(!isLeftHandKey(dependance, Keys)){
          elementsToPush = dependance.gauche.concat(dependance.droite)
          console.log(elementsToPush);
          relation[0] = relation[0].filter( el => dependance.droite.every(elem => elem != el))
          console.log(relation, 'after filter');
          relation.push(elementsToPush);
        }

        for(let element in relation){
          let decomposedRelation = document.createElement('h3');
          decomposedRelation.textContent = `R${Number(element)+1}(${relation[element]})`;
          drelationsdiv.appendChild(decomposedRelation)
        }
      break;
    default:
      break;
  }
});

