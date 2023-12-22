import { getImages } from './image-api.js';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const searchInput = document.querySelector("[name = 'searchQuery']");
// console.dir(searchInput);
const searchBtn = document.querySelector("[type = 'submit']");
// console.dir(searchBtn);
const gallery = document.querySelector('div.gallery');
const searchBox = document.querySelector('form.search-form');
let imagesLoaded = [];
let imagePage = 1;
// console.dir(searchBox);

searchBox.addEventListener('submit', pressBtn);

function pressBtn(inputValue) {
  //   debugger;
  //   console.log(inputValue);
  inputValue.preventDefault();
  const searchWord = inputValue.target[0].value;
  //   console.log(searchWord);
  loadResults(searchWord);
}

function loadResults(term) {
  //   debugger;
  imagePage = 1;
  imagesLoaded = [];
  new Promise(resolve => {
    resolve(searchResults(term, imagePage));
  })
    .then(dataReturned => {
      if (
        dataReturned === undefined ||
        Object.keys(dataReturned).length === 0
      ) {
        console.log('The data sent by the server is invalid');
        return;
      }
      const imageList = dataReturned.data.hits;
      const totalResultsNr = dataReturned.data.totalHits;
      if (totalResultsNr === 0) {
        failureCase();
        return;
      } else {
        successfulCase(totalResultsNr);
      }
      return imageList;
    })
    .then(images => {
      //   console.log(images);
      saveResults(images);
      return images;
    })
    .then(images => {
      //   console.log(images);
      return createCardList(images);
    })
    .then(imageCards => {
      console.log(imageCards);
      addCards(imageCards);
    })
    .catch(err => {
      console.log('An error occurred while loading the images', err);
    })
    .finally(() => {
      console.log('Cards have been created successfully');
    });
}

async function searchResults(term, page) {
  try {
    // if(term = "" ) {

    // }
    const requestedData = await getImages(term, page);
    console.log(requestedData);
    return requestedData;
  } catch (err) {
    console.log('The data request made to the server failed', err);
  }
}

function failureCase() {
  console.log('No results were found');
  Notify.failure(
    'Sorry, there are no image matching your search query. Please try again.'
  );
}

function saveResults(results) {
  imagesLoaded.push(results);
  //   console.log(imagesLoaded);
}

function createCardList(cards) {
  console.log(cards);
  const cardList = cards.reduce(
    (imageCards, image) => renderCard(image) + imageCards,
    ' '
  );
  console.log(cardList);
  return cardList;
}
function successfulCase(resultsNr) {
  console.log(`I found ${resultsNr} results`);
  Notify.success(`Hooray! We found ${resultsNr} images`);
}

function renderCard(cardInfo) {
  console.log(cardInfo);
  const {
    webformatURL,
    largeImageURL,
    tags,
    likes,
    views,
    comments,
    downloads,
  } = cardInfo;
  //   console.log(
  //     tags,
  //     likes,
  //     views,
  //     comments,
  //     downloads,
  //     largeImageURL,
  //     webformatURL
  //   );
  //   debugger;
  return `
  <div class="photo-card">
  <div class="photo">
  <a href="${largeImageURL}" class="gallery__link">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" />
  </a>
  </div>
  <div class="info">
  <p class="info-item">
  <b>Likes</b>
  <span>${likes}</span>
  </p>
  <p class="info-item">
  <b>Views</b>
  <span>${views}</span>
  </p>
  <p class="info-item">
  <b>Comments</b>
  <span>${comments}</span>
  </p>
  <p class="info-item">
  <b>Downloads</b>
  <span>${downloads}</span>
  </p>
  </div>
  </div>
  `;
}

function addCards(cards) {
  gallery.innerHTML = cards;
}

// searchResults('2', 1);
