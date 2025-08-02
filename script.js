// Configuration
const totalNumbers = 20000; // Total numbers to generate (00001-20000)
const maxSelection = 100; // Maximum number of tickets a user can select
const numbersPerPage = 5000; // Número de números por página

// Elements
const numbersGrid = document.getElementById('numbers-grid');
const selectedNumbersContainer = document.getElementById('selected-numbers');
const selectedCountElement = document.getElementById('selected-count');
const reserveBtn = document.getElementById('reserve-btn');
const searchBtn = document.getElementById('search-btn');
const prevPageBtn = document.getElementById('prev-page-btn');
const nextPageBtn = document.getElementById('next-page-btn');
const prevPageBtnTop = document.getElementById('prev-page-btn-top');
const nextPageBtnTop = document.getElementById('next-page-btn-top');
const currentPageElement = document.getElementById('current-page');
const currentPageElementTop = document.getElementById('current-page-top');
const searchInput = document.getElementById('search-input');
const searchResult = document.getElementById('search-result');
const reservePanel = document.getElementById('reserve-panel');
const reserveForm = document.getElementById('reserve-form');
const selectionSummary = document.querySelector('.selection-summary');
let isSticky = false;

// Agregar variable para controlar la visibilidad de números vendidos
let hideUnavailableNumbers = false;

class MediaCarousel {
  constructor(mediaItems) {
    this.mediaItems = mediaItems;
    this.currentIndex = 0;
    this.isAutoPlay = true;
    this.autoPlayInterval = null;

    this.mediaContainer = document.getElementById('mediaContainer');
    this.mediaDetailsEl = document.getElementById('mediaDetails');
    this.prevBtn = document.getElementById('prevBtn');
    this.nextBtn = document.getElementById('nextBtn');

    this.initEventListeners();
    this.renderMedia();
    this.startAutoPlay();
  }

  initEventListeners() {
    this.prevBtn.addEventListener('click', () => this.changMedia(-1));
    this.nextBtn.addEventListener('click', () => this.changMedia(1));
  }

  renderMedia() {
    const currentItem = this.mediaItems[this.currentIndex];
    
    // Limpiar contenedor anterior
    this.mediaContainer.innerHTML = '';
    
    // Crear elemento de media
    let mediaElement;
    let videoControls = null;
    
    if (currentItem.type === 'image') {
      mediaElement = document.createElement('img');
      mediaElement.src = currentItem.src;
      mediaElement.alt = currentItem.alt;
      mediaElement.classList.add('carousel-media');
    } else if (currentItem.type === 'video') {
      mediaElement = document.createElement('video');
      mediaElement.src = currentItem.src;
      mediaElement.classList.add('carousel-media');
      mediaElement.muted = true;
      mediaElement.playsInline = true;

      // Crear controles de video
      videoControls = document.createElement('div');
      videoControls.classList.add('video-controls');

      // Botón de retroceder
      const rewindBtn = document.createElement('button');
      rewindBtn.classList.add('video-control-btn');
      rewindBtn.textContent = '«';
      rewindBtn.addEventListener('click', () => {
        mediaElement.currentTime = Math.max(0, mediaElement.currentTime - 10);
      });

      // Botón de play/pause
      const playPauseBtn = document.createElement('button');
      playPauseBtn.classList.add('video-control-btn');
      playPauseBtn.textContent = '►';
      
      // Botón de adelantar
      const forwardBtn = document.createElement('button');
      forwardBtn.classList.add('video-control-btn');
      forwardBtn.textContent = '»';
      forwardBtn.addEventListener('click', () => {
        mediaElement.currentTime = Math.min(
          mediaElement.duration, 
          mediaElement.currentTime + 10
        );
      });

      // Botón de silencio
      const muteBtn = document.createElement('button');
      muteBtn.classList.add('video-control-btn');
      muteBtn.textContent = '🔇';

      // Funcionalidad de play/pause
      playPauseBtn.addEventListener('click', () => {
        if (mediaElement.paused) {
          mediaElement.play();
          playPauseBtn.textContent = '';
        } else {
          mediaElement.pause();
          playPauseBtn.textContent = '►';
        }
      });

      // Funcionalidad de mute/unmute
      muteBtn.addEventListener('click', () => {
        mediaElement.muted = !mediaElement.muted;
        muteBtn.textContent = mediaElement.muted ? '🔇' : '🔊';
      });

      // Eventos para actualizar estado de botones
      mediaElement.addEventListener('play', () => {
        playPauseBtn.textContent = '⏸️';
      });

      mediaElement.addEventListener('pause', () => {
        playPauseBtn.textContent = '▶️';
      });

      // Añadir barra de progreso
      const progressBar = document.createElement('input');
      progressBar.type = 'range';
      progressBar.min = 0;
      progressBar.max = 100;
      progressBar.value = 0;
      progressBar.classList.add('video-progress-bar');

      // Actualizar barra de progreso
      mediaElement.addEventListener('timeupdate', () => {
        const progress = (mediaElement.currentTime / mediaElement.duration) * 100;
        progressBar.value = progress;
      });

      // Permitir buscar en el video usando la barra de progreso
      progressBar.addEventListener('input', () => {
        const time = (progressBar.value / 100) * mediaElement.duration;
        mediaElement.currentTime = time;
      });

      // Añadir controles al contenedor
      videoControls.appendChild(rewindBtn);
      videoControls.appendChild(playPauseBtn);
      videoControls.appendChild(forwardBtn);
      videoControls.appendChild(muteBtn);
      videoControls.appendChild(progressBar);
    }

    this.mediaContainer.appendChild(mediaElement);
    
    // Añadir controles de video si existen
    if (videoControls) {
      this.mediaContainer.appendChild(videoControls);
    }
  }

  changMedia(direction) {
    // Pausar el video actual si existe
    const currentMedia = this.mediaContainer.querySelector('video');
    if (currentMedia) {
      currentMedia.pause();
    }

    this.currentIndex = (this.currentIndex + direction + this.mediaItems.length) % this.mediaItems.length;
    this.renderMedia();
    this.resetAutoPlay();
  }

  startAutoPlay() {
    this.autoPlayInterval = setInterval(() => {
      if (this.isAutoPlay) {
        // Obtener el elemento actual
        const currentItem = this.mediaItems[this.currentIndex];
        
        // Si es un video, usar un tiempo más largo
        if (currentItem.type === 'video') {
          // 1.10 minutos para el video
          setTimeout(() => {
            this.changMedia(1);
          }, 70000);
        } else {
          // 3 segundos para imágenes
          this.changMedia(1);
        }
      }
    }, 3000);
  }

  resetAutoPlay() {
    clearInterval(this.autoPlayInterval);
    this.startAutoPlay();
  }
}


// Definir elementos multimedia
const mediaItems = [
  { type: 'image', src: 'Manubrio.jpeg', alt: 'Manubrio' },
  { type: 'image', src: 'Llantas.jpeg', alt: 'Llantas' },
  { type: 'video', src: 'Video Rex Max.mp4', alt: 'Video Rex Max' },
  { type: 'image', src: 'Doblado.jpeg', alt: 'Doblado' },
  { type: 'image', src: 'Patin.jpeg', alt: 'Patin' }
];


// Inicializar carrusel
const carousel = new MediaCarousel(mediaItems);


// State management
let selectedNumbers = [];
let soldNumbers = []; // Array para almacenar los números vendidos
let numbers = generateNumbers();
let currentPage = 1;
const totalPages = Math.ceil(totalNumbers / numbersPerPage);

// Generate numbers data with all numbers initially available
function generateNumbers() {
  const numbersArray = [];
  for (let i = 1; i <= totalNumbers; i++) {
    const numberString = i.toString().padStart(5, '0');
    numbersArray.push({ number: numberString, sold: false });
  }
  return numbersArray;
}

// Display numbers for the current page
function displayNumbers() {
  const startIndex = (currentPage - 1) * numbersPerPage;
  const endIndex = Math.min(startIndex + numbersPerPage, numbers.length);
  
  // Filtrar números según la opción seleccionada
  let numbersToDisplay = numbers.slice(startIndex, endIndex);
  
  // Si está activada la opción de ocultar, filtrar los números vendidos
  if (hideUnavailableNumbers) {
    numbersToDisplay = numbersToDisplay.filter(numberObj => 
      !numberObj.sold && !soldNumbers.includes(numberObj.number)
    );
  }
  
  // Comprobar si hay números disponibles para mostrar
  if (numbersToDisplay.length === 0) {
    // Mostrar mensaje de boletos agotados
    numbersGrid.innerHTML = `
      <div class="sold-out-message">
  <div class="message-content">
    <div class="emoji">👀</div>
    <h3>¡¡Se acabaron los boletos!!</h3>
    <div class="separator"></div>
    <p>Si salen despreciados serán anunciados en nuestra página de Facebook, sigue atent@ a las actualizaciones 😉</p>
    <div class="separator"></div>
  </div>
</div>
    `;
  } else {
    // Mostrar números normalmente
    numbersGrid.innerHTML = '';
    
    numbersToDisplay.forEach(numberObj => {
      const numberItem = document.createElement('div');
      numberItem.textContent = numberObj.number;
      numberItem.classList.add('number-item');
      
      if (numberObj.sold || soldNumbers.includes(numberObj.number)) {
        numberItem.classList.add('sold');
      } else if (selectedNumbers.includes(numberObj.number)) {
        numberItem.classList.add('selected');
      }
      
      if (!numberObj.sold && !soldNumbers.includes(numberObj.number)) {
        numberItem.addEventListener('click', () => toggleNumberSelection(numberObj.number));
      }
      
      numbersGrid.appendChild(numberItem);
    });
  }
  
  // Update both pagination displays
  currentPageElement.textContent = `Página ${currentPage}`;
  currentPageElementTop.textContent = `Página ${currentPage}`;
  
  // Enable/disable pagination buttons
  updatePaginationButtons();
}

// Update pagination button states
function updatePaginationButtons() {
  const disablePrev = currentPage === 1;
  const disableNext = currentPage === totalPages;
  
  prevPageBtn.disabled = disablePrev;
  prevPageBtnTop.disabled = disablePrev;
  nextPageBtn.disabled = disableNext;
  nextPageBtnTop.disabled = disableNext;
  
  // Optional: Add visual indication
  prevPageBtn.style.opacity = disablePrev ? '0.5' : '1';
  prevPageBtnTop.style.opacity = disablePrev ? '0.5' : '1';
  nextPageBtn.style.opacity = disableNext ? '0.5' : '1';
  nextPageBtnTop.style.opacity = disableNext ? '0.5' : '1';
}

// Navigate to previous page
function goToPreviousPage() {
  if (currentPage > 1) {
    currentPage--;
    displayNumbers();
  }
}

// Navigate to next page
function goToNextPage() {
  if (currentPage < totalPages) {
    currentPage++;
    displayNumbers();
  }
}

// Select or deselect a number
function toggleNumberSelection(number) {
  const index = selectedNumbers.indexOf(number);
  if (index > -1) {
    // Number is already selected, deselect it
    selectedNumbers.splice(index, 1);
  } else {
    // Check if max selection is reached
    if (selectedNumbers.length >= maxSelection) {
      searchResult.textContent = `Solo puede seleccionar un máximo de ${maxSelection} boletos.`;
      return;
    }
    // Select the number
    selectedNumbers.push(number);
  }
  updateSelectedNumbersDisplay();
  displayNumbers(); // Redisplay to update selected states
}

// Update the display of selected numbers
function updateSelectedNumbersDisplay() {
    selectedNumbersContainer.innerHTML = '';
    selectedCountElement.textContent = selectedNumbers.length;
    
    selectedNumbers.forEach(number => {
      const selectedNumber = document.createElement('div');
      selectedNumber.textContent = number;
      selectedNumber.classList.add('selected-number');
    
    // Add click to remove functionality
    selectedNumber.addEventListener('click', () => toggleNumberSelection(number));
    
    selectedNumbersContainer.appendChild(selectedNumber);
  });
  
  // Enable or disable reserve button based on selection
  reserveBtn.disabled = selectedNumbers.length === 0;
  if (selectedNumbers.length === 0) {
    reserveBtn.style.opacity = '0.5';
    // Quitar el comportamiento sticky cuando no hay selecciones
    selectionSummary.style.position = selectionSummary.dataset.originalPosition || 'static';
    selectionSummary.style.boxShadow = 'none';
    isSticky = false;
  } else {
    reserveBtn.style.opacity = '1';
    // Aplicar comportamiento sticky cuando hay selecciones
    if (!selectionSummary.dataset.originalPosition) {
      selectionSummary.dataset.originalPosition = window.getComputedStyle(selectionSummary).position;
    }
    selectionSummary.style.position = 'sticky';
    selectionSummary.style.bottom = '0';
    selectionSummary.style.zIndex = '900';
    selectionSummary.style.boxShadow = '0 -2px 10px rgba(0, 0, 0, 0.2)';
    isSticky = true;
  }
}

// Function to mark numbers as sold
function markNumbersAsSold(numbersToMark) {
  numbersToMark.forEach(number => {
    // Add to sold numbers array
    if (!soldNumbers.includes(number)) {
      soldNumbers.push(number);
    }
    
    // Update the numbers array
    const numberObj = numbers.find(n => n.number === number);
    if (numberObj) {
      numberObj.sold = true;
    }
  });
  
  // Remove sold numbers from selected
  selectedNumbers = selectedNumbers.filter(number => !soldNumbers.includes(number));
  updateSelectedNumbersDisplay();
  displayNumbers();
  
  // Verificar si todos los boletos están agotados después de marcar como vendidos
  if (checkAllSoldOut()) {
    // Mostrar mensaje para todos los usuarios
    document.getElementById('hide-sold-switch').checked = true;
    hideUnavailableNumbers = true;
    displayNumbers();
  }
}

// Función para verificar si todos los boletos están agotados
function checkAllSoldOut() {
  const availableNumbers = numbers.filter(numberObj => 
    !numberObj.sold && !soldNumbers.includes(numberObj.number)
  );
  
  return availableNumbers.length === 0;
}

// Handle search functionality
function searchNumber() {
  const searchValue = searchInput.value.trim();
  
  // Format the search value to match the number format
  let formattedSearch = searchValue;
  if (/^\d+$/.test(searchValue)) {
    formattedSearch = searchValue.padStart(5, '0');
  }
  
  const numberObj = numbers.find(n => n.number === formattedSearch);
  
  if (numberObj) {
    if (numberObj.sold || soldNumbers.includes(numberObj.number)) {
      searchResult.textContent = `Lo sentimos, el número ${formattedSearch} ya ha sido vendido.`;
    } else {
      searchResult.textContent = `¡El número ${formattedSearch} está disponible!`;
      
      // Calculate which page this number is on
      const numberIndex = parseInt(formattedSearch) - 1;
      const pageForNumber = Math.floor(numberIndex / numbersPerPage) + 1;
      
      // Navigate to that page
      if (pageForNumber !== currentPage) {
        currentPage = pageForNumber;
        displayNumbers();
      }
      
      // Select it if not already selected
      if (!selectedNumbers.includes(formattedSearch)) {
        toggleNumberSelection(formattedSearch);
      }
    }
  } else {
    searchResult.textContent = `No se encontró el número ${formattedSearch}.`;
  }
}

// Validate form and check if all required fields are filled
function validateForm() {
  const phoneNumber = document.getElementById('phone-number').value.trim();
  const name = document.getElementById('name').value.trim();
  const lastName = document.getElementById('last-name').value.trim();
  const estado = document.getElementById('estado').value.trim();
  
  return phoneNumber !== '' && name !== '' && lastName !== '' && estado !== '';
}

// Event Listeners
// Pagination
prevPageBtn.addEventListener('click', goToPreviousPage);
nextPageBtn.addEventListener('click', goToNextPage);
prevPageBtnTop.addEventListener('click', goToPreviousPage);
nextPageBtnTop.addEventListener('click', goToNextPage);

// Search
searchBtn.addEventListener('click', searchNumber);
searchInput.addEventListener('keyup', function(event) {
  if (event.key === 'Enter') {
    searchNumber();
  }
});

// Reserve
reserveBtn.addEventListener('click', function() {
  if (selectedNumbers.length > 0) {
    reservePanel.style.display = 'flex';
  }
});

// Close reservation panel if clicked outside
document.addEventListener('click', function(event) {
  if (event.target === reservePanel) {
    reservePanel.style.display = 'none';
  }
});

// Handle reserve form submission
reserveForm.addEventListener('submit', function(event) {
  event.preventDefault();

  // Definir emojis usando Unicode
const ticketEmoji = '\uD83C\uDF9F️';  // 🎟️
const moneyEmoji = '\uD83D\uDCB3';    // 💳
const eyesEmoji = '\uD83D\uDC40';     // 👀
const warningEmoji = '\u26A0️';       // ⚠️
  
  // Check if form is valid
  if (!validateForm()) {
    alert('Por favor, completa todos los campos obligatorios');
    return;
  }
  
  const phoneNumber = document.getElementById('phone-number').value;
  const name = document.getElementById('name').value;
  const lastName = document.getElementById('last-name').value;
  const estado = document.getElementById('estado').value;
  const totalAmount = selectedNumbers.length * 10;

  const message = `Hola, Aparté boletos para: *3 patines eléctricos* 
——————————————— 
${ticketEmoji} *BOLETOS:* ${selectedNumbers.length} 

Folio: *${selectedNumbers.join(', ')}*
Nombre: *${name} ${lastName}*

${moneyEmoji} *TOTAL A PAGAR: $${totalAmount} PESOS* 
——————————————— 
${eyesEmoji} *EL APARTADO DURA 12 HORAS* 
*CUENTAS DE PAGO AQUÍ:*
". " 

*Celular:* ${phoneNumber} 

${warningEmoji} El siguiente paso es enviar foto del comprobante de pago por aquí! 
*FAVOR DE MANDAR SU PAGO Y NO VOLVER A ESCRIBIR*, SOLO ESPERA RESPUESTA (tardamos entre 1 y 48 horas en responder a partir de tu ultimo mensaje. Manda "Apartado" y tú pago para atenderte más rápido)

Para pagos en efectivo visítanos en cualquiera de nuestras sucursales!
 • Sucursal Arandas: Libramiento Sur km 1 + 350, Arandas, Jal. 47180 (https://maps.app.goo.gl/2iuhxPDS9uaXcoGv5)
 • Sucursal Tepatitlan: Anillo Periferico Salvador Zuñiga Torres #322, Tepatitlan, Jal. 47630 (https://maps.app.goo.gl/xG3W8HA9FdfJ9Zkr9)
 • Sucursal Atotonilco: Carr. Aatotonilco la barca km 8 #550, Milpillas Atotonilco, Jal. 47775 (". . . ")
 • Sucursal Matriz: Rancho el Saucillo #26 en San Ignacio Cerro Gordo, Jalisco. 47190 (https://maps.app.goo.gl/3TzoQt8ofnZWeASb6)`;
  
  // Mark the selected numbers as sold
  markNumbersAsSold([...selectedNumbers]);
  
  const whatsappUrl = `https://wa.me/3481144355?text=${encodeURIComponent(message)}`;
  window.open(whatsappUrl, '_blank');
  
  // Reset form and hide panel
  event.target.reset();
  reservePanel.style.display = 'none';
});

// Style the reserve panel
reservePanel.style.position = 'fixed';
reservePanel.style.top = '0';
reservePanel.style.left = '0';
reservePanel.style.width = '100%';
reservePanel.style.height = '100%';
reservePanel.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
reservePanel.style.display = 'none';
reservePanel.style.justifyContent = 'center';
reservePanel.style.alignItems = 'center';
reservePanel.style.zIndex = '1000';

reserveForm.style.backgroundColor = '#fff';
reserveForm.style.padding = '20px';
reserveForm.style.borderRadius = '10px';
reserveForm.style.display = 'flex';
reserveForm.style.flexDirection = 'column';
reserveForm.style.gap = '10px';
reserveForm.style.width = '90%';
reserveForm.style.maxWidth = '400px';

// Elementos del Casino de la Suerte
const casinoImage = document.querySelector('.casino-image-container');
const casinoModal = document.getElementById('casino-modal');
const luckyNumberCount = document.getElementById('lucky-number-count');
const luckyNumbersContainer = document.getElementById('lucky-numbers-container');
const refreshNumbersBtn = document.getElementById('refresh-numbers');
const acceptLuckyNumbersBtn = document.getElementById('accept-lucky-numbers');

// Inicializar opciones para el selector de cantidad
function initLuckyNumberOptions() {
  // Añadir opciones del 1 al 50 (o el número máximo que quieras permitir)
  for (let i = 1; i <= 100; i++) {
    const option = document.createElement('option');
    option.value = i;
    option.textContent = i === 1 ? `${i} número` : `${i} números`;
    luckyNumberCount.appendChild(option);
  }
}

// Generar números aleatorios únicos
function generateRandomUniqueNumbers(count, max) {
  const uniqueNumbers = new Set();
  
  while (uniqueNumbers.size < count) {
    // Generar número entre 1 y max (por ejemplo, 20000)
    const randomNum = Math.floor(Math.random() * max) + 1;
    const formattedNumber = randomNum.toString().padStart(5, '0');
    
    // Verificar si el número ya está vendido antes de agregarlo
    const numberObj = numbers.find(n => n.number === formattedNumber);
    if (numberObj && !numberObj.sold && !soldNumbers.includes(formattedNumber)) {
      uniqueNumbers.add(formattedNumber);
    }
  }
  
  return Array.from(uniqueNumbers);
}

// Mostrar números aleatorios en el modal
function displayLuckyNumbers(count) {
  const randomNumbers = generateRandomUniqueNumbers(count, totalNumbers);
  
  luckyNumbersContainer.innerHTML = '';
  
  const numbersGrid = document.createElement('div');
  numbersGrid.classList.add('lucky-numbers-grid');
  
  randomNumbers.forEach(number => {
    const numberItem = document.createElement('div');
    numberItem.textContent = number;
    numberItem.classList.add('lucky-number-item');
    numbersGrid.appendChild(numberItem);
  });
  
  luckyNumbersContainer.appendChild(numbersGrid);
  
  // Guardar los números generados como datos del contenedor
  luckyNumbersContainer.dataset.numbers = JSON.stringify(randomNumbers);
}

// Evento al cambiar la cantidad de números deseados
luckyNumberCount.addEventListener('change', function() {
  const count = parseInt(this.value);
  if (!isNaN(count) && count > 0) {
    displayLuckyNumbers(count);
  } else {
    luckyNumbersContainer.innerHTML = '';
  }
});

// Evento para refrescar los números
refreshNumbersBtn.addEventListener('click', function() {
  const count = parseInt(luckyNumberCount.value);
  if (!isNaN(count) && count > 0) {
    displayLuckyNumbers(count);
  }
});

// Evento para aceptar los números de la suerte
acceptLuckyNumbersBtn.addEventListener('click', function() {
  const numbersData = luckyNumbersContainer.dataset.numbers;
  if (numbersData) {
    const luckyNumbers = JSON.parse(numbersData);
    
    // Verificar que no exceda el máximo permitido
    if (selectedNumbers.length + luckyNumbers.length > maxSelection) {
      alert(`Solo puede seleccionar un máximo de ${maxSelection} boletos. Ya tiene ${selectedNumbers.length} seleccionados.`);
      return;
    }
    
    // Añadir números a la selección
    luckyNumbers.forEach(number => {
      if (!selectedNumbers.includes(number)) {
        selectedNumbers.push(number);
      }
    });
    
    // Actualizar visualización
    updateSelectedNumbersDisplay();
    displayNumbers();
    
    // Cerrar el modal
    casinoModal.style.display = 'none';
  }
});

// Evento para abrir el modal al hacer clic en la imagen del casino
casinoImage.addEventListener('click', function() {
  // Limpiar selecciones previas
  luckyNumberCount.value = '';
  luckyNumbersContainer.innerHTML = '';
  
  // Mostrar el modal
  casinoModal.style.display = 'flex';
});

// Cerrar el modal al hacer clic fuera de su contenido
casinoModal.addEventListener('click', function(event) {
  if (event.target === casinoModal) {
    casinoModal.style.display = 'none';
  }
});

// Cancelar reserva
document.getElementById('cancel-reserve').addEventListener('click', function() {
  reservePanel.style.display = 'none';
});

// Crear el switch para mostrar/ocultar números vendidos
const toggleSwitch = document.createElement('div');
toggleSwitch.classList.add('toggle-switch-container');
toggleSwitch.innerHTML = `
  <label class="toggle-switch">
    <input type="checkbox" id="hide-sold-switch">
    <span class="slider round"></span>
  </label>
  <span class="toggle-label">Ocultar números vendidos</span>
`;

// Insertar el switch después del contenedor de búsqueda
const searchContainer = document.querySelector('.search-container');
searchContainer.parentNode.insertBefore(toggleSwitch, searchContainer.nextSibling);

// Añadir evento al switch
document.getElementById('hide-sold-switch').addEventListener('change', function() {
  hideUnavailableNumbers = this.checked;
  displayNumbers(); // Actualizar visualización
});

// Añadir estilos CSS para el mensaje de boletos agotados
const style = document.createElement('style');
style.textContent = `
  .sold-out-message {
    text-align: center;
    padding: 40px 20px;
    background-color: #f9f9f9;
    border-radius: 10px;
    margin: 20px 0;
    color: #740b04;
  }
  
  .sold-out-message .emoji {
    font-size: 50px;
    margin-bottom: 10px;
  }
  
  .sold-out-message h3 {
    font-size: 24px;
    margin: 10px 0;
    color: #740b04;
  }
  
  .toggle-switch-container {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 15px 0;
  }
  
  .toggle-switch {
    position: relative;
    display: inline-block;
    width: 60px;
    height: 34px;
  }
  
  .toggle-switch input {
    opacity: 0;
    width: 0;
    height: 0;
  }
  
  .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    transition: .4s;
  }
  
  .slider:before {
    position: absolute;
    content: "";
    height: 26px;
    width: 26px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    transition: .4s;
  }
  
  input:checked + .slider {
    background-color: #740b04;
  }
  
  input:checked + .slider:before {
    transform: translateX(26px);
  }
  
  .slider.round {
    border-radius: 34px;
  }
  
  .slider.round:before {
    border-radius: 50%;
  }
  
  .toggle-label {
    margin-left: 10px;
    font-weight: bold;
    color: #740b04;
  }
`;

document.head.appendChild(style);

// Inicializar opciones del Casino de la Suerte
initLuckyNumberOptions();
displayNumbers();

