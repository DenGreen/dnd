export default class Trello {
  constructor() {
    this.trelloBtnArr = document.querySelectorAll(".trello__btn");

  }

  init() {
    this.trelloBtnClick();
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
      trelloCell.addEventListener("mousedown", this.trelloEventMousedown);
    });
  }

  trelloEventMousedown(event) {
    const trello = document.querySelector(".trello");
    const trelloCell = event.target.parentNode;
    const trelloCells = document.querySelectorAll(".trello__cell");

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
    });

    trelloCells.forEach((trelloCellOne) => {
      trelloCellOne.addEventListener("mouseup", (e) => {
        if(e.target.classList.contains("trello__cell")) {
          const thisCell = e.target;
          const trelloColumn = thisCell.parentNode;
          trelloColumn.insertBefore(trelloCell, thisCell);
        }
      });
    });

    function mouseoverTrelloCell(trelloCellTwo) {
      trelloCellTwo.style.paddingTop = `${trelloCell.clientHeight}px`;
    };

    trelloCells.forEach((trelloCellTwo) => {
      trelloCellTwo.addEventListener("mouseover", mouseoverTrelloCell.bind(this, trelloCellTwo));
    });

    trelloCells.forEach((trelloCell) => {
      trelloCell.addEventListener("mouseout", function mouseoutTrelloCell(e) {
        trelloCell.style.paddingTop = "0px";
        trelloCell.removeEventListener("mouseover", mouseoverTrelloCell.bind(this, trelloCell));
      })
    });
  }

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
          }
        } else {
          trelloBtn.insertAdjacentHTML(
            "beforebegin",
            '<textarea class="trello__textarea" cols="30" rows="10"></textarea>'
          );
          trelloBtn.classList.add("trello__btn-active");
          trelloBtn.textContent = "Add Card";
        }
      });
    });
  }
}
