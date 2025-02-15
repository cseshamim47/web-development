/* 
steps: 
1. get the object of the slider-container and each slide using querySelector & querySelectorAll
2. declare necesarry global variables
3. 
*/

const slider = document.querySelector(".slider-container"),
  slides = Array.from(document.querySelectorAll(".slide"));

let isDragging = false,
    startPos = 0,
    currentTranslate = 0,
    prevTranslate = 0,
    animationID = 0,
    currentIndex = 0;

slides.forEach((slide, index) => {
    const slideImage = slide.querySelector('img')
    slideImage.addEventListener('dragstart', (e)=> e.preventDefault())

    // touch events
    slide.addEventListener('touchstart', touchStart(index))
    slide.addEventListener('touchend', touchEnd)
    slide.addEventListener('touchmove', touchMove)


    // mouse events
    slide.addEventListener('mousedown', touchStart(index))
    slide.addEventListener('mouseup', touchEnd)
    slide.addEventListener('mouseleave', touchEnd)
    slide.addEventListener('mousemove', touchMove)    
})

function touchStart(index) {    
    return function (event) {
        currentIndex = index;
        startPos = getPositionX(event)    
        isDragging = true;

        animationID = requestAnimationFrame(animation)
        slider.classList.add('grabbing')
    }
}

// disable context menu
window.oncontextmenu = function(event) {
    event.preventDefault()
    event.stopPropagation()
    return false
}

function touchEnd() {
    isDragging = false;
    cancelAnimationFrame(animationID)

    const movedBy = currentTranslate - prevTranslate

    if (movedBy < -100 && currentIndex < slides.length - 1)
        currentIndex += 1;

    if (movedBy > 100 && currentIndex > 0)
        currentIndex -= 1;

    setPositionByIndex();

    slider.classList.remove('grabbing')
}

function touchMove(event) {
    if (isDragging)
    {
        const currentPosition = getPositionX(event)
        currentTranslate = prevTranslate + currentPosition - startPos
        console.log("prevTranslate : " + prevTranslate);
        console.log("currentPos : " + currentPosition);
        console.log("startPos : " + startPos);
        console.log("current translate: " + currentTranslate);
        
    }
}

function getPositionX(event)
{
    return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX
}

function animation() {
    setSliderPosition()
    if(isDragging) requestAnimationFrame(animation)  
}

function setSliderPosition()
{
    slider.style.transform = `translateX(${currentTranslate}px)`
}
 
function setPositionByIndex() {
    currentTranslate = currentIndex * -window.innerWidth; // current window width 
    prevTranslate = currentTranslate
    setSliderPosition()
}
