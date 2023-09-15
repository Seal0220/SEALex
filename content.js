const imgDiv = document.createElement('div')
imgDiv.id = 'follow-mouse-img'
imgDiv.innerHTML = `<img src="" alt="Image">`
document.body.appendChild(imgDiv)

const styleElement = document.createElement('style')
styleElement.type = 'text/css'
styleElement.innerHTML = `
  #follow-mouse-img {
    position: fixed;
    z-index: 9999;
    pointer-events: none;
  }
  #follow-mouse-img img {
    width: 30px;
    height: 30px;
  }
`
document.head.appendChild(styleElement)


let x = 0, y = 0;
let targetX = 0, targetY = 0;
const easing = 0.01;
let frameIndex = 0;
const frameCount = 14;
let shouldAnimate = false;
let idleTime = 500;
let idleTimer;
const epsilon = 35;

function animate() {
  function follow() {
    const dx = (targetX - x) * easing;
    const dy = (targetY - y) * easing;

    x += dx;
    y += dy;

    const imgDiv = document.getElementById('follow-mouse-img');
    if (imgDiv) {
      imgDiv.style.left = x + 'px';
      imgDiv.style.top = y + 'px';
    }
  }

  if (shouldAnimate || Math.abs(x - targetX) > epsilon || Math.abs(y - targetY) > epsilon) {
    follow()
    const frameName = `seal_${String(frameIndex).padStart(2, '0')}.png`;
    const imageUrl = chrome.extension.getURL(`seal-animation/${frameName}`);
    const imgElement = document.querySelector('#follow-mouse-img img');
    imgElement.src = imageUrl;

    frameIndex = (frameIndex + 1) % frameCount;
  }
  else if (!shouldAnimate && Math.abs(x - targetX) <= epsilon && Math.abs(y - targetY) <= epsilon) {
    frameIndex = 0;
    const frameName = `seal_${String(frameIndex).padStart(2, '0')}.png`;
    const imageUrl = chrome.extension.getURL(`seal-animation/${frameName}`);
    const imgElement = document.querySelector('#follow-mouse-img img');
    imgElement.src = imageUrl;
  }

  requestAnimationFrame(animate);
}

document.addEventListener('mousemove', function (event) {
  targetX = event.clientX;
  targetY = event.clientY;
  shouldAnimate = true;

  clearTimeout(idleTimer);
  idleTimer = setTimeout(() => {
    shouldAnimate = false;
  }, idleTime);
});

requestAnimationFrame(animate);


