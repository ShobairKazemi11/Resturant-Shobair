let dishes = JSON.parse(localStorage.getItem("dishes")) || [
        {
          id: 1,
          name: "Chocolate Cake",
          desc: "Freshly baked chocolate cake with rich chocolate frosting",
          price: 7.99,
          category: "dessert",
          img: "assets/images/foods/Cake.jpg",
        },
        {
          id: 2,
          name: "Margherita Pizza",
          desc: "Classic pizza with tomato sauce, mozzarella, and fresh basil",
          price: 12.99,
          category: "main",
          img: "assets/images/foods/pizza.jpg",
        },
        {
          id: 3,
          name: "Creamy Pasta",
          desc: "Rich and creamy pasta with parmesan cheese and herbs",
          price: 14.5,
          category: "main",
          img: "assets/images/foods/pasta.jpg",
        },
        {
          id: 4,
          name: "Ghabuli",
          desc: "Made Up With Rice, Raisin, Meat and ETC...",
          price: 19.99,
          category: "main",
          img: "assets/images/foods/ghabuli.jpg",
        },
      ];