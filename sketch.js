let hexagons = [];
let mic;
let numHexagons = 30;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1); // 使用 HSB 模式讓顏色更隨機且漂亮
  
  // 初始化音訊輸入
  mic = new p5.AudioIn();
  mic.start();

  // 產生隨機六邊形資料
  for (let i = 0; i < numHexagons; i++) {
    hexagons.push({
      x: random(width),
      y: random(height),
      baseSize: random(30, 80),
      hue: random(360),
      vx: random(-2, 2), // 水平速度
      vy: random(-2, 2)  // 垂直速度
    });
  }
}

function draw() {
  background(200, 30, 95); // 淺藍色背景 (HSB)

  // 獲取音量感應
  let level = mic.getLevel(); 
  // 將音量映射到縮放比例，增加跳動感
  let pulse = map(level, 0, 0.5, 1, 6); 
  let shake = map(level, 0, 0.5, 0, 50); // 根據音量決定震動幅度

  for (let h of hexagons) {
    fill(h.hue, 70, 90, 0.8);
    noStroke();
    
    // 加上隨機震動位移
    let offsetX = random(-shake, shake);
    let offsetY = random(-shake, shake);
    
    // 繪製六邊形 (位置加上震動量)
    drawHexagon(h.x + offsetX, h.y + offsetY, h.baseSize * pulse);
    
    // 更新位置（四處飄動）
    h.x += h.vx;
    h.y += h.vy;
    
    // 邊界處理：超出畫面後從另一側出現
    if (h.x < -h.baseSize) h.x = width + h.baseSize;
    if (h.x > width + h.baseSize) h.x = -h.baseSize;
    if (h.y < -h.baseSize) h.y = height + h.baseSize;
    if (h.y > height + h.baseSize) h.y = -h.baseSize;
  }
}

function drawHexagon(x, y, radius) {
  push();
  translate(x, y);
  beginShape();
  for (let a = 0; a < TWO_PI; a += PI / 3) {
    let sx = cos(a) * radius;
    let sy = sin(a) * radius;
    vertex(sx, sy);
  }
  endShape(CLOSE);
  pop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
