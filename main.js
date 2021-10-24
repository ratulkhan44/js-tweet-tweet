//Select Element
let formElm=document.querySelector('form');
let tweetInputElm=document.querySelector('.tweet-input');
let addTweetBtnElm=document.querySelector('.add-tweet-btn');
let searchTweetElm=document.querySelector('#search-tweet');
let tweetUlElm=document.querySelector('.collection');
let tweetLiElm=document.querySelector('.collection-tweet');
let tweetNoElm=document.querySelector('.tweet-no');
let tweetElm=document.querySelector('.tweet');
let deleteTweetIconElm=document.querySelector('.delete-tweet-icon');
let msgElm=document.querySelector('.msg');

let tweetDataStore=getDataFromLocalStorage();
function getDataFromLocalStorage(){
    let tweets='';
    if(localStorage.getItem('tweetsData') === null){
        tweets=[];
    }else{
        tweets=JSON.parse(localStorage.getItem('tweetsData'));
    }
    return tweets;
}

function loadEventListener(){
    window.addEventListener('DOMContentLoaded',showTweetListData.bind(null,tweetDataStore));
    formElm.addEventListener('click',addOrUpdateTweet);
    tweetUlElm.addEventListener('click',editOrDeleteTweet);
    searchTweetElm.addEventListener('keyup',searchTweet);
}

function displayMessage(remove=false,message='',){
    if(remove){
        msgElm.style.display='none';
    }else{
        msgElm.style.display='block';
        msgElm.textContent=message;
    }
}

function showTweetLi(tweetData){
    tweetData.forEach(({id,tweet})=>{
        let tweetLi=document.createElement(('li'));
        tweetLi.id=id
        tweetLi.className='list-group-item collection-tweet';
        tweetLi.innerHTML=`
        <strong class="tweet-no">${id}.</strong class="tweet"><strong>${tweet}</strong>
        <i class="fa fa-trash float-right delete-tweet-icon mx-3"></i>
        <i class="fa fa-edit float-right edit-tweet-icon"></i>
        `;
        tweetUlElm.appendChild(tweetLi);
    });
}

function showTweetListData(tweetData){
    tweetUlElm.innerHTML='';
    if(tweetData.length > 0){
        showTweetLi(tweetData);
        displayMessage(true);
    }else{
        displayMessage(false,'No Tweet At This Moment!!');
    }
}

editOrDeleteTweet=(e)=>{
    if(e.target.classList.contains('delete-tweet-icon')){
        e.preventDefault();
        if(confirm('Are you Want to delete this Tweet??')){
            let targetDeleteElm=e.target.parentElement;
            let tweetId=parseInt(targetDeleteElm.id);
            let tweets=JSON.parse(localStorage.getItem('tweetsData'));
            if(tweetId){
                let filterTweetByOwn=tweets.filter((tweet)=>{
                    return tweet.id !== tweetId;
                });
                targetDeleteElm.remove();
                localStorage.setItem('tweetsData',JSON.stringify(filterTweetByOwn));
                if(filterTweetByOwn.length === 0) location.reload();
            }
        }
    }else if(e.target.classList.contains('edit-tweet-icon')){
        e.preventDefault();
        let targetEditElm=e.target.parentElement;
        let tweetId=parseInt(targetEditElm.id);
        if(tweetId){
            let editTweet=tweetDataStore.find((tweet)=> tweet.id === tweetId);
            populateEditFormUI(editTweet);
        }
    }
}


addOrUpdateTweet=(e)=>{
    if(e.target.classList.contains('add-tweet-btn')){
        addTweet(e);
    }else if(e.target.classList.contains('edit-tweet-btn')){
        updateTweet(e);
    }
};

function saveDataToLocalStorage(tweet){
    let myTweet='';
    if(localStorage.getItem('tweetsData') === null){
        myTweet=[];
        myTweet.push(tweet);
        localStorage.setItem('tweetsData',JSON.stringify(myTweet));
    }else{
        myTweet=JSON.parse(localStorage.getItem('tweetsData'));
        myTweet.push(tweet);
        localStorage.setItem('tweetsData',JSON.stringify(myTweet));
    }
}

addTweet=(e)=>{
    let tweetInputValue=tweetInputElm.value;
    let id;
    if(tweetDataStore.length === 0){
        id=1;
    }else{
        id=tweetDataStore[tweetDataStore.length-1].id+1;
    }
    if(tweetInputValue === ''){
        alert('Plaese Fill Up necessary and Valid information');
    }else{
        let tweet={
            id:id,
            tweet:tweetInputValue,
        }
        saveDataToLocalStorage(tweet)
        tweetInputElm.value='';
        showTweetListData(tweetDataStore);
    }   
};

function resetUI(){
    document.querySelector('.edit-tweet-btn').remove();
    document.querySelector('#id').remove();
    addTweetBtnElm.style.display='block';
}

updateTweet=(e)=>{
    let tweetInputValue=tweetInputElm.value;
    console.log(tweetInputValue);
    let id=parseInt(document.getElementById('id').value);
    
    if(tweetInputValue === ''){
        alert('Plaese Fill Up necessary and Valid information');
    }else{
        let updatedTweet=tweetDataStore.map((tweet)=>{
            if(tweet.id === id){
                return {
                    ...tweet,
                    tweet:tweetInputValue
                };
            }else {
                return tweet;
            }
        })
        console.log(updatedTweet);
        localStorage.removeItem('tweetsData');
        localStorage.setItem('tweetsData',JSON.stringify(updatedTweet));
        tweetData=getDataFromLocalStorage();
        console.log(tweetData);
        showTweetListData(tweetData);
        tweetInputElm.value='';
        resetUI();
        location.reload();
    }
};

function populateEditFormUI(editedTweet){
    tweetInputElm.value=editedTweet.tweet;
    addTweetBtnElm.style.display='none';
    let updateBtnElm= `<button class="btn mt-3 btn-block btn-info edit-tweet-btn">Update</button>`;
    let updateInputElm=`<input type="hidden" id="id" value=${editedTweet.id}>`;
    if(!document.querySelector('#id')){
        formElm.insertAdjacentHTML('beforeend',updateInputElm);
    }else{
        document.querySelector('#id').remove();
        formElm.insertAdjacentHTML('beforeend',updateInputElm);
    }
    if(!document.querySelector('.edit-tweet-btn')){
        formElm.insertAdjacentHTML('beforeend',updateBtnElm);
    }
}



searchTweet = (e) =>{
    let searchInputValue=searchTweetElm.value.toLowerCase();
    let count=0;
    document.querySelectorAll('.collection .collection-tweet').forEach((tweet)=>{
        let foundTweet=tweet.firstElementChild.nextSibling.textContent.toLowerCase();
        if(foundTweet.indexOf(searchInputValue) === -1){
            tweet.style.display='none';
        }else{
            tweet.style.display='block';
            count++;
        }
    });
    count > 0 ? displayMessage(true) : displayMessage(false,'No Tweet Found');
}


loadEventListener();




