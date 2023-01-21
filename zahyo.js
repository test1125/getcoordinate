const error_msg = document.querySelector("span");
const input_X = document.querySelector("input[name=X]");
const input_Y = document.querySelector("input[name=Y]");
const input_cell = document.querySelector("input[name=cell]");
const submit = document.querySelector("#set-data");
const big_corners = document.querySelectorAll("#big_box div div");
const small_corners = document.querySelectorAll("#small_box div div");
const formula = document.querySelector("#formula p");
const input = document.querySelector('#upload-file');
const fileRsetbtn = document.querySelector('#reset-file');
const copy = document.querySelector("#get-formula");

input.addEventListener('change', (e)=>{
  reader = new FileReader();
  file = e.target.files[0];
})

fileRsetbtn.addEventListener('click', ()=>{
  input.value="";
})


function csvToCoordinate(file, reader){
  if (file.type === 'text/csv') {
    reader.onload = () => {
      array = reader.result.trim().split(/,|\r\n/); //最後に改行があると0が配列に追加されてしまうためtrim
      console.log(array);
      let x_array = [];
      let y_array = [];
      for(let i=3; i<array.length; i++){
        if(i%3==0){
          x_array.push(array[i]);
        } else if(i%3==1){
          y_array.push(array[i]);
        }
      }
      input.value="";
      // let cordinate = `x_min:${Math.min(...x_array)}, x_max:${Math.max(...x_array)}, y_min:${Math.min(...y_array)}, y_max${Math.max(...y_array)}`
      // formula.insertAdjacentText('afterend', cordinate);
      commons(Math.min(...x_array),Math.max(...x_array),Math.min(...y_array),Math.max(...y_array));
    }
    reader.readAsText(file);
  } 
}

  
function inputToCoordiante(){
  let X = input_X.value.split(',');
  let Y = input_Y.value.split(',');
  let array = [];
  if(X.length == 2 && Y.length ==2){
    let X1 = Math.min(...X);
    let X2 = Math.max(...X);
    let Y1 = Math.min(...Y);
    let Y2 = Math.max(...Y);
    array = [X1, X2, Y1, Y2];
  }
  return array;
}

function commons(X1,X2,Y1,Y2){
  let big_box = [`(${X1}, ${Y1})`, `(${X2}, ${Y1})`, `(${X1}, ${Y2})`, `(${X2}, ${Y2})`];

  let diff = ( (X2-X1) - (X2-X1)/Math.sqrt(2) )/2
  diff = Math.round(diff*100)/100
  console.log(diff);
  let x1 = X1 + diff;
  let x2 = X2 - diff;
  let y1 = Y1 + diff;
  let y2 = Y2 - diff;

  let small_box = [
      `(${x1}, ${y1})`,
      `(${x2}, ${y1})`,
      `(${x1}, ${y2})`,
      `(${x2}, ${y2})`
  ];
  
  for(let i=0; i<4; i++){
      big_corners[i].innerText= big_box[i];
  }
  for(let i=0; i<4; i++){
      small_corners[i].innerText= small_box[i];
  }

  let cells = input_cell.value.split(',');
  // let y_cell = input_cell.value.split(',');
  formula.innerHTML=`IF(AND(${cells[0]}>${x1}, ${cells[1]}>${y1}), IF(AND(${cells[0]}<${x2}, ${cells[2]}<${y2}), Center, Edge), Edge)`
  
  input_X.value = "";
  input_Y.value = "";
  input_cell.value ="";
}

function error(msg){
  error_msg.innerText = msg;
  error_msg.parentElement.animate(
    {
      // background: ["rgb(207, 40, 40)", "rgb(241, 17, 55)", "rgb(207, 40, 40)"],
      transform: [
        "translate(0px,0px)",
        "translate(3px, 0px)",
        "translate(0px,0px)",
        "translate(-3px, 0px)",
        "translate(0px, 0px)",
      ],
      easing: 'linear',
      // easing: 'ease-in-out',
    },
    {
      iterations: 10,
      duration: 100,
    }
  );
}


function validation(X,Y,cells){
  error_msg.innerText="";
  if(input.value){
    if (input.value.split('.').pop() == "csv" ){
      // console.log(input_cell.value);
      if(input_cell.value){
        if(cells.length != 2){
          error("参照するセルは2つ必要です");
          return false
        } else {
          return true;
        }
      } else {
        error("参照するセルを指定してください。");
        return false;
      }
    } else {
      error("利用できるファイル形式はcsvのみです。")
      return false;
    }    
  } else if (input_X.value && input_Y.value){
    if(X.length==2 && Y.length==2){
      if(input_cell.value){
        if(cells.length==2){
          return true;
        } else {
          error("参照するセルは2つ必要です。");
          return false;
        }
      } else {
        error("参照するセルを指定してください。");
        return false;
      }
    } else{
      error("x,yはそれぞれ2つの値が必要です。");
      return false;
    }
  } else {
    error("値の入力、CSVファイルのアップロードのいずれかが必要です。");
    return false;
  }
} 


submit.addEventListener('click', ()=>{
  let X = input_X.value.split(',');
  let Y = input_Y.value.split(',');
  let cells = input_cell.value.split(',');
  if(validation(X,Y,cells)){
    csvToCoordinate(file, reader);

    let [X1, X2, Y1, Y2] = inputToCoordiante();
    commons(X1,X2,Y1,Y2);
  }
})

copy.addEventListener("click",()=>{
  navigator.clipboard.writeText(formula.textContent);
  copy.innerText="コピーしました";
  setTimeout(() => copy.innerText = 'コピー', 700);
})
