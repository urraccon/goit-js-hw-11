import axios from 'axios';

const API_KEY = '41393795-c06419c206da666f6a710e150';
const API_URL = 'https://pixabay.com/api/';
// const ORIGIN_DOMAIN = 'http://localhost:1234';
axios.defaults.baseURL = API_URL;
// axios.defaults.headers.common['Access-Control-Allow-Origin'] = ORIGIN_DOMAIN;
axios.defaults.headers.post['Content-Type'] = 'application/json';
let requestResult = '';

async function getImages(searchTerm, page) {
  try {
    console.log(searchTerm);
    if (searchTerm.includes(' ')) {
      const searchTermURL = searchTerm.split(' ').join('+');
      console.log(searchTermURL);
      requestResult = await axios.get(
        `/?key=${API_KEY}&q=${searchTermURL}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`
      );
    } else {
      requestResult = await axios.get(
        `/?key=${API_KEY}&q=${searchTerm}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`
      );
    }

    console.log(
      'I found more results for the entered search term: ',
      requestResult
    );
    return requestResult;
  } catch (err) {
    console.log('The request to the server failed because: ', err);
  }
}

// getImages('cat breeds', 2);

export { getImages };
