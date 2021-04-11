/*
   DOM 요소 접근에 숙련되기 위해 만든 js코드이다.
  연습할 함수,프로퍼티에 따라 윗줄에 주석으로 제목을 달고
  각 부분을 블록으로 나눠서 변수가 겹치지 않도록 하였다.
*/

/* childNode로 접근할 때, 브라우저 마다 차이가 존재하므로
 nodeType을 검사하여 요소가 맞는지 확인해야 한다고 한다.*/

const myColor={
  _black:"#101010",
  _white:"#F0F0F0",
  _gray:"#C0C0C0",
  _blue:"#6060F0",
  _yellow:"#C0C030",
  _green:"#20E020",
}

const body = document.body;
body.style.backgroundColor=myColor._white;
body.innerHTML="This is Body";
body.style.display="flex";
body.style.flexFlow="column nowrap";

/* parent 요소 생성 */
{
  const parentNum=5;
  for(let i=0;i<parentNum;i++)
  {
    const parent = document.createElement("div");
    parent.innerHTML="This is a parent";
    parent.style.backgroundColor= myColor._blue;
    parent.style.color=myColor._white;
    parent.style.marginLeft="10px";
    parent.className="parent";
    parent.id="parent"+i;
    body.appendChild(parent);
  }
}

/* childNodes로 접근 */
{
  const childNum=5;
  for(let pi=0;pi<body.childNodes.length;pi++){ //childNodes의 length 프로퍼티를 이용해 for문으로 접근 가능
    if(body.childNodes[pi].nodeType===3) continue; //모든 요소의 firstNode는 text노드이므로 건너뛴다.
    for(let ci=0;ci<childNum;ci++){
      const child = document.createElement("li");
      child.innerHTML="child";
      child.style.backgroundColor = myColor._yellow;
      child.style.margin="5px 10px";
      child.list_style="none";
      child.className="child";
      body.childNodes[pi].appendChild(child);
    }
  }
}

/* 특정 노드만 건드리기(홀수 인덱스) */
{
  const idForSelect="#parent0"
  const selectedParent = document.querySelector(idForSelect);
  const spChilds = selectedParent.childNodes;
  for(let i=0;i<spChilds.length;i++){
    if(i%2===0) continue;
    spChilds[i].style.backgroundColor = myColor._green;
    spChilds[i].innerHTML="hello";
  }

  /* insertBefore */
  const lastChildDescript = document.createElement("h1");
  lastChildDescript.innerHTML="Test of insertBefore lastParent";
  lastChildDescript.className="insertBefore";
  body.insertBefore(lastChildDescript,body.lastChild); //넣을 노드, 바로 뒷 노드
}

/* setAttributeNode 속성값지정(CSS문법)*/
{
  const lastParent = body.lastChild;
  for(let i=0;i<lastParent.childNodes.length;i++){
    if(lastParent.childNodes[i].nodeType==3) continue;
    const newStyleAttribute=document.createAttribute("style"); //새로운 style 속성
    newStyleAttribute.value="background:rgb(255,255,128); color:black; margin:10px"; //속성값 지정(CSS문법)
    lastParent.childNodes[i].setAttributeNode(newStyleAttribute);
  }
}

/* removeAttribute & forEach로 각 원소 접근해보기*/
{
  const secondParent = body.childNodes[2];
  
  secondParent.childNodes[0].insertData(
    secondParent.childNodes[0].length," for setAttributeNode('style')"
    );
    
    for( i of secondParent.childNodes){
      if(i.nodeType!==3) //firstNode는 textNode이므로 제외
      {
        i.removeAttribute("style");
        const newStyle=document.createAttribute("style");
        newStyle.value="color:brown; list-style:none; margin:10px;";
        i.setAttributeNode(newStyle);
        //secondParent.childNodes[index].setAttribute("style","color:red;");// 이 형태도 가능
      }
    }

  /* arr로 바꿔서 접근하는 방법도 존재 */
  //const arrChilds = Array.from(secondParent.childNodes); //forEach를 위해 배열로 변경
  // arrChilds.forEach((value,index)=>{
  //   if(value.nodeType!==3) //firstNode는 textNode이므로 제외
  //   {
  //     secondParent.childNodes[index].removeAttribute("style");
  //     const newStyle=document.createAttribute("style");
  //     newStyle.value="color:brown; list-style:none; margin:10px;";
  //     secondParent.childNodes[index].setAttributeNode(newStyle);
  //     //secondParent.childNodes[index].setAttribute("style","color:red;");// 이 형태도 가능
  //   }
  // });
}

/* nodeValue & insertData & replaceData */
{
  /* 인덱스를 3으로 나눈 나머지에 따라 다른 출력을 한다. */
  const thirdParent = body.childNodes[3];
  const arrChilds = Array.from(thirdParent.childNodes); //인덱스를 구하기 위해 배열로 (원래는 for of문을 써도 됨)
  arrChilds.forEach((value,index)=>{
    if(index===0) return; //forEach문에서 return문이 continue의 역할을 하게 된다.
    const mod = index%3;
    switch(mod){
      case 0: 
        thirdParent.childNodes[index].firstChild.nodeValue="nodeValue";
        break;
      case 1:
        thirdParent.childNodes[index].firstChild.insertData(2," insertData "); //index 2부터 " insertData "를 삽입한다.
        break;
      case 2:
        thirdParent.childNodes[index].firstChild.replaceData(2,1," replaceData "); // index 2부터 1글자를 " RP "로 교체한다.
        break;
    }
  });
}


/* replaceNode & cloneNode */
{
  /*
  설명 : 각 리스트 요소를 순서대로 빨간 배경의 childForReplace의 복사본으로 교체
  */
 
  //복사할 요소, 빨간 배경을 가진다.
  const childForReplace = document.createElement("li");
  childForReplace.setAttribute("style","background:red;");
 
  let timeoutId, i=1,j=1,pi=0,pj=0; //timeoutId: setInterval 중단을 위한 값 , i,j : 복사본 넣을 위치, pi,pj : 복구를 위한 직전 i,j의 인덱스
  
  function circulateChilds(){
      timeoutId = setInterval(changeNode,500); //n miliseconds 간격으로 반복
  }

  let tmpNode; // 복구를 위한 임시 노드

  //반복하는 코드 : 순차적으로 각 li의 배경을 빨간색으로 만든다.
  function changeNode(){
    console.log(`${i} , ${j} : ${body.childNodes[i].childNodes[j]}`);
    if(body.childNodes[i].childNodes[j]===undefined){  //body의 자식노드 중 insertBefore Test 문은 자식개수가 텍스트노드(인덱스 0) 하나뿐이므로 오류 방지 
      i++;
      if(i>=body.childNodes.length){  // 모든 parent를 순회했다면
        clearInterval(timeoutId); //setInterval을 중지
        // 최종적으로 이전 노드를 원상복구해준다. 
        body.childNodes[pi].replaceChild(tmpNode,body.childNodes[pi].childNodes[pj]);
      }
      return;
    }
    if(body.childNodes[i].childNodes[j].className!=="child") // .child의 경우에만 작동
    {
      j++;
      return;
    }
    
    if(!(pi===0&&pj===0)){ //최초에는 복구를 수행하지 않아도 된다.
      body.childNodes[pi].replaceChild(tmpNode,body.childNodes[pi].childNodes[pj]); //복구코드
    }

    tmpNode=body.childNodes[i].childNodes[j]; //i,j 노드 삭제 전에 tmpNode에 복사본을 저장
    body.childNodes[i].replaceChild(childForReplace.cloneNode(true),body.childNodes[i].childNodes[j]);
    /*
    빨간배경 노드로 모든 노드를 채우고 싶다면 저 위에 있는 복구 코드를 주석처리하면 되는데,
    이 때 바로 위 빨간배경 노드로 바꾸는 replaceChild에서 만약 childForReplace.cloneNode(true)를 쓰지 않고, 아래 코드처럼 그냥 대입을 한다면? 
    body.childNodes[i].replaceChild(childForReplace,body.childNodes[i].childNodes[j]);
    -> 여러 개의 빨간배경 노드가 생기지 않고 하나로 유지되고 오류가 생긴다.(이전 빨간배경 노드는 사라져버림)
     cloneNode를 쓰지 않으면 노드 그 자체를 참조하는 것이 되어서,
     **여러번** 다른 곳에 대입하려고해도 한번에 하나만 대입이 가능한 것으로 보인다.
     cloneNode를 사용해야 노드를 값 그대로 복사하여 새로 사용하게 되어 여러 곳에 대입할 수 있는 것으로 보인다.
     (인자로 true를 넣어줘야 속성 노드 같은 그 노드의 자식노드들 까지 전부 복사된다.)

     요약 : 같은 요소를 여러군데 복사해서 쓰고 싶으면 cloneNode를 사용해야 할 것 같다.
    */

    pi=i; //한 parent에서 j=1일 때 pi는 이전 i여야 하므로 j=1일 때는 이전 pi로 두다가 작업이 끝나고 현재 i로 갱신해준다.(j=1이 아닐 땐 사실 필요없는 코드)
    pj=j; //이전 j를 현재 j로 갱신
    j++;  //다음 li로(body.childNodes[i].childeNodes의 다음 인덱스로)

    if(j>=body.childNodes[i].childNodes.length){  //한 parent의 자식을 전부 순회했을 때
      j=1;  //다음 parent의 자식 인덱스 1 (0은 text node이기 때문에 1로 간다.)
      i++; //다음 parent로 (= body.childNodes의 다음 인덱스로 )
      if(i>=body.childNodes.length){  // 모든 parent를 순회했다면
        clearInterval(timeoutId); //setInterval을 중지

        // 최종적으로 이전 노드를 원상복구해준다. 
        body.childNodes[pi].replaceChild(tmpNode,body.childNodes[pi].childNodes[pj]);
      }
    }
  }

  circulateChilds();
}





