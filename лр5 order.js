document.addEventListener('DOMContentLoaded', function() {
  // Элементы DOM
  const orderSection = document.getElementById('order-section');
  const orderForm = document.getElementById('orderForm');
  const selectedTeasContainer = document.getElementById('selected-teas');
  const totalPriceElement = document.getElementById('total-price');

  // Выбранные чаи по категориям
  let selectedTeas = {
    black: null,
    green: null,
    oolong: null,
    puer: null
  };
  // Выбранные чаи с количеством
  let selectedTeas = [];

  // ктегории чая
  // Названия категорий чая
  const categoryNames = {
    black: "Чёрный чай",
    green: "Зелёный чай",
    oolong: "Улун",
    puer: "Пуэр"
    puer: "Пуэр",
    herbal: "Травяной чай",
    fruit: "Фруктовый чай"
  };

  //для отображения выбранных чаев
  // Функция для отображения выбранных чаев
  function updateSelectedTeasDisplay() {
    selectedTeasContainer.innerHTML = '';
    let hasSelection = false;
    let totalPrice = 0;
    
    // есть ли выбранные чаи
    for (const category in selectedTeas) {
      if (selectedTeas[category]) {
        hasSelection = true;
        break;
      }
    }

    if (!hasSelection) {
    if (selectedTeas.length === 0) {
      const noSelection = document.createElement('p');
      noSelection.textContent = 'Ничего не выбрано';
      noSelection.textContent = 'Чай не выбран';
      noSelection.className = 'no-selection';
      selectedTeasContainer.appendChild(noSelection);
      totalPriceElement.style.display = 'none';
      return;
    }

    // выбранные чаи по категориям
    for (const category in selectedTeas) {
    // Группируем чаи по категориям для красивого отображения
    const teasByCategory = {};
    selectedTeas.forEach(tea => {
      if (!teasByCategory[tea.category]) {
        teasByCategory[tea.category] = [];
      }
      teasByCategory[tea.category].push(tea);
    });
    
    let totalPrice = 0;
    
    // Отображаем выбранные чаи по категориям
    for (const category in teasByCategory) {
      const categoryDiv = document.createElement('div');
      categoryDiv.className = 'selected-category';

      const categoryTitle = document.createElement('strong');
      categoryTitle.textContent = categoryNames[category] + ': ';
      categoryTitle.textContent = categoryNames[category] + ':';
      categoryDiv.appendChild(categoryTitle);

      if (selectedTeas[category]) {
        const tea = selectedTeas[category];
        const teaText = document.createElement('span');
        teaText.textContent = `${tea.name} ${tea.price}₽`;
      teasByCategory[category].forEach(tea => {
        const teaDiv = document.createElement('div');
        teaDiv.className = 'selected-tea-item';

        categoryDiv.appendChild(categoryTitle);
        categoryDiv.appendChild(teaText);
        totalPrice += tea.price;
      } else {
        const noTeaText = document.createElement('span');
        noTeaText.textContent = 'Чай не выбран';
        // Рассчитываем стоимость за выбранное количество
        const totalItemPrice = tea.price * tea.quantity;
        totalPrice += totalItemPrice;

        categoryDiv.appendChild(categoryTitle);
        categoryDiv.appendChild(noTeaText);
      }
        teaDiv.innerHTML = `
          <div class="selected-tea-info">
            <span>${tea.name} - ${tea.price}₽/100г</span>
            <div class="quantity-controls">
              <button type="button" class="btn-quantity" onclick="changeQuantity('${tea.keyword}', -1)">-</button>
              <span class="quantity-display">${tea.quantity * 100}г</span>
              <button type="button" class="btn-quantity" onclick="changeQuantity('${tea.keyword}', 1)">+</button>
            </div>
            <span class="item-total">${totalItemPrice}₽</span>
          </div>
          <button type="button" class="btn-remove" onclick="removeFromOrder('${tea.keyword}')">×</button>
        `;
        
        categoryDiv.appendChild(teaDiv);
      });

      selectedTeasContainer.appendChild(categoryDiv);
    }

    //общая стоимость
    totalPriceElement.textContent = `Стоимость заказа: ${totalPrice}₽`;
    // Общая стоимость
    totalPriceElement.innerHTML = `<strong>Общая стоимость: ${totalPrice}₽</strong>`;
    totalPriceElement.style.display = 'block';

    // скрытые поля формы
    // Обновляем скрытые поля формы
    updateFormHiddenFields();
  }

@@ -85,40 +92,82 @@ document.addEventListener('DOMContentLoaded', function() {
    existingHiddenFields.forEach(field => field.remove());

    // Добавляем новые скрытые поля для выбранных чаев
    for (const category in selectedTeas) {
      if (selectedTeas[category]) {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = `tea_${category}`;
        input.value = selectedTeas[category].keyword;
        orderForm.appendChild(input);
      }
    }
    selectedTeas.forEach((tea, index) => {
      const keywordInput = document.createElement('input');
      keywordInput.type = 'hidden';
      keywordInput.name = `tea_${index}_keyword`;
      keywordInput.value = tea.keyword;
      orderForm.appendChild(keywordInput);
      
      const quantityInput = document.createElement('input');
      quantityInput.type = 'hidden';
      quantityInput.name = `tea_${index}_quantity`;
      quantityInput.value = tea.quantity;
      orderForm.appendChild(quantityInput);
    });
  }

  // Функция для добавления/удаления чая в заказ
  // Функция для добавления чая в заказ
  window.addToOrder = function(teaKeyword) {
    const tea = teas.find(t => t.keyword === teaKeyword);
    if (!tea) return;

    // Снимаем выделение со всех чаев этой категории
    document.querySelectorAll(`.tea-card[data-category="${tea.category}"]`).forEach(card => {
      card.classList.remove('selected');
    });
    // Проверяем, не выбран ли уже этот чай
    const existingIndex = selectedTeas.findIndex(t => t.keyword === teaKeyword);

    // Если этот чай уже выбран, снимаем выбор
    if (selectedTeas[tea.category] && selectedTeas[tea.category].keyword === teaKeyword) {
      selectedTeas[tea.category] = null;
    if (existingIndex !== -1) {
      // Если чай уже выбран, увеличиваем количество
      selectedTeas[existingIndex].quantity += 1;
    } else {
      // Выбираем этот чай
      selectedTeas[tea.category] = tea;
      // Добавляем новый чай с количеством 1 (100г)
      selectedTeas.push({
        ...tea,
        quantity: 1
      });
      
      // Выделяем карточку
      document.querySelector(`.tea-card[data-dish="${teaKeyword}"]`).classList.add('selected');
    }

    updateSelectedTeasDisplay();
  };

  // Функция для изменения количества
  window.changeQuantity = function(teaKeyword, change) {
    const teaIndex = selectedTeas.findIndex(t => t.keyword === teaKeyword);
    if (teaIndex === -1) return;
    
    const newQuantity = selectedTeas[teaIndex].quantity + change;
    
    // Не позволяем установить количество меньше 1
    if (newQuantity < 1) {
      removeFromOrder(teaKeyword);
      return;
    }
    
    // Ограничиваем максимальное количество (например, 10 = 1000г)
    if (newQuantity > 10) {
      return;
    }
    
    selectedTeas[teaIndex].quantity = newQuantity;
    updateSelectedTeasDisplay();
  };
  
  // Функция для удаления чая из заказа
  window.removeFromOrder = function(teaKeyword) {
    const teaIndex = selectedTeas.findIndex(t => t.keyword === teaKeyword);
    if (teaIndex === -1) return;
    
    // Удаляем чай из заказа
    selectedTeas.splice(teaIndex, 1);
    
    // Снимаем выделение с карточки
    document.querySelector(`.tea-card[data-dish="${teaKeyword}"]`).classList.remove('selected');
    
    updateSelectedTeasDisplay();
  };
  
  // Инициализация
  updateSelectedTeasDisplay();
});
