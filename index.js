const BASE_URL = 'https://movie-list.alphacamp.io'
const INDEX_URL = BASE_URL + '/api/v1/movies/'
const POSTER_URL = BASE_URL + '/posters/'
const movies = []
let filteredMovies = []
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
            <button type="button" class="btn btn-info btn-add-favorite" data-id=${item.id} >+</button>
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
    else if (event.target.matches('.btn-add-favorite')) {
      // console.log(event.target.dataset.id)
      addToFavorite(Number(event.target.dataset.id))
    }
  })
  //把喜歡的電影放進清單裡
  function addToFavorite(id) {
    console.log(id)
    const list = JSON.parse(localStorage.getItem('favoriteMovies')) || []
    const movie = movies.find((movie) => movie.id === id)
    if (list.some((movie) => movie.id === id)) {
      return alert('此電影已經在收藏清單中！')
    }
    list.push(movie)
    localStorage.setItem('favoriteMovies', JSON.stringify(list))
    console.log(movie)

  }
  
  //監聽搜尋
  const searchForm = document.querySelector('#search-form')
  const searchInput = document.querySelector('#search-input')
  
  searchForm.addEventListener('submit', function onSearchFormSubmitted(event){
    const keyword = searchInput.value.trim().toLowerCase()
    let filteredMovies = []
    
    //條件篩選
    filteredMovies = movies.filter(movie =>
      movie.title.toLowerCase().includes(keyword)
    )   
    if (keyword.length === 0) {
      return alert(`您輸入的關鍵字：${keyword} 沒有符合條件的電影`)
    }

    renderPaginator(filteredMovies.length)
    renderMovieList(filteredMovies)

  });
   //按more 顯示電影詳細資料
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

//分割頁面
const MOVIES_PER_PAGE = 12

//以12個電影來渲染畫面（每頁12個出現在一頁之中）
function getMovieByPage(page) {
  //先算出要分割的起點
  // 1 => 0~11
  // 2 => 12~23
  // 3 => 24~35
  const data = filteredMovies.length ? filteredMovies : movies
  const starIndex = (page - 1) * MOVIES_PER_PAGE
  return data.slice(starIndex, MOVIES_PER_PAGE + starIndex) //兩個參數 開始點，結束點
};

//處理分頁器
const paginator = document.querySelector('#paginator')

function renderPaginator(amount){
  const numberOfPages = Math.ceil(amount / MOVIES_PER_PAGE)
  //製作 template 
  let rawHTML = ''

  for (let page = 1; page <= numberOfPages; page++) {
    rawHTML += `<li class="page-item"><a class="page-link" href="#" data-page="${page}">${page}</a></li>`
  }
  //放回 HTML
  paginator.innerHTML = rawHTML
}

//分頁的監聽器，點擊分頁數會出現相對應得12個電影資料
paginator.addEventListener('click', function onPaginatorClicked(event){
 if(event.target.tagName !== 'A') return 
//  console.log(event.target.dataset.page)
  renderMovieList(getMovieByPage(Number(event.target.dataset.page)))

});



axios
  .get(INDEX_URL) // 修改這裡
  .then((response) => {
    movies.push(...response.data.results)
    // console.log(response)
    // console.log(response.data)
    // console.log(response.data.results)
    // console.log(movies)
    // 渲染電影清單資料
    renderPaginator(movies.length)
    renderMovieList(getMovieByPage(1))
  })
  .catch((err) => console.log(err))



