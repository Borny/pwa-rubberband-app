import '../styles/main.scss';

let deferredPrompt;
const installBtn = document.getElementById('install-app');

// SERVICE WORKER
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
  .then(() => {
    console.log('Service worker registered!');
  });
}

// // DEFERRING THE INSTALLATION
window.addEventListener('beforeinstallprompt', (event) => {
  console.log('beforeinstallprompt fired');
  event.preventDefault();
  deferredPrompt = event;
  return false;
});

// INSTALL THE APP
installBtn.addEventListener('click', () => {
  console.log('install the app')
  if (deferredPrompt) {
    deferredPrompt.prompt();

    deferredPrompt.userChoice.then((choiceResult) => {
      console.log(choiceResult.outcome);

      if (choiceResult.outcome === 'dismissed') {
        console.log('User canceled installation');
      } else {
        console.log('User added to home screen');
      }
    });

    deferredPrompt = null;
  }
});

// VARIABLES
const tabBtns = document.querySelectorAll('.tabs__item');
const contents = document.querySelectorAll('.content');
const resetBtn = document.getElementById('reset-btn');
const checkBoxes = document.querySelectorAll('.input-checkbox');

// CHECKING LOCAL STORAGE ON INIT
const localStorageChecked = JSON.parse(localStorage.getItem('checkbox'));

if (localStorageChecked && localStorageChecked.length) {
  localStorageChecked.forEach((localCheckbox) => {
    checkBoxes.forEach((checkbox) => {
      const attributeID = checkbox.getAttribute('id');
      if (attributeID === localCheckbox.checkBoxId) {
        checkbox.checked = true;
      }
    });
  });
}

// TABS
tabBtns.forEach((btn, idx) => {
  btn.addEventListener('click', () => {
    tabBtns.forEach((btn) => btn.classList.remove('active'));
    btn.classList.toggle('active');

    contents.forEach((content) => {
      content.classList.remove('show');
      contents[idx].classList.add('show');
    });
  });
});

// CHECKBOXES EVENT
checkBoxes.forEach((checkbox) => {
  checkbox.addEventListener('change', () => {
    updateLocalStorage();
  });
});

// UPDATE LOCAL STORAGE
function updateLocalStorage() {
  const checkboxesChecked = [];
  checkBoxes.forEach((checkbox) => {
    if (checkbox.checked) {
      checkboxesChecked.push({
        checkBoxId: checkbox.id,
      });
    }
  });

  localStorage.setItem('checkbox', JSON.stringify(checkboxesChecked));
}

// RESET BTN EFFECTIVE ON THE ACTIVE TAB ONLY
resetBtn.addEventListener('click', () => {
  const contentCheckBoxes = document.querySelectorAll(
    '.content.show .input-checkbox'
  );

  contentCheckBoxes.forEach((checkbox) => (checkbox.checked = false));

  updateLocalStorage();
});
