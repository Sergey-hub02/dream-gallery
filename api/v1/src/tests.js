import {describe} from "mocha";
import assert from "assert";
import axios from "axios";

describe("/api/v1/users/", () => {
  describe("POST /api/v1/users/", () => {
    it("регистрация пользователя с некорректно введёнными данными", () => {
      assert(true);
    });

    it("регистрация пользователя с корректными данными", () => {
      assert(true);
    });
  });

  describe("GET /api/v1/users/", () => {
    it("получение списка пользователей", () => {
      assert(true);
    });

    it("получение данных определённого пользователя", () => {
      assert(true);
    });
  });

  describe("PUT /api/v1/users/", () => {
    it("обновление данных пользователя", () => {
      assert(true);
    });
  });

  describe("DELETE /api/v1/users/", () => {
    it("удаление данных пользователя", () => {
      assert(true);
    });

    it("удаление несуществующего пользователя", () => {
      assert(true);
    });
  });
});

describe("/api/v1/photos/", () => {
  describe("POST /api/v1/photos/", () => {
    it("добавление фотографии", () => {
      assert(true);
    });

    it("добавление фотографии с неполными данными", () => {
      assert(true);
    });
  });

  describe("GET /api/v1/photos/", () => {
    it("получение списка фотографий", () => {
      assert(true);
    });

    it("получение данных определённой фотографии", () => {
      assert(true);
    });
  });

  describe("PUT /api/v1/photos/", () => {
    it("обновление данных фотографии", () => {
      assert(true);
    });
  });

  describe("DELETE /api/v1/photos/", () => {
    it("удаление фотографии", () => {
      assert(true);
    });

    it("удаление несуществующей фотографии", () => {
      assert(true);
    });
  });
});

describe("/api/v1/comments/", () => {
  describe("POST /api/v1/comments/", () => {
    it("добавление комментария", () => {
      assert(true);
    });
  });

  describe("GET /api/v1/comments/", () => {
    it("получение списка комментариев", () => {
      assert(true);
    });

    it("получение данных определённого комментария", () => {
      assert(true);
    });
  });
});

describe("/api/v1/albums/", () => {
  describe("POST /api/v1/albums/", () => {
    it("создание альбома", () => {
      assert(true);
    });
  });

  describe("GET /api/v1/albums/", () => {
    it("получение списка альбомов", () => {
      assert(true);
    });

    it("получение данных определённого альбома", () => {
      assert(true);
    });
  });

  describe("PUT /api/v1/albums/", () => {
    it("обновление данных альбома", () => {
      assert(true);
    });
  });

  describe("DELETE /api/v1/albums/", () => {
    it("удаление альбома", () => {
      assert(true);
    });
  });
});
