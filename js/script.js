let bulletsSpansContainer=document.querySelector(".quiz-app .bullets .spans");
let quizArea=document.querySelector(".quiz-area");
let answersArea=document.querySelector(".answers-area");
let sumbitButton=document.querySelector(".submit-button");
let prevButton=document.querySelector(".prev-button");
let spanBullets=document.querySelector(".bullets .spans");
let resultsDiv=document.querySelector(".results");
let counter=document.querySelector(".countdown");
let currentIndex=0;
let rightAnswers=0;
let countInterval;
function getQuestions(){
 let myRequest= new XMLHttpRequest();
 myRequest.onload=function(){
  if(this.status===200 && this.readyState===4){
    let questionObject=JSON.parse(this.responseText);
    let questionsCount=questionObject.length;
    createBullets(questionsCount);
    addQuestion(questionObject[currentIndex],questionsCount);
    checkPrev();
    //submit onclick
    countDown(30,questionsCount);
    sumbitButton.onclick=()=>{
      check(questionObject[currentIndex]);
      currentIndex++;
      checkPrev();
      //remove question
      quizArea.innerHTML="";
      answersArea.innerHTML="";
      //add the next question
      addQuestion(questionObject[currentIndex],questionsCount);
      //handle bullets
      onHandleBullets();
      showResult(questionsCount);
    }
    prevButton.onclick=()=>{
      checkPrev();
      rightAnswers--;
      currentIndex--; 
      checkPrev();
      quizArea.innerHTML="";
      answersArea.innerHTML="";
      //add the next question
      addQuestion(questionObject[currentIndex],questionsCount);
      offHandleBullets(); 
    }
  }
 };
 myRequest.open("GET","./questions.json",true);
 myRequest.send();
}

getQuestions();
function createBullets(num){
  for(let i=0;i<num;++i){
    let span=document.createElement("span");
    bulletsSpansContainer.appendChild(span);
    if(i===0){
      span.className="on";
    }
  }
}
function addQuestion(obj,qcount){
if(currentIndex<qcount){
  let question=document.createElement("h2");
  let questionText=document.createTextNode(obj.title);
  question.appendChild(questionText);
  quizArea.appendChild(question);

  for(let i=1;i<=4;++i){
    //create main-div
    let mainDiv=document.createElement("div");
    mainDiv.className="answer";
    //create input
    let radioInput=document.createElement("input");
    //add id class and dataset
    radioInput.name="answer";
    radioInput.type="radio";
    radioInput.id=`answer_${i}`;
    radioInput.answer=obj[`answer_${i}`];
    //create label
    let answerLabel=document.createElement("label");
    answerLabel.htmlFor=`answer_${i}`;
    answerLabel.appendChild(document.createTextNode(obj[`answer_${i}`]));
    mainDiv.appendChild(radioInput);
    mainDiv.appendChild(answerLabel);
    answersArea.appendChild(mainDiv);
  }
}
}
//check answer function
function check(question){
  let rightAnswer=question.right_answer;
  let answersArray=document.getElementsByName("answer");
  let theChosenAnswer;
  for(let i=0;i<answersArray.length;++i){
    if(answersArray[i].checked){
      theChosenAnswer=answersArray[i].answer;
    }
  }
  if(theChosenAnswer===rightAnswer){
    rightAnswers++;
  }
}
//handle bullets function add on
function onHandleBullets(){
  let bullets=document.querySelectorAll(".bullets .spans span");
  let bulletsArray=Array.from(bullets);
  bulletsArray.forEach((bullet,index)=>{
    if(index===currentIndex){
      bullet.classList.add("on");
    }
  })
}
//handle bullets function add off
function offHandleBullets(){
  let bullets=document.querySelectorAll(".bullets .spans span");
  let bulletsArray=Array.from(bullets);
  bulletsArray.forEach((bullet,index)=>{
    if(index===currentIndex+1){
      bullet.classList.remove("on");
    }
  })

}
//show result function
function showResult(qcount){ 
  if(currentIndex===qcount){
    quizArea.remove();
    answersArea.remove();
    prevButton.remove();
    sumbitButton.remove();
    spanBullets.remove();
    counter.remove();
    document.querySelector(".category").remove();
    document.body.style.backgroundColor="#FDCEDF";
    resultsDiv.classList.remove("d-none");
    if(rightAnswers>(qcount/2) && rightAnswers<qcount){
      resultsDiv.innerHTML=`<span class="Good">Good</span>, You Got ${rightAnswers} out of ${qcount}`;
    }else if(rightAnswers===qcount){
      resultsDiv.innerHTML=`<span class="Perfect">Perfect</span>, You Got ${rightAnswers} out of ${qcount}`;
    }else{
      resultsDiv.innerHTML=`<span class="Bad">Bad</span>, You Got ${rightAnswers} out of ${qcount}`;
    }
  }
}
//count down function
function countDown(duration,qcount){
  if(currentIndex<qcount){
    let minutes,seconds;
    countInterval=setInterval(function(){
      minutes=parseInt(duration/60);
      seconds=parseInt(duration%60);
      minutes=minutes<10?`0${minutes}`:minutes;
      seconds=seconds<10?`0${seconds}`:seconds;
      counter.innerHTML=`${minutes}:${seconds}`;
      if(--duration<0){
        clearInterval(countInterval);
        currentIndex=qcount-1;
        sumbitButton.click();
      }
    },1000)
  }
}
function checkPrev(){
  if(currentIndex===0){
    prevButton.classList.add("pointer-none");
    rightAnswers=0;
  }else{
    prevButton.classList.remove("pointer-none");
  }
}

