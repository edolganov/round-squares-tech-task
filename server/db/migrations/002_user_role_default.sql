BEGIN;


CREATE TABLE app_user_role_default (
    login TEXT,
    role_value TEXT NOT NULL references app_role(value)
        on update restrict
        on delete restrict
);
        CREATE INDEX app_user_role_default__login__idx ON app_user_role_default (login);

        INSERT INTO app_user_role_default(login, role_value)
        VALUES
            ('', 'survivor'), -- role for all users
            ('admin', 'admin'), -- admin special
            ('Никита', 'nikita'); -- banned user by default

COMMIT;