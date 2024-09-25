const list = document.querySelector(".list");
const api_key = "21e294ad0ec03a32d7355980457d9e11";
const baseURL = `https://www.flickr.com/services/rest/?api_key=${api_key}&method=`;
const myID = "197119297@N02";
const method_mine = "flickr.people.getPhotos";
let url = `${baseURL}${method_mine}&user_id=${myID}&nojsoncallback=1&format=json`;

fetch(url)
  .then((data) => data.json())
  .then((json) => {
    const picArr = json.photos.photo;
    let tags = "";

    picArr.forEach((pic) => {
      tags += `
        <li>
          <figure class='pic'>
            <img class='thumb' src="https://live.staticflickr.com/${pic.server}/${pic.id}_${pic.secret}_z.jpg" alt="https://live.staticflickr.com/${pic.server}/${pic.id}_${pic.secret}_b.jpg" />
          </figure>
          <h2>${pic.title}</h2>

          <div class='profile'>
            <img src='http://farm${pic.farm}.staticflickr.com/${pic.server}/buddyicons/${pic.owner}.jpg' alt=${pic.owner} /> <span>${pic.owner}</span>
          </div>
        </li>
      `;
    });

    list.innerHTML = tags;
  });

//미션1 - 현재 img.thumb을 클릭시 레이어모달이 생성됨 처리
//미션2 - 동적으로 생성된 레이어팝업의 닫기버튼 클릭시 레이어모달 제거
//미션3 - img.thumb의 alt속성에 숨겨놓은 큰해상도의 이미지 url을 레이어모달 안에 출력

document.body.addEventListener("click", (e) => {
  if (e.target.className === "thumb") {
    console.log(e.target);

    const imgSrc = e.target.getAttribute("alt");

    const modal = document.createElement("aside");
    modal.classList.add("modal");
    modal.innerHTML = `
      <div class='con'>
        <img src=${imgSrc} />
      </div>
      <button class='btnClose'>CLOSE</button>
    `;

    document.body.append(modal);
  }
});

document.body.addEventListener("click", (e) => {
  if (e.target.className === "btnClose") {
    document.querySelector(".modal").remove();
  }
});
