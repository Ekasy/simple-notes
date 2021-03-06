# Simple Notes

### Реализация REST API для ведения заметок
В качестве контента выступают типичные заметки, у которых есть заголовок и содержание. У каждого 
пользователя есть свой набор заметок. Фиксируется это следующим образом. За каждым зарегистрированным 
пользователем закрепляется токен, который возвращается в качестве ответа при авторизации пользователя. Он 
будет добавляться в заголовок (в поле *token*) http запроса к серверу при запросе контента.

**Реализованы следующие http методы:**
- GET /api/notes/ - получить все заметки пользователя
- GET /api/notes/pk - получить заметку с номером pk
- POST /api/notes/ - создать заметку с номером pk. <br></br>Пример запроса: <code>{ "title": "Note #1", "description": "Some description" }</code>
- PUT /api/notes/pk - обновить заметку с номером pk
	
	Пример запроса:
	<code>{ "title": "Note #1", "description": "Some description" }</code>
- DELETE /api/notes/pk - удалить заметку с номером pk
- POST /api/login/ - авторизация пользователя

	Пример ответа: 
	<code>{ "username": "andrew", "token": "e91afbef-3cf3-4edc-a76c-3df178cc8755" }</code>
- POST /api/create_user/ - регистрация пользователя

	Пример ответа: 
	<code>{ "username": "andrew", "token": "e91afbef-3cf3-4edc-a76c-3df178cc8755" }</code>

Ответы на POST, PUT, DELETE запросы будут вида:

при успехе <code>{ "success": "Note *{pk}* *{operation}* successful" }</code>

или

при провале <code>{ "error_message": *context*,  "code": *code* }</code>


**Back -end** реализован с помощью django-rest-framework. Данные хранятся в sqlite.


**Front -end** реализован в виде веб странички, которая подгружает данные по мере необходимости. Не стояло задачи грамотно реализовать клиентскую часть, и это мой первый опыт написания на javascript, но вышло более менее достойно. Реализация модального окна взята <a href="https://clck.ru/QXEVH">отсюда</a>.


Ну и немного визуала:
![Окно авторизации](client/screenshotes/auth-reg.png)
![Окно с заметками пользователя](client/screenshotes/notes.png)
![Окно с изменением заметки](client/screenshotes/note.png)
