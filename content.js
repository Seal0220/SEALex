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


let x = 0, y = 0
let targetX = 0, targetY = 0
const easing = 0.1
let frameIndex = 0
const frameCount = 14
const frameRate = 300
let shouldAnimate = false
let idleTime = 500
let idleTimer

function animate() {
  const dx = (targetX - x) * easing
  const dy = (targetY - y) * easing
  
  x += dx
  y += dy

  const imgDiv = document.getElementById('follow-mouse-img')
  if (imgDiv) {
    imgDiv.style.left = x + 'px'
    imgDiv.style.top = y + 'px'
  }

  updateFrame()
  requestAnimationFrame(animate)
}

function updateFrame() {
    if (shouldAnimate || frameIndex !== 0) {
      const frameName = `seal_${String(frameIndex).padStart(2, '0')}.png`
      const imageUrl = chrome.extension.getURL(`seal-animation/${frameName}`)
      const imgElement = document.querySelector('#follow-mouse-img img')
      
      imgElement.src = imageUrl
      
      frameIndex = (frameIndex + 1) % frameCount
    } else {
      frameIndex = 0
      const frameName = `seal_${String(frameIndex).padStart(2, '0')}.png`
      const imageUrl = chrome.extension.getURL(`seal-animation/${frameName}`)
      const imgElement = document.querySelector('#follow-mouse-img img')
      imgElement.src = imageUrl
    }
  }

document.addEventListener('mousemove', function(event) {
  targetX = event.clientX + 15
  targetY = event.clientY + 15
  shouldAnimate = true

  clearTimeout(idleTimer)
  idleTimer = setTimeout(() => {
    shouldAnimate = false
  }, idleTime)
})

requestAnimationFrame(animate)
setInterval(updateFrame, frameRate)

