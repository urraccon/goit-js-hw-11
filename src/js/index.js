import { getImages } from './image-api.js';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const searchInput = document.querySelector("[name = 'searchQuery']");
// console.dir(searchInput);
const searchBtn = document.querySelector("[type = 'submit']");
// console.dir(searchBtn);
const gallery = document.querySelector('div.gallery');
const searchBox = document.querySelector('form.search-form');
const loadMoreBtn = document.querySelector('button.load-more');
// console.dir(loadMoreBtn);
let imageList = [];
let imagesPage = 1;
let filledText = '';
// console.dir(searchBox);

searchBox.addEventListener('submit', pressBtn);

function pressBtn(inputField) {
  //   debugger;
  //   console.log(inputValue);
  inputField.preventDefault();
  filledText = inputField.target[0].value;
  //   console.log(searchWord);
  newSearch(filledText);
}

//
function newSearch(term) {
  clearResults();
  loadResults(term);
}

//

// dispaly results
function loadResults(term) {
  //   debugger;
  //   clearPage();
  new Promise(resolve => {
    resolve(imageSearch(term, imagesPage));
  })
    .then(dataReturned => {
      if (
        dataReturned === undefined ||
        Object.keys(dataReturned).length === 0
      ) {
        console.log('The data sent by the server is invalid');
        return;
      }
      const searchResults = dataReturned.data.hits;
      //   console.log(searchResults);
      const totalResultsNo = dataReturned.data.totalHits;
      const loadedResultsNo = imageList.length;
      if (loadedResultsNo > 0) {
        if (loadedResultsNo === totalResultsNo) {
          noNewResults();
        }
      }
      if (imagesPage < 2) {
        if (totalResultsNo === 0) {
          failureCase();
          return;
        } else {
          successfulCase(totalResultsNo);
        }
      }
      return searchResults;
    })
    .then(images => {
      // console.log(images);
      return addResultsToResultsList(images);
    })
    .then(images => {
      //   console.log(images);
      return createCardList(images);
    })
    .then(imageCards => {
      //   console.log(imageCards);
      addCardsToPage(imageCards);
    })
    .then(showLoadMoreBtn)
    .catch(err => {
      console.log('An error occurred while loading the images', err);
    })
    .finally(() => {
      console.log('Cards have been created successfully');
    });
}
//------------------------------------------------------------------

// search results
async function imageSearch(term, page) {
  try {
    // if(term = "" ) {

    // }
    const requestedData = await getImages(term, page);
    // console.log(requestedData);
    return requestedData;
  } catch (err) {
    console.log('The data request made to the server failed', err);
  }
}
//------------------------------------------------------------------

function failureCase() {
  console.log('No results were found');
  Notify.failure(
    'Sorry, there are no image matching your search query. Please try again.'
  );
}

function addResultsToResultsList(results) {
  //   debugger;
  imageList = imageList.concat(results);
  return imageList;
  //   console.log(imagesLoaded);
}

function createCardList(items) {
  //   console.log(cards);
  //   debugger;
  return items.reduce((itemCards, item) => renderCard(item) + itemCards, ' ');
  //   console.log(cardList);
  //   return cardList;
}
function successfulCase(resultsNr) {
  console.log(`I found ${resultsNr} results`);
  Notify.success(`Hooray! We found ${resultsNr} images`);
}

function renderCard(cardInfo) {
  // console.log(cardInfo);
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

function addCardsToPage(cards) {
  gallery.innerHTML = cards;
}

function hideLoadMoreBtn() {
  loadMoreBtn.classList.add('hidden');
}

function showLoadMoreBtn() {
  loadMoreBtn.classList.remove('hidden');
}

function clearResults() {
  imagesPage = 1;
  imageList = [];
  hideLoadMoreBtn();
}

function noNewResults() {
  hideLoadMoreBtn();
  console.log('No new results found');
  Notify.warning(`We're sorry, but you've reached the end of search results.`);
}

function nextPage() {
  imagesPage += 1;
}
// searchResults('2', 1);

// load more results

loadMoreBtn.addEventListener('click', loadMoreResults);
function loadMoreResults() {
  hideLoadMoreBtn();
  loadResults(filledText);
  nextPage();
}
//------------------------------------------------------------------
