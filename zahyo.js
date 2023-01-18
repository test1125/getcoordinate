let input_X = document.querySelector("input[name=X]");
let input_Y = document.querySelector("input[name=Y]");
let submit = document.querySelector("#set-data");
let big_angles = document.querySelectorAll("#big_box div div");
let small_angles = document.querySelectorAll("#small_box div div");
const formula = document.querySelector("#formula");
const input = document.querySelector('#upload-file');
const fileRsetbtn = document.querySelector('#reset-file');

input.addEventListener('change', (e)=>{
  const reader = new FileReader();
  let file = e.target.files[0];
  submit.addEventListener('click' ,()=>{
    csvToCoordinate(file, reader);
    input.value="";
  })
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
  let X1 = Math.min(...X);
  let X2 = Math.max(...X);
  let Y1 = Math.min(...Y);
  let Y2 = Math.max(...Y);
  return [X1, X2, Y1, Y2];
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
      big_angles[i].innerText= big_box[i];
  }
  for(let i=0; i<4; i++){
      small_angles[i].innerText= small_box[i];
  }

  let x_red = "<span class='red'>x</span>";
  let y_red = "<span class='red'>y</span>";
  formula.innerHTML=`IF(AND(${x_red}>${x1}, ${y_red}>${y1}), IF(AND(${x_red}<${x2}, ${y_red}<${y2}), Center, Edge), Edge)`
  
  input_X.value = "";
  input_Y.value = "";
}

submit.addEventListener('click', (e)=>{
  if(input_X.value){
    let [X1, X2, Y1, Y2] = inputToCoordiante();
    commons(X1,X2,Y1,Y2);
  }
})


