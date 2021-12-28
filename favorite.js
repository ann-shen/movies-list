const BASE_URL = 'https://movie-list.alphacamp.io'
const INDEX_URL = BASE_URL + '/api/v1/movies/'
const POSTER_URL = BASE_URL + '/posters/'
const movies = JSON.parse(localStorage.getItem('favoriteMovies')) || []


function renderMovieList(data) {
  const dataPanel = document.querySelector('#data-panel')
  let dataPanel_content = ``
  data.forEach((item) => {
    dataPanel_content +=
  `
    <div class="col-sm-3">
      <div class="mb-2">
        <div class="card ">
          <img src="${POSTER_URL + item.image}" class="card-img-top" alt="...">
          <div class="card-body">
            <h5 class="card-title">${item.title}</h5>
          </div>
          <div class="card-footer">
            <button type="button" class="btn btn-primary btn-show-movie" data-bs-toggle="modal" data-id=${item.id} data-bs-target="#exampleModal">MORE</button>
            <button type="button" class="btn btn-danger btn-add-delete" data-id=${item.id} > x </button>
          </div>
        </div>
      </div>
    </div>
  `
    // console.log(item)
  });

  dataPanel.innerHTML = dataPanel_content

  // 監聽 data panel 按more有更多電影資料
  dataPanel.addEventListener('click', function onPanelClicked(event) {
    if (event.target.matches('.btn-show-movie')) {
      console.log(event.target.dataset.id)
      showMovieModal(event.target.dataset.id)
    }
    else if (event.target.matches('.btn-add-delete')) {
      // console.log(event.target.dataset.id)
      removeFavorite(Number(event.target.dataset.id))
    }
  })
  
  function removeFavorite(id){
    const movieIndex = movies.findIndex((movie) => movie.id === id)
    if (movieIndex === -1) return
    //刪除該筆電影
    movies.splice(movieIndex, 1)
    localStorage.setItem('favoriteMovies', JSON.stringify(movies))
    renderMovieList(movies)

  }
  

  function showMovieModal(id) {
    const modalTitle = document.querySelector('#exampleModalLabel')
    const modalImage = document.querySelector('#movie-modal-image')
    const modalDate = document.querySelector('#movie-modal-date')
    const modalDescription = document.querySelector('#movie-modal-description')
    axios.get(INDEX_URL + id).then((response) => {
      const data = response.data.results
      modalTitle.innerText = data.title
      modalDate.innerText = 'Release date: ' + data.release_date
      modalDescription.innerText = data.description
      modalImage.innerHTML = `<img src="${POSTER_URL + data.image
        }" alt="movie-poster" class="img-fluid">`
    })
  }



}


renderMovieList(movies)

