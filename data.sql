INSERT INTO "Users" ("login", "name", "inviteToken", "password", "profilePic", "createdAt", "updatedAt") VALUES ('login', 'name', '12345', 'password', 'profilePic.jpeg', current_timestamp, current_timestamp);



INSERT INTO "GlobalCategories" ("name", "createdAt", "updatedAt") values ('Донат', current_timestamp, current_timestamp);
INSERT INTO "GlobalCategories" ("name", "createdAt", "updatedAt") values ('Аккаунты', current_timestamp, current_timestamp);
INSERT INTO "GlobalCategories" ("name", "createdAt", "updatedAt") values ('Предметы', current_timestamp, current_timestamp);
INSERT INTO "GlobalCategories" ("name", "createdAt", "updatedAt") values ('Другое', current_timestamp, current_timestamp);
INSERT INTO "GlobalCategories" ("name", "createdAt", "updatedAt") values ('Игровая валюта', current_timestamp, current_timestamp);
INSERT INTO "GlobalCategories" ("name", "createdAt", "updatedAt") values ('Подписки', current_timestamp, current_timestamp);
INSERT INTO "GlobalCategories" ("name", "createdAt", "updatedAt") values ('Аккаунты с играми', current_timestamp, current_timestamp);
INSERT INTO "GlobalCategories" ("name", "createdAt", "updatedAt") values ('Скины', current_timestamp, current_timestamp);
INSERT INTO "GlobalCategories" ("name", "createdAt", "updatedAt") values ('Буст', current_timestamp, current_timestamp);
INSERT INTO "GlobalCategories" ("name", "createdAt", "updatedAt") values ('Медиа', current_timestamp, current_timestamp);
INSERT INTO "GlobalCategories" ("name", "createdAt", "updatedAt") values ('Услуги', current_timestamp, current_timestamp);
INSERT INTO "GlobalCategories" ("name", "createdAt", "updatedAt") values ('Дизайн', current_timestamp, current_timestamp);


INSERT INTO "Apps" ("name", "isGame", "miniPic", "pagePic", "createdAt", "updatedAt") values ('Приложение 1', false, 'game.png', 'roblox.jpg', current_timestamp, current_timestamp);
INSERT INTO "Apps" ("name", "isGame", "miniPic", "pagePic", "createdAt", "updatedAt") values ('Приложение 2', false, 'game.png', 'roblox.jpg', current_timestamp, current_timestamp);
INSERT INTO "Apps" ("name", "isGame", "miniPic", "pagePic", "createdAt", "updatedAt") values ('Геншин', true, 'game.png', 'roblox.jpg', current_timestamp, current_timestamp);
INSERT INTO "Apps" ("name", "isGame", "miniPic", "pagePic", "createdAt", "updatedAt") values ('Игра 2', true, 'game.png', 'roblox.jpg', current_timestamp, current_timestamp);


INSERT INTO "Categories" ("name", "appId", "globalCategoryId", "createdAt", "updatedAt") values ('Аккаунты', 3, 2, current_timestamp, current_timestamp);
INSERT INTO "Categories" ("name", "appId", "globalCategoryId", "createdAt", "updatedAt") values ('Буст', 3, 9, current_timestamp, current_timestamp);
INSERT INTO "Categories" ("name", "appId", "globalCategoryId", "createdAt", "updatedAt") values ('Рандом', 3, 4, current_timestamp, current_timestamp);
INSERT INTO "Categories" ("name", "appId", "globalCategoryId", "createdAt", "updatedAt") values ('Луна', 3, 11, current_timestamp, current_timestamp);
INSERT INTO "Categories" ("name", "appId", "globalCategoryId", "createdAt", "updatedAt") values ('Буст', 4, 9, current_timestamp, current_timestamp);


INSERT INTO "Constraints" ("type", "name", "value", "categoryId", "createdAt", "updatedAt") values ('binary', 'Доступ к почте', '{}', 1, current_timestamp, current_timestamp);
INSERT INTO "Constraints" ("type", "name", "value", "categoryId", "createdAt", "updatedAt") values ('oneOf', 'Игровой сервер', '{server1,server2,server3}', 1, current_timestamp, current_timestamp);
INSERT INTO "Constraints" ("type", "name", "value", "categoryId", "createdAt", "updatedAt") values ('numeric', 'AR', '{1,100}', 1, current_timestamp, current_timestamp);

create a second user

INSERT INTO "Products" ("name", "description", "price", "properties", "pics", "categoryId", "userId", "createdAt", "updatedAt") values ('Аккаунт в геншине', 'Описание аккаунта в геншине', 100, '{"AR": 30, "Доступ к почте": true, "Игровой сервер": "server1"}', '{amogus.jpg}', 1, 1, current_timestamp, current_timestamp);
INSERT INTO "Products" ("name", "description", "price", "properties", "pics", "categoryId", "userId", "createdAt", "updatedAt") values ('Аккаунт в геншине', 'Описание аккаунта в геншине', 200, '{"AR": 40, "Доступ к почте": true, "Игровой сервер": "server2"}', '{amogus.jpg}', 1, 1, current_timestamp, current_timestamp);
INSERT INTO "Products" ("name", "description", "price", "properties", "pics", "categoryId", "userId", "createdAt", "updatedAt") values ('Аккаунт в геншине', 'Описание аккаунта в геншине', 200, '{"AR": 40, "Доступ к почте": true, "Игровой сервер": "server2"}', '{amogus.jpg}', 1, 1, current_timestamp, current_timestamp);
INSERT INTO "Products" ("name", "description", "price", "properties", "pics", "categoryId", "userId", "createdAt", "updatedAt") values ('Аккаунт в геншине', 'Описание аккаунта в геншине', 200, '{"AR": 40, "Доступ к почте": true, "Игровой сервер": "server2"}', '{amogus.jpg}', 1, 1, current_timestamp, current_timestamp);
INSERT INTO "Products" ("name", "description", "price", "properties", "pics", "categoryId", "userId", "createdAt", "updatedAt") values ('Аккаунт в геншине', 'Описание аккаунта в геншине', 300, '{"AR": 50, "Доступ к почте": true, "Игровой сервер": "server3"}', '{amogus.jpg}', 1, 1, current_timestamp, current_timestamp);
INSERT INTO "Products" ("name", "description", "price", "properties", "pics", "categoryId", "userId", "createdAt", "updatedAt") values ('Аккаунт в геншине', 'Описание аккаунта в геншине', 400, '{"AR": 30, "Доступ к почте": false, "Игровой сервер": "server1"}', '{amogus.jpg}', 1, 1, current_timestamp, current_timestamp);
INSERT INTO "Products" ("name", "description", "price", "properties", "pics", "categoryId", "userId", "createdAt", "updatedAt") values ('Аккаунт в геншине', 'Описание аккаунта в геншине', 500, '{"AR": 30, "Доступ к почте": true, "Игровой сервер": "server2"}', '{amogus.jpg}', 1, 1, current_timestamp, current_timestamp);
INSERT INTO "Products" ("name", "description", "price", "properties", "pics", "categoryId", "userId", "createdAt", "updatedAt") values ('Буст в геншине', 'Описание буста в геншине', 600, '{"AR": 30, "Доступ к почте": true, "Игровой сервер": "server3"}', '{amogus.jpg}', 2, 2, current_timestamp, current_timestamp);
INSERT INTO "Products" ("name", "description", "price", "properties", "pics", "categoryId", "userId", "createdAt", "updatedAt") values ('Буст в геншине', 'Описание буста в геншине', 700, '{"AR": 10, "Доступ к почте": false, "Игровой сервер": "server1"}', '{amogus.jpg}', 2, 2, current_timestamp, current_timestamp);
INSERT INTO "Products" ("name", "description", "price", "properties", "pics", "categoryId", "userId", "createdAt", "updatedAt") values ('Буст не в геншине', 'Описание буста не в геншине', 700, '{"AR": 10, "Доступ к почте": false, "Игровой сервер": "server1"}', '{amogus.jpg}', 5, 1, current_timestamp, current_timestamp);
INSERT INTO "Products" ("name", "description", "price", "properties", "pics", "categoryId", "userId", "createdAt", "updatedAt") values ('Буст не в геншине', 'Описание буста не в геншине', 800, '{"AR": 10, "Доступ к почте": false, "Игровой сервер": "server1"}', '{amogus.jpg}', 5, 1, current_timestamp, current_timestamp);


INSERT INTO "Purchases" ("userId", "productId", "sum", "createdAt", "updatedAt") values (1, 1, 150, current_timestamp, current_timestamp);
INSERT INTO "Purchases" ("userId", "productId", "sum", "createdAt", "updatedAt") values (1, 2, 250, current_timestamp, current_timestamp);
INSERT INTO "Purchases" ("userId", "productId", "sum", "createdAt", "updatedAt") values (1, 3, 350, current_timestamp, current_timestamp);

INSERT INTO "ChatRooms" ("name", "createdAt", "updatedAt") values ('1-2', current_timestamp, current_timestamp);
INSERT INTO "RoomAccesses" ("roomId", "userId", "createdAt", "updatedAt") values (1, 1, current_timestamp, current_timestamp);
INSERT INTO "RoomAccesses" ("roomId", "userId", "createdAt", "updatedAt") values (1, 2, current_timestamp, current_timestamp);

INSERT INTO "Reviews" ("text", "rating", "productId", "userId", "createdAt", "updatedAt") values ('testovy otziv 1', 5, 1, 2, current_timestamp, current_timestamp);
INSERT INTO "Reviews" ("text", "rating", "productId", "userId", "createdAt", "updatedAt") values ('testovy otziv 2', 4, 2, 2, current_timestamp, current_timestamp);
INSERT INTO "Reviews" ("text", "rating", "productId", "userId", "createdAt", "updatedAt") values ('testovy otziv 3', 3, 2, 2, current_timestamp, current_timestamp);
INSERT INTO "Reviews" ("text", "rating", "productId", "userId", "createdAt", "updatedAt") values ('testovy otziv 4', 2, 3, 2, current_timestamp, current_timestamp);
INSERT INTO "Reviews" ("text", "rating", "productId", "userId", "createdAt", "updatedAt") values (null, 1, 3, 2, current_timestamp, current_timestamp);
INSERT INTO "Reviews" ("text", "rating", "productId", "userId", "createdAt", "updatedAt") values (null, 5, 3, 2, current_timestamp, current_timestamp);


INSERT INTO "GenericData" ("key", "value", "createdAt", "updatedAt") values ('email', 'email@email.ru', current_timestamp, current_timestamp);

`;
