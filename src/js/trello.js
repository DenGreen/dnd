export default class Trello {
  constructor() {
    this.trelloBtnArr = document.querySelectorAll(".trello__btn");
    this.trello = document.querySelector('.trello');
    this.trelloCell = null;
    this.body = document.querySelector('body');
    this.mouseoverTrelloCellBind = this.mouseoverTrelloCell.bind(this);
  }

  init() {
    this.loadLocalStorage();
  }

  trelloCartEvent() {
    const trelloCartArr = document.querySelectorAll(".trello__cart");
    const trelloCells = document.querySelectorAll(".trello__cell");

    trelloCartArr.forEach((trelloCart) => {
      trelloCart.removeEventListener("mouseleave", this.trelloCartMouseleave);
      trelloCart.removeEventListener("mouseenter", this.trelloCartMouseenter);
    });

    trelloCartArr.forEach((trelloCart) => {
      trelloCart.addEventListener("mouseleave", this.trelloCartMouseleave);
      trelloCart.addEventListener("mouseenter", this.trelloCartMouseenter);
    });

    trelloCells.forEach((trelloCell) => {
      trelloCell.removeEventListener("mousedown", this.trelloEventMousedown);
    });

    trelloCells.forEach((trelloCell) => {
      trelloCell.addEventListener("mousedown", this.trelloEventMousedown.bind(this));
    });
  }

  loadLocalStorage(){
    const trelloOne = localStorage.getItem('trelloOne');
    const trelloTwo = localStorage.getItem('trelloTwo');
    const trelloThree = localStorage.getItem('trelloThree');

    if(trelloOne){
      this.trello.innerHTML = '';
      
      this.trello.insertAdjacentHTML('beforeend', trelloOne);
      this.trello.insertAdjacentHTML('beforeend', trelloTwo);
      this.trello.insertAdjacentHTML('beforeend', trelloThree);
      
    }
    this.trelloBtnArr = document.querySelectorAll(".trello__btn");
      this.trelloBtnClick();
      this.trelloCartEvent();
  }

  trelloEventMousedown(event) {
    let trelloCell = null;
    if(event.target.parentNode.classList.contains("trello__cell")){
      trelloCell = event.target.parentNode;
    } else if(event.target.classList.contains("trello__cell")){
      trelloCell = event.target;
    } else if((event.target.parentNode.parentNode.classList.contains("trello__cell"))){
      trelloCell = event.target.parentNode.parentNode;
    }

    this.body.style.cursor = "grabbing";
    const trello = document.querySelector(".trello");
    
    const trelloCells = document.querySelectorAll(".trello__cell");
    this.trelloCell = trelloCell;

    event.preventDefault();
    if(trelloCell.classList.contains("trello__cell")) {
      trelloCell.classList.add("dragget");
    }

    trello.addEventListener("mousemove", function panelDrag(event) {
      if (trelloCell.classList.contains("trello__cell")) {
        
        trelloCell.style.left = `${event.clientX}px`;
        trelloCell.style.top = `${event.clientY}px`; 
      }
    });

    trello.addEventListener("mouseup", function panelDragEnd() {
      if (!trelloCell) return;
      trelloCell.classList.remove("dragget");
      trello.removeEventListener("mouseup", panelDragEnd);
      this.saveLocalStorage();
    }.bind(this));

    trelloCells.forEach((trelloCellOne) => {
      trelloCellOne.addEventListener("mouseup", (e) => {
        this.body.style.cursor = "default";
        if(e.target.classList.contains("trello__cell")) {
          const thisCell = e.target;
          const trelloColumn = thisCell.parentNode;
          trelloColumn.insertBefore(trelloCell, thisCell);

          trelloCells.forEach((trelloCellTwo) => {
            trelloCellTwo.removeEventListener("mouseover", this.mouseoverTrelloCellBind);
          });
          this.saveLocalStorage();
        }
      });
    });

    trelloCells.forEach((trelloCellTwo) => {
      trelloCellTwo.addEventListener("mouseover", this.mouseoverTrelloCellBind);

      trelloCellTwo.addEventListener("mouseout", function mouseoutTrelloCell(e) {
        trelloCellTwo.style.paddingTop = "0px";
      })
    });
  }

  mouseoverTrelloCell(e) {
    let  target = e.target.parentNode;

    if(target.classList.contains("trello__cell")) {
      target.style.paddingTop = `${this.trelloCell.offsetHeight}px`;
    } else if(e.target.classList.contains("trello__cell")) {
      e.target.style.paddingTop = `${this.trelloCell.offsetHeight}px`;
    }
  };

  trelloCartMouseleave(e) {
    e.target
      .querySelector(".trello__close")
      .classList.add("trello__close-opacity");
  }

  trelloCartMouseenter(e) {
    e.target
      .querySelector(".trello__close")
      .classList.remove("trello__close-opacity");
  }

  trelloCloseEvent() {
    const trelloCloseArr = document.querySelectorAll(".trello__close");

    trelloCloseArr.forEach((trelloClose) => {
      trelloClose.removeEventListener("click", this.trelloCloseClick);
    });

    trelloCloseArr.forEach((trelloClose) => {
      trelloClose.addEventListener("click", this.trelloCloseClick);
    });

  }

  trelloCloseClick(e) {
    e.target.parentNode.parentNode.remove();
  }

  trelloBtnClick() {
    this.trelloBtnArr.forEach((trelloBtn) => {
      trelloBtn.addEventListener("click", (e) => {
        if (trelloBtn.classList.contains("trello__btn-active")) {
          const trelloTextarea = trelloBtn.parentElement.querySelectorAll(
            ".trello__textarea"
          );

          if (trelloTextarea[0].value !== "") {
            const textareaValue = trelloTextarea[0].value;
            trelloBtn.insertAdjacentHTML(
              "beforebegin",
              ` <div class="trello__cell">
              <div class="trello__cart">
                <p class="trello__text">${textareaValue}</p>
                <div class="trello__close trello__close-opacity">&#10006</div>
              </div>
            </div>`
            );
            this.trelloCartEvent();
            this.trelloCloseEvent();
            trelloTextarea[0].remove();
            trelloBtn.classList.remove("trello__btn-active");
            trelloBtn.textContent = "+ Add another card";
            this.saveLocalStorage();
          }
        } else {
          trelloBtn.insertAdjacentHTML(
            "beforebegin",
            '<textarea class="trello__textarea" cols="30" rows="10"></textarea>'
          );
          trelloBtn.classList.add("trello__btn-active");
          trelloBtn.textContent = "Add Card";
          this.saveLocalStorage();
        }
      });
    });
  }

  saveLocalStorage() {
    const trelloColumn = document.querySelectorAll('.trello__column');

    localStorage.setItem('trelloOne', trelloColumn[0].outerHTML);
    localStorage.setItem('trelloTwo', trelloColumn[1].outerHTML);
    localStorage.setItem('trelloThree', trelloColumn[2].outerHTML);
  }
}
