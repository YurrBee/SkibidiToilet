let highestZ = 1;

class Paper {
  holdingPaper = false;
  mouseTouchX = 0;
  mouseTouchY = 0;
  mouseX = 0;
  mouseY = 0;
  prevMouseX = 0;
  prevMouseY = 0;
  velX = 0;
  velY = 0;
  rotation = Math.random() * 30 - 15;
  currentPaperX = 0;
  currentPaperY = 0;
  rotating = false;

  init(paper) {

 
    document.addEventListener('mousemove', (e) => {
      this.handleMove(e.clientX, e.clientY, paper);
    });


    document.addEventListener('touchmove', (e) => {
      const touch = e.touches[0];
      this.handleMove(touch.clientX, touch.clientY, paper);
    });


    paper.addEventListener('mousedown', (e) => {
      this.startHold(e.clientX, e.clientY, e.button, paper);
    });


    paper.addEventListener('touchstart', (e) => {
      const touch = e.touches[0];
      this.startHold(touch.clientX, touch.clientY, 0, paper);
    });


    window.addEventListener('mouseup', () => {
      this.stopHold();
    });

  
    window.addEventListener('touchend', () => {
      this.stopHold();
    });
  }

  handleMove(x, y, paper) {
    if (!this.rotating) {
      this.mouseX = x;
      this.mouseY = y;

      this.velX = this.mouseX - this.prevMouseX;
      this.velY = this.mouseY - this.prevMouseY;
    }

    if (this.rotating) {
      const dirX = x - this.mouseTouchX;
      const dirY = y - this.mouseTouchY;
      const dirLength = Math.sqrt(dirX * dirX + dirY * dirY);

      const dirNormalizedX = dirX / dirLength;
      const dirNormalizedY = dirY / dirLength;

      const angle = Math.atan2(dirNormalizedY, dirNormalizedX);
      let degrees = (180 * angle) / Math.PI;
      degrees = (360 + Math.round(degrees)) % 360;

      this.rotation = degrees;
      paper.style.transform = `
        translateX(${this.currentPaperX}px)
        translateY(${this.currentPaperY}px)
        rotate(${this.rotation}deg)
      `;
    }

    if (this.holdingPaper) {
      if (!this.rotating) {
        this.currentPaperX += this.velX;
        this.currentPaperY += this.velY;
      }

      this.prevMouseX = this.mouseX;
      this.prevMouseY = this.mouseY;

      paper.style.transform = `
        translateX(${this.currentPaperX}px)
        translateY(${this.currentPaperY}px)
        rotate(${this.rotation}deg)
      `;
    }
  }

  startHold(x, y, button, paper) {
    if (this.holdingPaper) return;

    this.holdingPaper = true;

    paper.style.zIndex = highestZ;
    highestZ++;

    this.mouseTouchX = x;
    this.mouseTouchY = y;
    this.prevMouseX = x;
    this.prevMouseY = y;

    if (button === 2) {
      this.rotating = true;
    }
  }

  stopHold() {
    this.holdingPaper = false;
    this.rotating = false;
  }
}

const papers = Array.from(document.querySelectorAll('.paper'));

papers.forEach(paper => {
  const p = new Paper();
  p.init(paper);
});
