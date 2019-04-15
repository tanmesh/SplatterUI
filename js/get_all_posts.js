//Set up instafeed

function getAllPosts(authorEmailId) {
    fetch('http://localhost:39114/user_post/get_all?authorEmailId=' + authorEmailId).then(res => {
            if (!res.ok) {
                return [];
            }
            return res.json();
        },
        error => {
            console.log(error);
            return [];

        }).then(res => {
        fillData(res)
    }).catch(error => {
        console.log(error);
        fillData([])
    })
}

function fillData(data) {
    const $instafeed = document.getElementById('instafeed');
    if (data.length > 0) {
        $instafeed.innerHTML = '';
        data.forEach(post => {
                $instafeed.innerHTML = $instafeed.innerHTML + `<div class="col-12 col-sm-6 col-md-4 col-lg-3">
                       <div class="photo-box">
                        <div class="image-wrap">
                            <a href="{{link}}">
                                <img src="data:image/jpeg;base64,${post.encodedImg}">
                            </a>
                            <div class="likes">${post.upVotes} Likes</div>
                        </div>
                        <div class="description">
                            {{caption}}
                            <div class="date">
                                {{model.date}}
                            </div>
                        </div>
                    </div>
                </div>`
            }
        )
    } else {

        $instafeed.innerHTML = 'No Data!';
    }
}

getAllPosts('tanmeshnm@gmail.com');