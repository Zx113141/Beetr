import { type GridItemHTMLElement, GridStack, type GridStackNode, type GridStackWidget, type } from 'gridstack'
import { ref } from 'vue'
let nowEl: GridItemHTMLElement
let nowchildEl: any
let moveArrs: any = ''
let timer: any = ''
let startPosiX = 0

const addAnimaDrag = (getEle: any, ani: string) => {
    var keyframes = document.getElementsByClassName('rotateDragStyleShells')[0]
    getEle.style.animation = ''
    if (!keyframes) {
        keyframes = document.createElement('style');
        keyframes.classList.add('rotateDragStyleShells')
    }
    keyframes.innerHTML = ani
    if (!document.getElementsByClassName('rotateDragStyleShells')[0]) {
        document.head.appendChild(keyframes);
    }
    getEle.style.animation = 'ScaleTrag .5s linear forwards'
    setTimeout(() => {
        getEle.style.animation = ''
        getEle.style.transform = ''
    }, 300);
}
const isMovingWidget = ref('')

const useDrag = () => {

    const dragstart = (_event: Event, el: GridItemHTMLElement) => {

        nowEl = el
        nowchildEl = el.getElementsByClassName("thisarea")[0]
        startPosiX = nowEl.getBoundingClientRect().x
        nowchildEl.style.transform = 'scale(1.05)'
        isMovingWidget.value = el.getAttribute('gs-id')!

    }

    const drag = (_event: Event, el: GridItemHTMLElement) => {
        el.style.animation = ''
        el.style.transform = 'rotateZ(0deg)'
        if (el.getBoundingClientRect().x > startPosiX) {
            let ani = `@keyframes ScaleTrag {
    0%{transform:rotateZ(-10deg);
    }
    80%{transform:rotateZ(1deg);
    }
    90%{transform:rotateZ(-1deg);
    }
    100%{
    transform:rotateZ(0deg);
    }
    }`
            addAnimaDrag(el, ani)
        } else if (el.getBoundingClientRect().x < startPosiX) {
            let ani = `@keyframes ScaleTrag {
    0%{transform:rotateZ(10deg);
    }
    80%{transform:rotateZ(-1deg);
    }
    90%{transform:rotateZ(1deg);
    }
    100%{
    transform:rotateZ(0deg);
    }
    }`
            addAnimaDrag(el, ani)
        }

        startPosiX = el.getBoundingClientRect().x

    }

    const dragstop = () => {
        clearInterval(timer)
        let diffx = Math.round(moveArrs.x - nowEl.getBoundingClientRect().x)
        let diffy = Math.round(moveArrs.y - nowEl.getBoundingClientRect().y)
        var keyframes = document.getElementsByClassName('keyFrameStyle')[0]
        if (!keyframes) {
            keyframes = document.createElement('style');
            keyframes.classList.add('keyFrameStyle')
        }
        nowchildEl.style.top = diffy + 'px'
        nowchildEl.style.left = diffx + 'px'
        keyframes.innerHTML =
            `@keyframes example2 {
    0%{transform:scale(1.05);
      top:${diffy}px;
      left:${diffx}px;
    }
    100% {
      transform:scale(1);
      top:0px;
      left:0px;
    }
    }`;

        if (!document.getElementsByClassName('keyFrameStyle')[0]) {
            document.head.appendChild(keyframes);
        }
        nowchildEl.style.animation = 'example2 .5s forwards'
        setTimeout(() => {
            nowchildEl.style.animation = ''
            nowchildEl.style.transform = 'scale(1)'
            nowchildEl.style.top = 0 + 'px'
            nowchildEl.style.left = 0 + 'px'
            isMovingWidget.value = ''

        }, 350);
    }


    return [
        drag,
        dragstart,
        dragstop,
        isMovingWidget
    ]
}

export default useDrag