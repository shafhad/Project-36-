var gameState = 0;  
var dog; 
var happydog; 
var foodS, foodstock;
var fedTime, lastFed, addFood; 
var foodObj;  
var database;
var changingState, readState; 
var bedroom, garden, washroom;  

function preload()
{
  dog = loadImage("sprites/dogImg.png"); 
  
  happy = loadImage("sprites/dogImg1.png"); 

  bedroom = loadImage("sprites/Bed Room.png"); 

  garden = loadImage("sprites/Garden.png"); 

  washroom = loadImage("sprites/Wash Room.png"); 
}

function setup() {
  createCanvas(500, 500);
  
  dog = createSprite(330,200,30,40); 
  dog.addImage(dog);

  foodObj = new Food(330,190,30,40); 

  foodstock = database.ref('Food'); 

  foodstock.on("value",readStock);

  readState = database.ref('gameState'); 
  readState.on("value",function(data){
    gameState = data.val();
  }); 
  
  feedTime = createButton("Feed the dog"); 
  feedTime.position(700,95);
  feedTime.mousePressed(feedDog); 

  addFood = createButton("Add food"); 
  addFood.position(800,95); 
  addFood.mousePressed(addFood);
}


function draw() {  
  background(46, 139, 87); 

  feedTime = database.ref('Feed Time');
  feedTime.on("value",function(data){
    lastFed = data.val();
  }); 
  
  if (gameState != "Hungry"){
    feed.hide(); 
    addFood.hide(); 
    dog.remove(); 
  }else{
    feed.show(); 
    addFood.show(); 
    dog.addImage(dog); 
  }

  function updata(state){
    database.ref('/').updata({
      gameState:state
    })
  }
  currentTime=hour(); 

  if(currentTime==(lastFed+1)){
    update("Playing"); 
    foodObj.garden(); 
  }else if(currentTime ==(lastFed+2)){
    update("Sleeping"); 
    foodObj.bedroom(); 
  }else if(currentTime>(lastFed+2)&& currentTime<=(lastFed+4)){
    update("Bathing"); 
    foodObj.washroom(); 
  }else{
    update("Hungry"); 
    foodObj.display(); 
  }

  drawSprites();

  database.text ("Press the UP_ARROW key to feed the dragon milk"); 
  fill(255,255,254); 
  textSize(15);
  
  if(lastFed>=12) {
    text("Last Feed:" + lastFed%12 + "PM",350,30); 
  }else if (lastFed == 0) {
    text("Last Feed : 12 AM")
  }else{
    text("Last Feed :" + lastFed + "AM", 350,30);
  }
}

function readStock(data) {
  foodS = data.val(0); 
}

function writeStock(x) {
  if (x<=0) {
    x = 0; 
  }else {
    x = x-1; 
  }
  database.ref('/').update({
    Food:x
  })
}


function feedDog() {
  dog.addImage(happyDog); 

  foodObj.updateFoodStock(foodObj.getFoofStock()-1); 
  database.ref('/').update({
  Food:foodObj.getFoofStock(), 
  feedTime:hour()   
  })
}

function addFood() {
  foodS++; 
  database.ref('/').update({
    Food:foodS
  })
}
