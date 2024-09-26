let optString = "";
const [btnMine, btnPopular] = document.querySelectorAll("nav button");
const [_, inputSearch, btnSearch] = document.querySelector(".searchBox").children;

fetchFlickr({ type: "mine" });
btnMine.addEventListener("click", () => fetchFlickr({ type: "mine" }));
btnPopular.addEventListener("click", () => fetchFlickr({ type: "interest" }));

btnSearch.addEventListener("click", () => {
	if (!inputSearch.value) return;
	fetchFlickr({ type: "search", tags: inputSearch.value });
	inputSearch.value = "";
});

document.body.addEventListener("click", e => {
	if (e.target.className === "thumb") createModal(e);
	if (e.target.className === "btnClose") removeModal();
	if (e.target.className === "userID") fetchFlickr({ type: "user", userID: e.target.innerText });
});

function fetchFlickr(opt) {
	//참조링크 비교가 아닌 값 자체를 비교하기 위해서
	//opt객체를 강제로 문자화해서 stringifyOpt변수에 저장
	let stringifyOpt = JSON.stringify(opt);
	//문자화된 옵션객체 자체를 비교처리
	if (stringifyOpt === optString) return;
	//문자화된 옵션 객체를 전역변수는 optString에 저장해서 다음번 비교에 사용
	optString = stringifyOpt;

	const api_key = "21e294ad0ec03a32d7355980457d9e11";
	const baseURL = `https://www.flickr.com/services/rest/?api_key=${api_key}&method=`;
	const myID = "197119297@N02";
	const method_mine = "flickr.people.getPhotos";
	const method_interest = "flickr.interestingness.getList";
	const method_search = "flickr.photos.search";

	let url_mine = `${baseURL}${method_mine}&user_id=${myID}&nojsoncallback=1&format=json`;
	let url_user = `${baseURL}${method_mine}&user_id=${opt.userID}&nojsoncallback=1&format=json`;
	let url_interest = `${baseURL}${method_interest}&nojsoncallback=1&format=json`;
	let url_search = `${baseURL}${method_search}&tags=${opt.tags}&nojsoncallback=1&format=json`;

	let result_url = "";

	if (opt.type === "mine") result_url = url_mine;
	if (opt.type === "interest") result_url = url_interest;
	if (opt.type === "user") result_url = url_user;
	if (opt.type === "search") result_url = url_search;

	fetch(result_url)
		.then(data => data.json())
		.then(json => {
			const picArr = json.photos.photo;
			createList(picArr);
		});
}

function createList(dataArr) {
	const list = document.querySelector(".list");
	let tags = "";

	dataArr.forEach(pic => {
		tags += `
        <li>
          <figure class='pic'>
            <img class='thumb' src="https://live.staticflickr.com/${pic.server}/${pic.id}_${pic.secret}_z.jpg" alt="https://live.staticflickr.com/${pic.server}/${pic.id}_${pic.secret}_b.jpg" />
          </figure>
          <h2>${pic.title}</h2>

          <div class='profile'>
            <img src='http://farm${pic.farm}.staticflickr.com/${pic.server}/buddyicons/${pic.owner}.jpg' alt=${pic.owner} /> <span class='userID'>${pic.owner}</span>
          </div>
        </li>
      `;
	});

	list.innerHTML = tags;

	setDefImg();
}

function setDefImg() {
	const profilePic = document.querySelectorAll(".profile img");
	console.log(profilePic);

	profilePic.forEach(imgEl => (imgEl.onerror = () => imgEl.setAttribute("src", "https://www.flickr.com/images/buddyicon.gif")));
}

function createModal(e) {
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

function removeModal() {
	document.querySelector(".modal").remove();
}
