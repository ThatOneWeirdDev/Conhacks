javascript:(function() {
  var container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.top = '50%';
  container.style.left = '50%';
  container.style.transform = 'translate(-50%, -50%)';
  container.style.backgroundColor = '#fff';
  container.style.padding = '20px';
  container.style.borderRadius = '10px';
  container.style.boxShadow = '0 0 20px rgba(0, 0, 0, 0.1)';
  container.style.zIndex = '9999';
  container.style.minWidth = '280px';
  container.style.maxWidth = '400px';
  container.style.fontFamily = 'Arial, sans-serif';
  container.style.color = '#333';
  container.style.fontSize = '16px';
  
  var header = document.createElement('div');
  header.style.display = 'flex';
  header.style.justifyContent = 'space-between';
  header.style.alignItems = 'center';
  header.style.marginBottom = '20px';
  
  var title = document.createElement('div');
  title.textContent = 'Conhacks';
  title.style.fontWeight = 'bold';
  title.style.fontSize = '20px';
  
  var byline = document.createElement('div');
  byline.textContent = 'by Ari';
  byline.style.fontSize = '12px';
  byline.style.color = '#777';
  
  var minimizeButton = document.createElement('button');
  minimizeButton.textContent = '-';
  minimizeButton.style.fontSize = '20px';
  minimizeButton.style.border = 'none';
  minimizeButton.style.backgroundColor = 'transparent';
  minimizeButton.style.color = '#555';
  minimizeButton.style.cursor = 'pointer';
  
  var plusButton = document.createElement('button');
  plusButton.textContent = '+';
  plusButton.style.fontSize = '20px';
  plusButton.style.border = 'none';
  plusButton.style.backgroundColor = 'transparent';
  plusButton.style.color = '#555';
  plusButton.style.cursor = 'pointer';
  
  var slotsContainer = document.createElement('div');
  
  var applyButton = document.createElement('button');
  applyButton.textContent = 'Apply';
  applyButton.style.padding = '10px 20px';
  applyButton.style.border = 'none';
  applyButton.style.backgroundColor = '#007bff';
  applyButton.style.color = '#fff';
  applyButton.style.borderRadius = '5px';
  applyButton.style.cursor = 'pointer';
  applyButton.style.width = '100%';

  var scriptButton = document.createElement('button');
  scriptButton.textContent = 'Add Translation Script';
  scriptButton.style.padding = '10px 20px';
  scriptButton.style.border = 'none';
  scriptButton.style.backgroundColor = '#28a745';
  scriptButton.style.color = '#fff';
  scriptButton.style.borderRadius = '5px';
  scriptButton.style.cursor = 'pointer';
  scriptButton.style.width = '100%';
  scriptButton.style.marginTop = '10px';

  header.appendChild(title);
  header.appendChild(byline);
  header.appendChild(minimizeButton);
  header.appendChild(plusButton);
  container.appendChild(header);
  container.appendChild(slotsContainer);
  container.appendChild(applyButton);
  container.appendChild(scriptButton);
  document.body.appendChild(container);
  
  plusButton.addEventListener('click', function() {
    var slot = createSlot();
    slotsContainer.appendChild(slot);
    container.style.height = container.clientHeight + 50 + 'px';
  });
  
  function createSlot() {
    var slot = document.createElement('div');
    slot.style.marginBottom = '20px';
    
    var selectBox = document.createElement('select');
    selectBox.style.marginBottom = '10px';
    selectBox.style.width = '100%';
    selectBox.style.padding = '8px';
    selectBox.style.border = '1px solid #ccc';
    selectBox.style.borderRadius = '5px';
    selectBox.style.fontSize = '16px';
    var options = ['skip', 'force pronouns'];
    options.forEach(function(option) {
      var optionElement = document.createElement('option');
      optionElement.value = option;
      optionElement.textContent = option;
      selectBox.appendChild(optionElement);
    });
    
    var selectTrueFalse = document.createElement('select');
    selectTrueFalse.style.width = '100%';
    selectTrueFalse.style.padding = '8px';
    selectTrueFalse.style.border = '1px solid #ccc';
    selectTrueFalse.style.borderRadius = '5px';
    selectTrueFalse.style.fontSize = '16px';
    var trueOption = document.createElement('option');
    trueOption.value = '1';
    trueOption.textContent = 'True';
    selectTrueFalse.appendChild(trueOption);
    
    var falseOption = document.createElement('option');
    falseOption.value = '0';
    falseOption.textContent = 'False';
    selectTrueFalse.appendChild(falseOption);
    
    slot.appendChild(selectBox);
    slot.appendChild(selectTrueFalse);
    
    return slot;
  }
  
  var initialSlot = createSlot();
  slotsContainer.appendChild(initialSlot);
  
  minimizeButton.addEventListener('click', function() {
    container.style.display = container.style.display === 'none' ? 'block' : 'none';
  });
  
  applyButton.addEventListener('click', function() {
    var slots = slotsContainer.querySelectorAll('div');
    slots.forEach(function(slot) {
      var selectBox = slot.querySelector('select');
      var selectedOption = selectBox.value;
      
      var selectTrueFalse = slot.querySelector('select:nth-child(2)');
      var selectedValue = selectTrueFalse.value;
      
      settings[selectedOption] = parseInt(selectedValue);
    });
    
    container.style.display = 'none';
  });

  scriptButton.addEventListener('click', function() {
    var script = `
    async function translateText(text, sourceLang, targetLang) {
      const response = await fetch(\`https://translate.googleapis.com/translate_a/single?client=gtx&sl=\${sourceLang}&tl=\${targetLang}&dt=t&q=\${text}\`);
      const data = await response.json();
      const translatedText = data[0][0][0];
      return translatedText;
    }
    
    async function insertTranslatedText(answerElementId, translatedText) {
      const answerElement = document.getElementById(answerElementId);
      
      if (!answerElement) {
        console.error("Element not found:", answerElementId);
        return;
      }

      // Apply the rules for inserting phrases at the beginning
      const translatedTextTrimmed = translatedText.split('/')[0].trim();
      let prefix = '';

      if (translatedTextTrimmed.endsWith('a')) {
        prefix = 'la ';
      } else if (translatedTextTrimmed.endsWith('as')) {
        prefix = 'las ';
      } else if (translatedTextTrimmed.endsWith('es') || translatedTextTrimmed.endsWith('os')) {
        prefix = 'los ';
      } else if (translatedTextTrimmed.slice(-2, -1) === 'e' || translatedTextTrimmed.slice(-2, -1) === 'o' || translatedTextTrimmed.slice(-1) === 'e' || translatedTextTrimmed.slice(-1) === 'o') {
        prefix = 'el ';
      }

      const textToInsert = prefix + translatedTextTrimmed;

      answerElement.value = textToInsert;
      console.log("Translated text inserted into answer input:", textToInsert);
      
      answerElement.focus();
      answerElement.select();
      
      var enterEvent = new KeyboardEvent('keydown', {
        bubbles: true, cancelable: true, key: 'Enter', charCode: 13, keyCode: 13, which: 13
      });
      answerElement.dispatchEvent(enterEvent);
    }
    
    async function translateAndInsertText(questionElementId, answerElementId, sourceLang, targetLang) {
      const questionElement = document.getElementById(questionElementId);
      
      if (!questionElement) {
        console.error("Element not found:", questionElementId);
        return;
      }
    
      const text = questionElement.textContent.trim();
      if (!text) {
        console.error("No text found in element:", questionElementId);
        return;
      }
    
      try {
        const translatedText = await translateText(text, sourceLang, targetLang);
        await insertTranslatedText(answerElementId, translatedText);
      } catch (error) {
        console.error("Translation error:", error);
        alert("Failed to translate text. Please try again later.");
      }
    }
    
    async function runTranslation() {
      await translateAndInsertText("question-input", "answer-input", "en", "es");
    }
    
    let keySequence = [];
    document.addEventListener("keydown", async function(event) {
      keySequence.push(event.key);
      if (keySequence.length > 2) {
        keySequence.shift();
      }
      if (keySequence.join('') === 'tp') {
        await runTranslation();
        keySequence = [];
      }
    });
    
    runTranslation().then(() => console.log("Initial translation and insertion completed."));
    `;
    eval(script);
  });
})();
