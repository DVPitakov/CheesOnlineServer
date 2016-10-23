try {

  console.log('Начало блока try');  // (1) <--

  lalala; // ошибка, переменная не определена!

   console.log('Конец блока try');  // (2)

} catch(e) {

   console.log("dick"); // (3) <--

}

 console.log("Потом код продолжит выполнение...");