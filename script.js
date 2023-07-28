async function fetchDetailsData() {
    try {
      const response = await fetch(
        "https://raw.githubusercontent.com/Rajavasanthan/jsondata/master/pagenation.json"
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.log(error);
      return [];
    }
  }
  
  function createElementWithAttributes(tagName, attributes) {
    const element = document.createElement(tagName);
    for (const key in attributes) {
      element.setAttribute(key, attributes[key]);
    }
    return element;
  }
  
  function renderTable(detailList, currentPage, itemsPerPage) {
    const container = document.getElementById("tableDiv");
    container.innerHTML = "";
  
    const table = createElementWithAttributes("table", {
      className: "table table-bordered",
      id: "table"
    });
    const thead = document.createElement("thead");
    const tbody = document.createElement("tbody");
  
    const tableHeaders = ["Id", "Name", "Email"];
    const headerRow = document.createElement("tr");
    tableHeaders.forEach(headerText => {
      const th = document.createElement("th");
      th.textContent = headerText;
      headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
  
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentList = detailList.slice(startIndex, endIndex);
  
    currentList.forEach(detail => {
      const row = document.createElement("tr");
      const idCell = document.createElement("td");
      idCell.textContent = detail.id;
      const nameCell = document.createElement("td");
      nameCell.textContent = detail.name;
      const emailCell = document.createElement("td");
      emailCell.textContent = detail.email;
      row.appendChild(idCell);
      row.appendChild(nameCell);
      row.appendChild(emailCell);
      tbody.appendChild(row);
    });
  
    table.appendChild(thead);
    table.appendChild(tbody);
    container.appendChild(table);
    renderPaginationButtons(detailList.length, currentPage, itemsPerPage);
  }
  
  function renderPaginationButtons(totalItems, currentPage, itemsPerPage) {
    const buttonsDiv = document.getElementById("buttons");
    buttonsDiv.innerHTML = "";
    const ul = document.createElement("ul");
    ul.className = "pagination";
  
    function createButton(text, id, isActive, onClickHandler) {
      const button = createElementWithAttributes("button", {
        id,
        className: `d-flex justify-content-center page-link${isActive ? " active" : ""}`
      });
      button.textContent = text;
      button.addEventListener("click", onClickHandler);
      return button;
    }
  
    const totalPages = Math.ceil(totalItems / itemsPerPage);
  
    const previousButton = createButton("Previous", "previous", currentPage === 1, () => {
      if (currentPage > 1) {
        currentPage--;
        renderTable(detailList, currentPage, itemsPerPage);
      }
    });
    ul.appendChild(previousButton);
  
    for (let index = 0; index < totalPages; index++) {
      const button = createButton(index + 1, `${index === 0 ? "first" : "last"}`, currentPage === index + 1, () => {
        currentPage = index + 1;
        renderTable(detailList, currentPage, itemsPerPage);
      });
      ul.appendChild(button);
    }
  
    const nextButton = createButton("Next", "next", currentPage === totalPages, () => {
      if (currentPage < totalPages) {
        currentPage++;
        renderTable(detailList, currentPage, itemsPerPage);
      }
    });
    ul.appendChild(nextButton);
  
    buttonsDiv.appendChild(ul);
  }
  
  const itemsPerPage = 10;
  let detailList = [];
  let currentPage = 1;
  
  async function initializeApp() {
    detailList = await fetchDetailsData();
    renderTable(detailList, currentPage, itemsPerPage);
  }
  
  initializeApp();