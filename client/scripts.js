var root_url = 'http://127.0.0.1:8000/api/';
var token = '';


function makeAuth(obj) {
  console.log(obj.classList[0]);
  var reg = '';
  var way = 'login/';
  if (obj.classList[0] == 'reg') {
    reg = '_reg';
    way = 'create_user/';
  }
  var login = document.getElementById('login' + reg).value;
  var password = document.getElementById('password' + reg).value;

  // сформировать пост запрос на сервер с регистрацией
  var http = new XMLHttpRequest();
  data = {
    "username": login,
    "password": password
  };

  http.open('POST', root_url + way, true);
  http.setRequestHeader('content-type', 'application/json');
  http.onreadystatechange = function() {
    if (this.readyState === 4 && this.status === 200) {
      var json = JSON.parse(this.responseText);
      username = json.username;
      token = json.token;

      var app = document.getElementById('auth');
      app.parentNode.removeChild(app);
      app = document.getElementById('reg');
      app.parentNode.removeChild(app);

      // подготовить страничку к отображению заметок
      generateNotes();
    }
  };
  http.send(JSON.stringify(data));
}


function generateNotes() {
  var node = document.getElementById('root');
  var container = document.createElement("div");
  container.setAttribute('class', 'container');
  container.setAttribute('id', 'container');
  node.appendChild(container);

  //отобразить заметки пользователя
  getNotes();
}


function getNotes() {
  var request = new XMLHttpRequest();
  request.open('GET', root_url + 'notes/', true);
  request.setRequestHeader('token', String(token));
  request.onload = function () {
    var data = JSON.parse(this.response);
    data.notes.forEach((note) => {
      const card = document.createElement('a');
      card.setAttribute('href', '#');
      card.setAttribute('class', 'js-open-modal card');
      card.setAttribute('data-modal', note.id.toString());

      const title = document.createElement('p');
      title.setAttribute('class', 'title')
      title.textContent = note.title;

      const p = document.createElement('p');
      p.setAttribute('class', 'description');
      // note.content = note.content.substring(0, 300);
      p.textContent = `${note.description}`;

      var container = document.getElementById('container');
      container.appendChild(card);
      card.appendChild(title);
      card.appendChild(p);
    });

    const card = document.createElement('a');
    card.setAttribute('href', '#');
    card.setAttribute('class', 'js-open-modal card');
    card.setAttribute('data-modal', 'new_note');

    var p = document.createElement('p');
    p.setAttribute('class', 'new-note');
    p.textContent = 'New note';

    card.appendChild(p);

    var container = document.getElementById('container');
    container.appendChild(card)

    modalFunctional();
  };
  request.send(null);

}

function modalFunctional() {
  var modalButtons = document.querySelectorAll('.js-open-modal'),
      overlay = document.querySelector('.js-overlay-modal');

  /* Перебираем массив кнопок */
  modalButtons.forEach(function(item) {

      /* Назначаем каждой кнопке обработчик клика */
      item.addEventListener('click', function(e) {

          e.preventDefault();

          var modalId = this.getAttribute('data-modal');
          for (let i = 0; i < this.childNodes.length; i++) {
            console.log(this.childNodes[i]);
          }

          var title = '';
          var description = '';

          if (modalId != 'new_note') {
            console.log(modalId);
            title = this.childNodes[0].textContent;
            description = this.childNodes[1].textContent;
          }

          const modal_window = document.createElement('div');
          modal_window.setAttribute('class', 'modal');
          modal_window.setAttribute('data-modal', modalId.toString());

          let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
          svg.setAttribute('class', 'modal__cross js-modal-close');
          svg.setAttribute('viewBox', '0 0 24 24');

          let path = document.createElementNS("http://www.w3.org/2000/svg", "path");
          path.setAttribute("d", "M23.954 21.03l-9.184-9.095 9.092-9.174-2.832-2.807-9.09 9.179-9.176-9.088-2.81 2.81 9.186 9.105-9.095 9.184 2.81 2.81 9.112-9.192 9.18 9.1z");
          path.setAttribute("onclick", "deleteNote()");

          const p1 = document.createElement('input');
          p1.setAttribute('type', 'text');
          p1.setAttribute('maxlength', '20');
          p1.setAttribute('size', '32');
          p1.value = title;

          const p2 = document.createElement('textarea');
          p2.setAttribute('cols', '50');
          p2.setAttribute('rows', '20');
          p2.setAttribute('placeholder', 'Enter note')
          p2.value = description;

          var modal_windows = document.getElementById('modal_windows');
          svg.appendChild(path);
          modal_window.appendChild(svg);
          modal_window.appendChild(p1);
          modal_window.appendChild(p2);
          modal_windows.appendChild(modal_window);

          modal_window.classList.add('active');
          overlay.classList.add('active');
      }); // end click

  }); // end foreach


  document.body.addEventListener('keyup', function(e) {
      var key = e.keyCode;

      if (key == 27) {

          document.querySelector('.modal.active').classList.remove('active');
          document.querySelector('.overlay').classList.remove('active');

          var modal_window = document.querySelector('.modal');
          modal_window.parentNode.removeChild(modal_window);
      };
  }, false);


  overlay.addEventListener('click', function() {
      document.querySelector('.modal.active').classList.remove('active');
      this.classList.remove('active');

      var modal_window = document.querySelector('.modal');

      title = modal_window.childNodes[1].value == '' ? 'Title' : modal_window.childNodes[1].value;
      description = modal_window.childNodes[2].value == '' ? 'Enter note' : modal_window.childNodes[2].value;

      var http = new XMLHttpRequest();
      data = {
        "title": title,
        "description": description
      };

      var note_id = modal_window.getAttribute('data-modal')

      if (note_id == 'new_note') {
        http.open('POST', root_url + 'notes/', true);
      }
      else {
        http.open('PUT', root_url + 'notes/' + note_id, true);
      }

      http.setRequestHeader('content-type', 'application/json');
      http.setRequestHeader('token', String(token));
      http.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
          var notes = document.querySelectorAll('.js-open-modal');
          for (let i = 0; i < notes.length; i++) {
            if (notes[i].getAttribute('data-modal') == note_id && note_id != 'new_note') {
              note = notes[i];
              note.childNodes[0].textContent = title;
              note.childNodes[1].textContent = description;
            }
          }

          modal_window.parentNode.removeChild(modal_window);

          if (note_id == 'new_note') {
            var container = document.querySelector('.container');
            console.log(container);
            container.parentNode.removeChild(container);
            generateNotes();
          }
        }
      };
      http.send(JSON.stringify(data));
  });
}


function deleteNote() {
  document.querySelector('.modal.active').classList.remove('active');
  document.querySelector('.overlay.js-overlay-modal.active').classList.remove('active');

  var modal_window = document.querySelector('.modal');
  var http = new XMLHttpRequest();
  var note_id = modal_window.getAttribute('data-modal')

  if (note_id == 'new_note') {
    modal_window.parentNode.removeChild(modal_window);
  }
  else {
    http.open('DELETE', root_url + 'notes/' + note_id, true);
    http.setRequestHeader('content-type', 'application/json');
    http.setRequestHeader('token', String(token));
    http.onload = function() {
      if (this.readyState === 4 && this.status === 200) {
        var json = JSON.parse(this.responseText);
        var notes = document.querySelectorAll('.js-open-modal');
        for (let i = 0; i < notes.length; i++) {
          if (notes[i].getAttribute('data-modal') == note_id) {
            var note = notes[i];
            note.parentNode.removeChild(note);
          }
        }

        modal_window.parentNode.removeChild(modal_window);
      }
    };
    http.send();
  }
}
