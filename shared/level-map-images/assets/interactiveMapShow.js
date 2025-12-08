const urlParams = new URLSearchParams(window.location.search);
      console.log(urlParams.get('showmap'));
      if (urlParams.get('showmap') == 1) {
        console.log("xxx ", document.querySelector("div.wrapper").getBoundingClientRect().width);
        document.querySelector('.interactivemappopup').classList.add('visible');
      }